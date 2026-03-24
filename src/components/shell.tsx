"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/visitor", label: "Visitor" },
  { href: "/operator", label: "Operator" },
  { href: "/admin", label: "Admin" },
];

export function AppShell({
  children,
  title,
  eyebrow,
}: {
  children: ReactNode;
  title: string;
  eyebrow: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(243,190,75,0.16),_transparent_34%),linear-gradient(180deg,_#07120f_0%,_#091915_48%,_#06100d_100%)] text-stone-100">
      <header className="border-b border-white/10 bg-black/10 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.32em] text-amber-200/75">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[0.08em] text-stone-50">{title}</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-amber-300 bg-amber-300 text-black"
                      : "border-white/15 bg-white/5 text-stone-200 hover:border-white/30 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">{children}</main>
    </div>
  );
}
