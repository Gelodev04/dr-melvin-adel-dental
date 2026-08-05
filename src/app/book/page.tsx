"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPhp } from "@/lib/utils";
import { clinicConfig } from "@/lib/clinic-config";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  pricePhp: number | null;
};

type Doctor = {
  id: string;
  name: string;
  title: string | null;
};

type Slot = { startAt: string; endAt: string; label: string };

function todayIso() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

/** Single-page intake form — different UX from Ashley's step wizard */
export default function BookPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(todayIso());
  const [slot, setSlot] = useState<Slot | null>(null);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => setServices(data.services ?? []))
      .catch(() => setError("Could not load services."));
  }, []);

  useEffect(() => {
    if (!serviceId) {
      setDoctorId("");
      return;
    }
    fetch(`/api/catalog?serviceId=${serviceId}`)
      .then((r) => r.json())
      .then((data) => {
        const list: Doctor[] = data.doctors ?? [];
        if (list[0]) setDoctorId(list[0].id);
      })
      .catch(() => setError("Could not load dentist."));
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId || !doctorId || !date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSlot(null);
    fetch(
      `/api/slots?serviceId=${serviceId}&doctorId=${doctorId}&date=${date}`
    )
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setError("Could not load time slots."))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, doctorId, date]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  );

  const canSubmit =
    Boolean(serviceId && doctorId && slot) &&
    patientName.trim().length > 1 &&
    patientEmail.includes("@") &&
    patientPhone.trim().length >= 7;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!slot || !canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          doctorId,
          startAt: slot.startAt,
          patientName,
          patientEmail,
          patientPhone,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Booking failed");
      router.push(`/book/confirmed?id=${data.appointment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-mist pb-20 pt-20">
      <div className="border-b-4 border-[var(--accent)] bg-brand-900 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-xl">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-brand-200 hover:text-white"
          >
            ← Home
          </Link>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight">
            Request a slot
          </h1>
          <p className="mt-2 text-sm text-brand-200">
            One form. Or call{" "}
            <a
              href={`tel:${clinicConfig.phone}`}
              className="font-bold text-[var(--accent)] hover:underline"
            >
              {clinicConfig.phoneDisplay}
            </a>
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="mx-auto mt-0 max-w-xl space-y-0 bg-paper shadow-soft"
      >
        {error && (
          <p className="border-b-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </p>
        )}

        <section className="border-b-2 border-brand-900 px-4 py-6 sm:px-6">
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-brand-600">
            1 · Service
          </h2>
          <div className="mt-4 space-y-2">
            {services.map((s) => {
              const active = serviceId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={`flex w-full items-start justify-between gap-3 border-2 px-3 py-3 text-left transition ${
                    active
                      ? "border-brand-600 bg-brand-100"
                      : "border-brand-200 bg-white hover:border-brand-500"
                  }`}
                >
                  <span>
                    <span className="block font-display text-base font-bold uppercase">
                      {s.name}
                    </span>
                    <span className="text-xs text-brand-700">
                      {s.durationMin} min
                    </span>
                  </span>
                  <span className="shrink-0 font-bold text-brand-800">
                    {formatPhp(s.pricePhp)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          className={`border-b-2 border-brand-900 px-4 py-6 sm:px-6 ${
            !serviceId ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-brand-600">
            2 · Day & time
          </h2>
          {selectedService && (
            <p className="mt-1 text-xs text-brand-700">
              With Dr. Melvin · {selectedService.durationMin} min
            </p>
          )}
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider">
            Date
            <input
              type="date"
              min={todayIso()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border-2 border-brand-900 bg-white px-3 py-2.5 outline-none focus:border-brand-600"
            />
          </label>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider">
            Time
          </p>
          {loadingSlots ? (
            <p className="mt-2 text-sm text-brand-700">Loading openings…</p>
          ) : slots.length === 0 ? (
            <p className="mt-2 text-sm text-brand-700">
              No openings this day — try another date.
            </p>
          ) : (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {slots.map((s) => (
                <button
                  key={s.startAt}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`border-2 px-2 py-2.5 text-sm font-bold ${
                    slot?.startAt === s.startAt
                      ? "border-brand-900 bg-brand-600 text-white"
                      : "border-brand-300 bg-white hover:border-brand-600"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </section>

        <section
          className={`border-b-2 border-brand-900 px-4 py-6 sm:px-6 ${
            !slot ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-brand-600">
            3 · Your details
          </h2>
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider">
              Full name
              <input
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="mt-1 w-full border-2 border-brand-900 bg-white px-3 py-2.5 outline-none focus:border-brand-600"
                placeholder="Juan Dela Cruz"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider">
              Mobile
              <input
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="mt-1 w-full border-2 border-brand-900 bg-white px-3 py-2.5 outline-none focus:border-brand-600"
                placeholder="09XX XXX XXXX"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider">
              Email
              <input
                required
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="mt-1 w-full border-2 border-brand-900 bg-white px-3 py-2.5 outline-none focus:border-brand-600"
                placeholder="you@email.com"
              />
            </label>
            <label className="block text-xs font-bold uppercase tracking-wider">
              Notes (optional)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1 w-full border-2 border-brand-900 bg-white px-3 py-2.5 outline-none focus:border-brand-600"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-3 bg-brand-900 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-brand-200">
            Prefer Messenger / call?{" "}
            <a
              href={`tel:${clinicConfig.phone}`}
              className="font-bold text-[var(--accent)]"
            >
              {clinicConfig.phoneDisplay}
            </a>
          </p>
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="bg-[var(--accent)] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-900 disabled:opacity-40"
          >
            {submitting ? "Sending…" : "Send request"}
          </button>
        </div>
      </form>
    </div>
  );
}
