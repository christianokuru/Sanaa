import type { Teacher } from "@/lib/catalog/types";

// Sample teachers for the demo catalog. Names are fictional.
export const TEACHERS: Teacher[] = [
  {
    id: "t-adaeze", slug: "adaeze-okafor", name: "Adaeze Okafor", title: "Master tailor", country: "NG", city: "Enugu",
    bio: "I have run my fashion house in Enugu for 12 years. I teach the way I learnt: slowly, up close, and with every mistake shown so you never make it.",
    yearsExperience: 12, verified: true,
  },
  {
    id: "t-kwame", slug: "kwame-mensah", name: "Kwame Mensah", title: "Designer & kente weaver", country: "GH", city: "Kumasi",
    bio: "Son of a kente weaver, now a designer dressing grooms across Ghana. I care about two things: perfect finishing and charging what your work is worth.",
    yearsExperience: 15, verified: true,
  },
  {
    id: "t-wanjiru", slug: "wanjiru-kamau", name: "Wanjiru Kamau", title: "Braider & salon owner", country: "KE", city: "Nairobi",
    bio: "Eight years behind the chair and two salons in Nairobi. I film from the braider's view so you see exactly what my hands are doing.",
    yearsExperience: 8, verified: true,
  },
  {
    id: "t-amina", slug: "amina-yusuf", name: "Amina Yusuf", title: "Bridal makeup artist", country: "NG", city: "Lagos",
    bio: "I have painted over 900 brides in Lagos and Abuja. My looks last 14 hours in the heat and photograph beautifully on deep skin.",
    yearsExperience: 10, verified: true,
  },
  {
    id: "t-thando", slug: "thando-ndlovu", name: "Thando Ndlovu", title: "Amapiano choreographer", country: "ZA", city: "Johannesburg",
    bio: "Dancer and choreographer from Soweto. I have made routines for music videos and brands, and I break every move down to counts anyone can follow.",
    yearsExperience: 9, verified: true,
  },
  {
    id: "t-fatou", slug: "fatou-diallo", name: "Fatou Diallo", title: "Djembe master", country: "SN", city: "Dakar",
    bio: "I grew up in a family of griots in Dakar. Rhythm is a language, and I teach it the way we teach children: by ear, by feel, then by name.",
    yearsExperience: 20, verified: true,
  },
  {
    id: "t-naledi", slug: "naledi-dlamini", name: "Naledi Dlamini", title: "Beadwork artist", country: "ZA", city: "Durban",
    bio: "Zulu beadwork artist selling to boutiques in Durban and Cape Town. I will show you the stitches, the colour stories and how to price your pieces.",
    yearsExperience: 11, verified: false,
  },
  {
    id: "t-kofi", slug: "kofi-asante", name: "Kofi Asante", title: "Ceramicist", country: "GH", city: "Accra",
    bio: "Potter working with Ghanaian clay and old firing methods. My studio pieces sell in Accra and London.",
    yearsExperience: 14, verified: true,
  },
];

export function getTeacherById(id: string): Teacher | undefined {
  return TEACHERS.find((t) => t.id === id);
}

export function getTeacherBySlug(slug: string): Teacher | undefined {
  return TEACHERS.find((t) => t.slug === slug);
}
