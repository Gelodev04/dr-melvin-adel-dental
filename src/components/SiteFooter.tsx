"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clinicConfig } from "@/lib/clinic-config";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t-4 border-[var(--accent)] bg-brand-900 text-brand-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-2xl font-extrabold uppercase tracking-tight text-white">
            {clinicConfig.shortName}
          </p>
          <p className="mt-1 text-sm text-brand-200">{clinicConfig.city}</p>
          <p className="mt-1 text-sm text-brand-200">{clinicConfig.hoursSummary}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm sm:items-end">
          <a
            className="font-display text-2xl font-bold text-[var(--accent)] hover:underline"
            href={`tel:${clinicConfig.phone}`}
          >
            {clinicConfig.phoneDisplay}
          </a>
          <div className="flex gap-4">
            <Link href="/book" className="font-semibold text-white hover:underline">
              Book online
            </Link>
            <Link
              href="/admin/login"
              className="text-brand-300 hover:underline"
            >
              Staff
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
