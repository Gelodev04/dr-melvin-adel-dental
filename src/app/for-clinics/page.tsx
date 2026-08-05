import Link from "next/link";
import { clinicConfig } from "@/lib/clinic-config";

export const metadata = {
  title: "For clinic owners",
  description: "Custom clinic websites with booking — Philippines",
};

export default function ForClinicsPage() {
  return (
    <div className="bg-mist pb-20 pt-24">
      <section className="border-b-4 border-[var(--accent)] bg-brand-900 px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--accent)]">
            For clinic owners
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
            A site patients can actually book on
          </h1>
          <p className="mt-4 text-brand-200">
            This page is the sales kit for {clinicConfig.shortName} — show the
            live demo, then close setup + retainer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-brand-900"
            >
              View demo
            </Link>
            <Link
              href="/book"
              className="border-2 border-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-white"
            >
              Try booking
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-0 px-4 pt-10 sm:grid-cols-3 sm:px-6">
        {[
          ["Setup", "from ₱25,000", "Branded site + booking + admin"],
          ["Monthly", "from ₱2,500", "Hosting + emails + small edits"],
          ["Add-ons", "as needed", "SMS, GCash, Messenger"],
        ].map(([name, price, body]) => (
          <article
            key={name}
            className="border-2 border-brand-900 bg-paper p-6 sm:-ml-px"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
              {name}
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold uppercase">
              {price}
            </p>
            <p className="mt-2 text-sm text-brand-800/70">{body}</p>
          </article>
        ))}
      </section>

      <p className="mx-auto mt-10 max-w-2xl px-4 text-center text-sm text-brand-800/70 sm:px-6">
        Staff demo: admin@drmelvinadel.ph / demo1234
      </p>
    </div>
  );
}
