import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { clinicConfig } from "../src/lib/clinic-config";

const prisma = new PrismaClient();

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.doctorService.deleteMany();
  await prisma.availabilityException.deleteMany();
  await prisma.weeklyHour.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.clinic.deleteMany();

  const clinic = await prisma.clinic.create({
    data: {
      name: clinicConfig.name,
      tagline: clinicConfig.tagline,
      email: clinicConfig.email,
      phone: clinicConfig.phone,
      address: clinicConfig.address,
      city: clinicConfig.city,
      mapsUrl: clinicConfig.mapsUrl,
      timezone: clinicConfig.timezone,
    },
  });

  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.adminUser.create({
    data: {
      email: "admin@drmelvinadel.ph",
      name: "Dr. Melvin H. Adel",
      passwordHash,
      clinicId: clinic.id,
    },
  });

  const services = await Promise.all(
    [
      {
        name: "Oral Prophylaxis (Cleaning)",
        description: "Gentle cleaning and polish for everyday oral health.",
        durationMin: 45,
        pricePhp: 1200,
        sortOrder: 1,
      },
      {
        name: "Dental Checkup & Consultation",
        description: "Exam, treatment plan discussion, and X-ray if needed.",
        durationMin: 30,
        pricePhp: 800,
        sortOrder: 2,
      },
      {
        name: "Teeth Whitening",
        description: "In-clinic whitening for a brighter smile in one visit.",
        durationMin: 60,
        pricePhp: 6500,
        sortOrder: 3,
      },
      {
        name: "Tooth Filling",
        description: "Composite filling for cavities — shade-matched.",
        durationMin: 45,
        pricePhp: 2500,
        sortOrder: 4,
      },
      {
        name: "Tooth Extraction",
        description: "Simple extraction with aftercare instructions.",
        durationMin: 40,
        pricePhp: 2000,
        sortOrder: 5,
      },
    ].map((s) =>
      prisma.service.create({
        data: { ...s, clinicId: clinic.id },
      })
    )
  );

  const doctor = await prisma.doctor.create({
    data: {
      clinicId: clinic.id,
      name: "Dr. Melvin H. Adel",
      title: "Dentist",
      bio: "Providing trusted dental care for families and individuals in San Pascual, Batangas. Clear explanations and gentle treatment in a comfortable clinic setting.",
      sortOrder: 1,
    },
  });

  for (const service of services) {
    await prisma.doctorService.create({
      data: { doctorId: doctor.id, serviceId: service.id },
    });
  }

  // Mon–Sat 9:00–18:00; Sunday closed
  for (let day = 0; day <= 6; day++) {
    const closed = day === 0;
    await prisma.weeklyHour.create({
      data: {
        clinicId: clinic.id,
        dayOfWeek: day,
        startMin: closed ? 0 : 9 * 60,
        endMin: closed ? 0 : 18 * 60,
        closed,
      },
    });
  }

  console.log("Seeded Dr. Melvin H. Adel Dental Clinic");
  console.log("Admin login: admin@drmelvinadel.ph / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
