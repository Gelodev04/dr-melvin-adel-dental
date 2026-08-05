import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import { clinicConfig } from "@/lib/clinic-config";

export const dynamic = "force-dynamic";

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const appointment = id
    ? await prisma.appointment.findUnique({
        where: { id },
        include: { service: true, doctor: true },
      })
    : null;

  const when = appointment
    ? formatInTimeZone(
        appointment.startAt,
        clinicConfig.timezone,
        "EEEE, MMM d · h:mm a"
      )
    : null;

  return (
    <div className="min-h-[70vh] bg-mist pb-20 pt-24">
      <div className="mx-auto max-w-xl border-2 border-brand-900 bg-paper">
        <div className="border-b-4 border-[var(--accent)] bg-brand-900 px-6 py-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
            Request sent
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight">
            We got it
          </h1>
        </div>
        <div className="space-y-4 px-6 py-8 text-sm">
          {appointment ? (
            <>
              <p>
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-600">
                  Service
                </span>
                <span className="font-display text-lg font-bold uppercase">
                  {appointment.service.name}
                </span>
              </p>
              <p>
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-600">
                  When
                </span>
                <span className="font-medium">{when}</span>
              </p>
              <p>
                <span className="block text-xs font-bold uppercase tracking-wider text-brand-600">
                  Dentist
                </span>
                <span className="font-medium">{appointment.doctor.name}</span>
              </p>
              <p className="border-t-2 border-brand-200 pt-4 text-brand-800/75">
                Pending confirmation. Check your email — or call{" "}
                <a
                  href={`tel:${clinicConfig.phone}`}
                  className="font-bold text-brand-700"
                >
                  {clinicConfig.phoneDisplay}
                </a>{" "}
                if you need to change anything.
              </p>
            </>
          ) : (
            <p className="text-brand-800/75">
              Your request was submitted. Call {clinicConfig.phoneDisplay} for
              changes.
            </p>
          )}
          <Link
            href="/"
            className="mt-4 inline-flex bg-brand-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
