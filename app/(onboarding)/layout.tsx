import { ThemeProvider } from "@/components/theme-provider";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-white dark:bg-neutral-950">
        {children}
      </div>
    </ThemeProvider>
  );
}
