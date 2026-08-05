/**
 * Per-clinic branding — Dr. Melvin H. Adel Dental Clinic
 * Distinct UX from Ashley: community clinic, call-first, sharp geometry.
 */
export const clinicConfig = {
  slug: "dr-melvin-adel-dental",
  name: "Dr. Melvin H. Adel Dental Clinic",
  shortName: "Adel Dental",
  tagline: "Neighborhood dentistry in San Pascual",
  specialty: "Dental",
  description:
    "Dr. Melvin H. Adel Dental Clinic in San Pascual, Batangas — book online or call (043) 723-3522.",
  email: "hello@drmelvinadel.ph",
  phone: "+63437233522",
  phoneDisplay: "(043) 723-3522",
  address: "San Pascual, Batangas",
  city: "San Pascual, Batangas",
  plusCode: "",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=San+Pascual+Batangas",
  timezone: "Asia/Manila",
  hoursSummary: "Mon–Sat · 9:00 AM – 6:00 PM",
  facebookUrl: "https://www.facebook.com",
  dentistName: "Dr. Melvin H. Adel",
  brand: {
    /** Clinical dental blue — clean / sterile (not Ashley gold) */
    primary: "#0E7C9B",
    primaryDark: "#084A5E",
    primaryLight: "#E7F4F9",
    accent: "#7DD3FC",
    ink: "#0F2430",
    paper: "#F7FBFD",
    mist: "#E6F2F6",
  },
  hero: {
    headline: "Book a visit. Or just call us.",
    subhead:
      "Same-week openings for cleaning, checkup, and treatment — built for San Pascual families who want it simple.",
    cta: "Book online",
    secondaryCta: "Call clinic",
    imageAlt: "Dental care in a bright clinic setting",
    imageUrl:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=2000&q=80",
  },
  howItWorks: [
    {
      step: "01",
      title: "Pick what you need",
      body: "Cleaning, checkup, whitening — duration and guide price shown.",
    },
    {
      step: "02",
      title: "Choose a day & time",
      body: "Live openings for Dr. Melvin. No back-and-forth on Messenger.",
    },
    {
      step: "03",
      title: "We confirm",
      body: "You get an email. We see it in admin and confirm your slot.",
    },
  ],
  trustLine: "San Pascual · Batangas · Mon–Sat 9–6",
} as const;

export type ClinicConfig = typeof clinicConfig;
