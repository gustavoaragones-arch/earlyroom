import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface StaffInput {
  id: string;
  speed_factor: number;
  first_name: string | null;
}

interface RoomInput {
  id: string;
  room_number: string;
  floor: number;
  room_type: string;
  base_clean_time: number;
  avg_clean_time: number | null;
  priority: number;
  is_departure: boolean;
}

interface AssignmentResult {
  staff_id: string;
  staff_name: string | null;
  room_ids: string[];
  room_numbers: string[];
  estimated_minutes: number;
  floor_cluster: number[];
}

const BASE_TIMES: Record<string, number> = {
  standard: 25,
  queen: 30,
  king: 35,
  double: 35,
  suite: 45,
  studio: 30,
  accessible: 35,
};

const DEPARTURE_EXTRA = 10;

function runAssignmentAlgorithm(
  staff: StaffInput[],
  rooms: RoomInput[]
): AssignmentResult[] {
  if (staff.length === 0 || rooms.length === 0) return [];

  const roomsWithTime = rooms.map((room) => {
    const base =
      room.avg_clean_time ??
      BASE_TIMES[room.room_type] ??
      room.base_clean_time ??
      30;
    const time = room.is_departure ? base + DEPARTURE_EXTRA : base;
    return { ...room, effective_time: time };
  });

  const sorted = [...roomsWithTime].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.effective_time - a.effective_time;
  });

  const byFloor = new Map<number, typeof sorted>();
  for (const room of sorted) {
    if (!byFloor.has(room.floor)) byFloor.set(room.floor, []);
    byFloor.get(room.floor)!.push(room);
  }
  const floorsSorted = [...byFloor.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );
  const clustered = floorsSorted.flatMap(([, rooms]) => rooms);

  const workload = new Map<string, number>();
  const assigned = new Map<string, string[]>();
  for (const s of staff) {
    workload.set(s.id, 0);
    assigned.set(s.id, []);
  }

  for (const room of clustered) {
    let bestStaff = staff[0];
    let bestLoad = Infinity;
    for (const s of staff) {
      const current = workload.get(s.id) ?? 0;
      if (current < bestLoad) {
        bestLoad = current;
        bestStaff = s;
      }
    }
    const adjustedTime = room.effective_time / bestStaff.speed_factor;
    workload.set(bestStaff.id, (workload.get(bestStaff.id) ?? 0) + adjustedTime);
    assigned.get(bestStaff.id)!.push(room.id);
  }

  const MAX_DEVIATION = 10;
  let iterations = 0;
  const MAX_ITERATIONS = 20;

  while (iterations < MAX_ITERATIONS) {
    const loads = [...workload.entries()];
    const maxEntry = loads.reduce((a, b) => (a[1] > b[1] ? a : b));
    const minEntry = loads.reduce((a, b) => (a[1] < b[1] ? a : b));
    if (maxEntry[1] - minEntry[1] <= MAX_DEVIATION) break;

    const maxRooms = assigned.get(maxEntry[0])!;
    const minRooms = assigned.get(minEntry[0])!;
    if (maxRooms.length === 0) break;

    const target = maxEntry[1] - minEntry[1];
    let bestRoom: string | null = null;
    let bestDiff = Infinity;
    const maxStaff = staff.find((s) => s.id === maxEntry[0])!;
    const minStaff = staff.find((s) => s.id === minEntry[0])!;

    for (const roomId of maxRooms) {
      const room = clustered.find((r) => r.id === roomId)!;
      const moveTime = room.effective_time / maxStaff.speed_factor;
      const receiveTime = room.effective_time / minStaff.speed_factor;
      const newMax = maxEntry[1] - moveTime;
      const newMin = minEntry[1] + receiveTime;
      const diff = Math.abs(newMax - newMin);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestRoom = roomId;
      }
    }
    if (!bestRoom) break;

    const room = clustered.find((r) => r.id === bestRoom)!;
    const moveTime = room.effective_time / maxStaff.speed_factor;
    const receiveTime = room.effective_time / minStaff.speed_factor;
    assigned.set(maxEntry[0], maxRooms.filter((id) => id !== bestRoom));
    minRooms.push(bestRoom!);
    workload.set(maxEntry[0], (workload.get(maxEntry[0]) ?? 0) - moveTime);
    workload.set(minEntry[0], (workload.get(minEntry[0]) ?? 0) + receiveTime);
    iterations++;
  }

  return staff.map((s) => {
    const roomIds = assigned.get(s.id) ?? [];
    const roomDetails = roomIds
      .map((id) => clustered.find((r) => r.id === id)!)
      .filter(Boolean);
    const floors = [...new Set(roomDetails.map((r) => r.floor))].sort();
    const totalMinutes = Math.round(workload.get(s.id) ?? 0);
    return {
      staff_id: s.id,
      staff_name: s.first_name,
      room_ids: roomIds,
      room_numbers: roomDetails.map((r) => r.room_number),
      estimated_minutes: totalMinutes,
      floor_cluster: floors,
    };
  });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: userData } = await supabase
      .from("users")
      .select("hotel_id, role")
      .eq("id", user.id)
      .single();

    if (!userData?.hotel_id) {
      return NextResponse.json({ error: "No hotel found" }, { status: 400 });
    }
    if (
      !["owner", "manager", "supervisor"].includes(userData.role as string)
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const date = body.date ?? new Date().toISOString().split("T")[0];
    const staffIds: string[] | undefined = body.staff_ids;

    let staffQuery = supabase
      .from("users")
      .select("id, first_name, speed_factor")
      .eq("hotel_id", userData.hotel_id)
      .eq("role", "housekeeper")
      .eq("is_active", true);

    if (staffIds && staffIds.length > 0) {
      staffQuery = staffQuery.in("id", staffIds);
    }
    const { data: staff, error: staffError } = await staffQuery;
    if (staffError || !staff || staff.length === 0) {
      return NextResponse.json(
        {
          error:
            "No active housekeepers found. Add team members first.",
        },
        { status: 400 }
      );
    }

    const { data: jobs, error: jobsError } = await supabase
      .from("cleaning_jobs")
      .select(
        `
        id,
        priority,
        is_departure,
        is_stayover,
        rooms (
          id,
          room_number,
          floor,
          room_type,
          base_clean_time,
          avg_clean_time
        )
      `
      )
      .eq("hotel_id", userData.hotel_id)
      .eq("job_date", date)
      .in("status", ["assigned", "in_progress"]);

    if (jobsError) {
      return NextResponse.json(
        { error: jobsError.message },
        { status: 500 }
      );
    }
    if (!jobs || jobs.length === 0) {
      return NextResponse.json(
        {
          error:
            "No rooms to assign for today. Add cleaning jobs first.",
        },
        { status: 400 }
      );
    }

    const roomInputs: RoomInput[] = jobs.map((job: Record<string, unknown>) => {
      const rooms = job.rooms as Record<string, unknown> | null;
      return {
        id: job.id as string,
        room_number: (rooms?.room_number as string) ?? "",
        floor: (rooms?.floor as number) ?? 1,
        room_type: (rooms?.room_type as string) ?? "standard",
        base_clean_time: (rooms?.base_clean_time as number) ?? 30,
        avg_clean_time: (rooms?.avg_clean_time as number) ?? null,
        priority: (job.priority as number) ?? 0,
        is_departure: (job.is_departure as boolean) ?? true,
      };
    });

    const results = runAssignmentAlgorithm(staff as StaffInput[], roomInputs);

    await supabase
      .from("assignments")
      .delete()
      .eq("hotel_id", userData.hotel_id)
      .eq("assignment_date", date);

    const assignmentRows = results.map((r) => ({
      hotel_id: userData.hotel_id,
      staff_id: r.staff_id,
      assignment_date: date,
      job_ids: r.room_ids,
      estimated_minutes: r.estimated_minutes,
      floor_cluster: r.floor_cluster,
    }));

    const { error: insertError } = await supabase
      .from("assignments")
      .insert(assignmentRows);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    for (const result of results) {
      for (const jobId of result.room_ids) {
        await supabase
          .from("cleaning_jobs")
          .update({
            assigned_to: result.staff_id,
            status: "assigned",
          })
          .eq("id", jobId);
      }
    }

    const minutes = results.map((r) => r.estimated_minutes);
    const maxLoad = Math.max(...minutes);
    const minLoad = Math.min(...minutes);
    const deviation = maxLoad - minLoad;
    const score = Math.max(0, Math.round(100 - deviation * 2));

    return NextResponse.json({
      success: true,
      assignments: results,
      stats: {
        total_rooms: roomInputs.length,
        total_staff: staff.length,
        max_deviation_minutes: deviation,
        balance_score: score,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
