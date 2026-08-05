import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { clinicConfig } from "@/lib/clinic-config";
import { formatPhp } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const clinic = await prisma.clinic.findFirst({
    include: {
      services: { where: { active: true }, orderBy: { sortOrder: "asc" } },
      doctors: { where: { active: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  const services = clinic?.services ?? [];
  const doctors = clinic?.doctors ?? [];
  const dentist = doctors[0];

  return (
    <>
      {/* Hero: centered community-clinic composition (vs Ashley bottom-left luxury) */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <img
          src={clinicConfig.hero.imageUrl}
          alt={clinicConfig.hero.imageAlt}
          className="animate-kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(10,47,61,0.5) 0%, rgba(10,47,61,0.84) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
          <p className="animate-rise font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl">
            {clinicConfig.shortName}
          </p>
          <p className="animate-rise-delay mt-3 font-display text-lg font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:text-xl">
            Dr. Melvin H. Adel
          </p>
          <h1 className="animate-rise-delay mt-8 font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
            {clinicConfig.hero.headline}
          </h1>
          <p className="animate-rise-delay-2 mx-auto mt-4 max-w-md text-base text-white/85">
            {clinicConfig.hero.subhead}
          </p>
          <div className="animate-rise-delay-2 mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/book"
              className="bg-[var(--accent)] px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-brand-900 transition hover:brightness-105"
            >
              {clinicConfig.hero.cta}
            </Link>
            <a
              href={`tel:${clinicConfig.phone}`}
              className="border-2 border-white/80 bg-transparent px-8 py-3.5 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
            >
              {clinicConfig.hero.secondaryCta}
            </a>
          </div>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
            {clinicConfig.trustLine}
          </p>
        </div>

        <a
          href="#services"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60"
        >
          Scroll
        </a>
      </section>

      {/* Services: timetable / menu-board (vs Ashley divide-y list) */}
      <section id="services" className="bg-brand-900 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col gap-2 border-b-2 border-[var(--accent)] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
                Price guide
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
                What we do
              </h2>
            </div>
            <p className="max-w-xs text-sm text-brand-200">
              Guide prices in PHP. Final fee after checkup.
            </p>
          </div>

          <ul className="mt-2">
            {services.map((s, i) => (
              <li
                key={s.id}
                className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-3 border-b border-white/15 py-5 sm:grid-cols-[4rem_1fr_8rem]"
              >
                <span className="font-display text-2xl font-bold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-xl font-bold uppercase tracking-wide sm:text-2xl">
                    {s.name}
                  </p>
                  {s.description && (
                    <p className="mt-1 max-w-lg text-sm text-brand-200">
                      {s.description}
                    </p>
                  )}
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
                    {s.durationMin} minutes
                  </p>
                </div>
                <p className="text-right font-display text-lg font-bold text-[var(--accent)] sm:text-xl">
                  {formatPhp(s.pricePhp)}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href="/book"
            className="mt-10 inline-flex bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-900"
          >
            Reserve a slot
          </Link>
        </div>
      </section>

      {/* Dentist: light panel + oversized name (vs Ashley dark block) */}
      <section id="doctors" className="relative overflow-hidden bg-paper py-24">
        <p
          aria-hidden
          className="pointer-events-none absolute -right-4 top-8 select-none font-display text-[8rem] font-extrabold uppercase leading-none text-brand-100 sm:text-[12rem]"
        >
          Adel
        </p>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
            Your dentist
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-brand-900 sm:text-5xl">
            {dentist?.name ?? clinicConfig.dentistName}
          </h2>
          {dentist?.title && (
            <p className="mt-3 text-sm font-bold uppercase tracking-[0.15em] text-brand-600">
              {dentist.title} · San Pascual
            </p>
          )}
          {dentist?.bio && (
            <p className="animate-slide-left mt-8 max-w-xl border-l-4 border-[var(--accent)] pl-5 text-base leading-relaxed text-brand-800/80">
              {dentist.bio}
            </p>
          )}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/book"
              className="bg-brand-600 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-700"
            >
              Book with Dr. Melvin
            </Link>
            <a
              href={`tel:${clinicConfig.phone}`}
              className="border-2 border-brand-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-900 hover:bg-brand-900 hover:text-white"
            >
              {clinicConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* How it works: vertical timeline (vs Ashley 3-column) */}
      <section id="how" className="bg-mist py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
            How booking works
          </p>
          <h2 className="mt-2 font-display text-4xl font-extrabold uppercase tracking-tight text-brand-900">
            Three moves
          </h2>
          <ol className="relative mt-12 space-y-0 border-l-2 border-brand-600 pl-8">
            {clinicConfig.howItWorks.map((item) => (
              <li key={item.step} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[2.55rem] top-0 flex h-8 w-8 items-center justify-center bg-brand-600 font-display text-xs font-bold text-white">
                  {item.step}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-800/75">
                  {item.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact: call-first band (vs Ashley split + rounded card) */}
      <section id="contact" className="bg-brand-600 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-100">
            Visit / call
          </p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            {clinicConfig.city}
          </h2>
          <p className="mt-2 text-brand-100">{clinicConfig.hoursSummary}</p>
          <a
            href={`tel:${clinicConfig.phone}`}
            className="mt-8 inline-block font-display text-4xl font-extrabold tracking-tight text-[var(--accent)] transition hover:underline sm:text-5xl"
          >
            {clinicConfig.phoneDisplay}
          </a>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/book"
              className="bg-[var(--accent)] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-900"
            >
              Book online instead
            </Link>
            {clinicConfig.mapsUrl && (
              <a
                href={clinicConfig.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="border-2 border-white/50 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-white/10"
              >
                Open maps
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
