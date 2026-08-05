import { Resend } from "resend";
import { clinicConfig } from "./clinic-config";

type BookingEmail = {
  patientName: string;
  patientEmail: string;
  serviceName: string;
  doctorName: string;
  whenLabel: string;
  clinicEmail: string;
};

function bookingHtml(payload: BookingEmail, audience: "patient" | "clinic") {
  const intro =
    audience === "patient"
      ? `Hi ${payload.patientName}, your appointment request at ${clinicConfig.name} is in.`
      : `New booking request from ${payload.patientName}.`;

  return `
    <div style="font-family: Georgia, serif; color: #142A28; line-height: 1.5;">
      <h2 style="color: #0B6E6A;">${clinicConfig.name}</h2>
      <p>${intro}</p>
      <ul>
        <li><strong>Service:</strong> ${payload.serviceName}</li>
        <li><strong>Dentist:</strong> ${payload.doctorName}</li>
        <li><strong>When:</strong> ${payload.whenLabel}</li>
      </ul>
      <p style="color:#5a6b68;font-size:14px;">
        Status: pending confirmation. The clinic will confirm shortly.
      </p>
    </div>
  `;
}

export async function sendBookingEmails(payload: BookingEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM || `${clinicConfig.name} <onboarding@resend.dev>`;

  if (!apiKey) {
    console.log("[email:dev] Patient confirmation →", payload.patientEmail);
    console.log("[email:dev] Clinic notify →", payload.clinicEmail);
    console.log("[email:dev] Details:", payload);
    return { ok: true, mode: "console" as const };
  }

  const resend = new Resend(apiKey);

  await Promise.all([
    resend.emails.send({
      from,
      to: payload.patientEmail,
      subject: `Appointment request — ${clinicConfig.name}`,
      html: bookingHtml(payload, "patient"),
    }),
    resend.emails.send({
      from,
      to: payload.clinicEmail,
      subject: `New booking: ${payload.patientName}`,
      html: bookingHtml(payload, "clinic"),
    }),
  ]);

  return { ok: true, mode: "resend" as const };
}
