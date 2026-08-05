import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clinicConfig } from "@/lib/clinic-config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-mist/40">
      <header className="border-b border-brand-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <Link
              href={session ? "/admin" : "/admin/login"}
              className="font-display text-xl font-semibold text-brand-800"
            >
              {clinicConfig.shortName} Admin
            </Link>
            <p className="text-xs text-brand-800/50">Clinic staff only</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            <Link href="/" className="text-brand-700 hover:underline">
              View site
            </Link>
            {session && (
              <>
                <Link href="/admin" className="font-medium text-brand-800">
                  Appointments
                </Link>
                <Link
                  href="/admin/services"
                  className="text-brand-700 hover:underline"
                >
                  Services
                </Link>
                <Link
                  href="/admin/hours"
                  className="text-brand-700 hover:underline"
                >
                  Hours
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="text-brand-700 hover:underline"
                >
                  Sign out
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
