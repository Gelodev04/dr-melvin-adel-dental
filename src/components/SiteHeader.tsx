"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clinicConfig } from "@/lib/clinic-config";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-40"
          : "sticky top-0 z-40 border-b-2 border-brand-900 bg-paper"
      }
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="min-w-0">
          <span
            className={`block font-display text-lg font-extrabold uppercase tracking-tight sm:text-xl ${
              isHome ? "text-white" : "text-brand-900"
            }`}
          >
            {clinicConfig.shortName}
          </span>
          <span
            className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${
              isHome ? "text-white/70" : "text-brand-600"
            }`}
          >
            San Pascual
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href={`tel:${clinicConfig.phone}`}
            className={`hidden text-sm font-bold sm:inline ${
              isHome ? "text-white" : "text-brand-800"
            }`}
          >
            {clinicConfig.phoneDisplay}
          </a>
          <Link
            href="/book"
            className={
              isHome
                ? "bg-[var(--accent)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-900 transition hover:brightness-105"
                : "bg-brand-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-700"
            }
          >
            Book
          </Link>
        </div>
      </div>
    </header>
  );
}
