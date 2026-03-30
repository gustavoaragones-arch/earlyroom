"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/button";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const resourcesColumn = [
    { title: "Blog", href: "#", description: "Updates on housekeeping and early check-in" },
    { title: "Documentation", href: "#", description: "Setup guides and PMS integration docs" },
    { title: "Help Center", href: "#", description: "Support and FAQs for earlyroom" },
    { title: "Changelog", href: "#", description: "Product updates and new features" },
    { title: "Tutorials", href: "#", description: "Learn room assignment and workflows" },
  ];

  const { scrollY } = useScroll();
  const paddingHorizontal = useTransform(scrollY, [0, 50], [0, 16]);
  const paddingVertical = useTransform(scrollY, [0, 50], [0, 8]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasScrolled(latest > 10);
    const scrollingDown = latest > lastScrollY.current;
    const scrollDelta = Math.abs(latest - lastScrollY.current);
    if (scrollDelta > 5) {
      if (scrollingDown && latest > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = latest;
    }
  });

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ paddingLeft: paddingHorizontal, paddingRight: paddingHorizontal, paddingTop: paddingVertical }}
      className="fixed inset-x-0 z-50 mx-auto w-full max-w-7xl"
    >
      <motion.div
        animate={{
          borderRadius: hasScrolled ? 24 : 0,
          backdropFilter: hasScrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.3 }}
        className={`flex h-14 items-center justify-between px-4 transition-colors duration-300 sm:h-16 md:px-8 ${
          hasScrolled
            ? "bg-white/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-neutral-900/80 dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3),0_1px_2px_-1px_rgba(0,0,0,0.3)]"
            : "bg-transparent shadow-none"
        }`}
        data-scrolled={hasScrolled}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <LogoIcon className="relative z-20 h-[45px] w-[45px]" />
          <span className="text-base font-semibold text-black sm:text-lg dark:text-white">
            earlyroom
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex lg:gap-8">
          <Link href="/#product" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
            Product
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
            Pricing
          </Link>
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-auto rounded-none bg-transparent p-0 text-sm font-medium text-neutral-600 transition-colors hover:bg-transparent hover:text-neutral-900 focus:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 data-[state=open]:bg-transparent data-[state=open]:text-neutral-900 data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent dark:text-neutral-400 dark:hover:text-white dark:data-[state=open]:text-white">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent className="flex w-fit overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-900 dark:shadow-white/5 dark:ring-white/5">
                  <div className="p-3 lg:p-4">
                    {resourcesColumn.map((item) => (
                      <Link key={item.title} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">{item.title}</div>
                      </Link>
                    ))}
                  </div>
                  <div className="hidden w-44 bg-neutral-100/50 p-4 lg:block lg:w-52 dark:bg-neutral-800/50">
                    <div className="flex h-full flex-col justify-between">
                      <div className="mt-2">
                        <p className="text-xs text-neutral-400">PMS integration with Cloudbeds and Mews now available.</p>
                        <Image src="https://assets.aceternity.com/components/bento-grid-illustrations.webp" alt="earlyroom dashboard" width={100} height={100} className="mt-2 w-full rounded-md object-cover shadow-sm ring-1 shadow-black/10 ring-black/10" />
                      </div>
                      <Link href="#" className="text-brand-primary mt-4 inline-flex items-center gap-1 text-xs font-medium">
                        See changelog <Arrow className="size-3" />
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link href="#" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
            Contact
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex lg:gap-4">
          <Link href="/login" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="relative inline-flex cursor-pointer items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] from-brand-secondary to-brand-primary bg-linear-to-b text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] hover:from-brand-secondary hover:to-brand-primary hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_3px_5px_rgba(30,144,255,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            Start free trial
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex size-10 items-center justify-center rounded-md lg:hidden" aria-label="Toggle menu">
          {mobileMenuOpen ? <CloseIcon className="size-5 text-neutral-900 dark:text-white" /> : <MenuIcon className="size-5 text-neutral-900 dark:text-white" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, y: mobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed inset-0 top-14 z-40 flex flex-col bg-white sm:top-16 lg:hidden dark:bg-neutral-900 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <Link href="#" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800">Product</Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800">Pricing</Link>
            <div>
              <button onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)} className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800">
                Resources
                <ChevronDownIcon className={`size-5 transition-transform duration-200 ${mobileResourcesOpen ? "rotate-180" : ""}`} />
              </button>
              <motion.div initial={false} animate={{ height: mobileResourcesOpen ? "auto" : 0, opacity: mobileResourcesOpen ? 1 : 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="mt-1 ml-4 flex flex-col gap-1 border-l-2 border-neutral-200 py-2 pl-4 dark:border-neutral-700">
                  {resourcesColumn.map((item) => (
                    <Link key={item.title} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex flex-col rounded-lg px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <span className="text-base font-medium text-neutral-800 dark:text-neutral-200">{item.title}</span>
                      <span className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{item.description}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
            <Link href="#" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-4 py-3.5 text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800">Contact</Link>
          </div>
          <div className="mt-auto pt-6">
            <div className="mb-6 h-px w-full bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.15)_20%,rgba(0,0,0,0.15)_80%,transparent)] mask-[repeating-linear-gradient(to_right,black_0px,black_4px,transparent_4px,transparent_8px)] dark:hidden" />
            <div className="mb-6 hidden h-px w-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2)_20%,rgba(255,255,255,0.2)_80%,transparent)] mask-[repeating-linear-gradient(to_right,black_0px,black_4px,transparent_4px,transparent_8px)] dark:block" />
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full rounded-xl border border-neutral-300 px-4 py-3.5 text-center text-base font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800">Sign in</Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 flex w-full items-center justify-center rounded-xl from-brand-secondary to-brand-primary bg-linear-to-b px-4 py-3.5 text-base font-medium text-white transition-all duration-200 active:scale-[0.98] [text-shadow:0_1px_2px_rgba(0,0,0,0.2)] hover:from-brand-secondary hover:to-brand-primary hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_3px_5px_rgba(30,144,255,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src="/early_room.png"
      alt="earlyroom"
      width={45}
      height={45}
      className={className}
    />
  );
};

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6L6 18" /><path d="M6 6l12 12" />
  </svg>
);

const Arrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" />
  </svg>
);
