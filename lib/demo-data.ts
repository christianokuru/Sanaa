import type { Course, CourseStats, Lesson, Review } from "@/lib/types";

// Sample content shown when Supabase is not connected yet (demo mode).
// Names below are made up for illustration.

const teachers = {
  adaeze: { id: "t-adaeze", full_name: "Adaeze Okafor", country: "NG", bio: "Tailor for 12 years. I run a small fashion house in Enugu and love teaching beginners." },
  kwame: { id: "t-kwame", full_name: "Kwame Mensah", country: "GH", bio: "Kente weaver's son turned fashion designer. Based in Kumasi." },
  wanjiru: { id: "t-wanjiru", full_name: "Wanjiru Kamau", country: "KE", bio: "Braider and salon owner in Nairobi. 8 years of knotless and Fulani styles." },
  thando: { id: "t-thando", full_name: "Thando Ndlovu", country: "ZA", bio: "Amapiano dancer and choreographer from Soweto." },
  fatou: { id: "t-fatou", full_name: "Fatou Diallo", country: "SN", bio: "Djembe player and music teacher from Dakar." },
  amina: { id: "t-amina", full_name: "Amina Yusuf", country: "NG", bio: "Makeup artist for weddings and shoots in Lagos." },
};

type DemoCourse = Course & { stats: CourseStats };

function course(c: Partial<DemoCourse> & Pick<DemoCourse, "id" | "slug" | "title" | "category" | "price" | "currency" | "teacher">): DemoCourse {
  return {
    teacher_id: c.teacher!.id,
    subtitle: "",
    description: "",
    level: "beginner",
    thumbnail_url: null,
    what_you_learn: [],
    status: "published",
    rejection_reason: null,
    created_at: "2026-10-01T00:00:00Z",
    stats: { student_count: 0, lesson_count: 0, total_seconds: 0, rating_avg: 0, rating_count: 0 },
    ...c,
  } as DemoCourse;
}

export const DEMO_COURSES: DemoCourse[] = [
  course({
    id: "c1", slug: "sew-your-first-ankara-dress", teacher: teachers.adaeze,
    title: "Sew Your First Ankara Dress",
    subtitle: "From measuring to finishing, step by step",
    category: "fashion", price: 15000, currency: "NGN",
    description: "Never used a sewing machine? This course starts from zero. You will take your measurements, draft a simple pattern, cut your Ankara fabric and sew a full dress you can wear.\n\nEvery step is filmed up close so you can follow along on your phone.",
    what_you_learn: ["Take accurate body measurements", "Draft a basic bodice and skirt pattern", "Cut fabric without wasting it", "Sew darts, zips and hems neatly"],
    stats: { student_count: 1240, lesson_count: 6, total_seconds: 6 * 900, rating_avg: 4.8, rating_count: 312 },
  }),
  course({
    id: "c2", slug: "start-a-tailoring-business", teacher: teachers.kwame,
    title: "Start a Tailoring Business From Home",
    subtitle: "Pricing, finding customers and growing on Instagram",
    category: "fashion", price: 180, currency: "GHS", level: "intermediate",
    description: "You can sew. Now turn it into money. Learn how to price your work, find your first 20 customers and grow with social media.",
    what_you_learn: ["Price your work so you make a profit", "Find customers on WhatsApp and Instagram", "Take great photos of your work with a phone"],
    stats: { student_count: 860, lesson_count: 5, total_seconds: 5 * 720, rating_avg: 4.7, rating_count: 198 },
  }),
  course({
    id: "c3", slug: "beadwork-jewellery-basics", teacher: teachers.kwame,
    title: "Beadwork Jewellery Basics",
    subtitle: "Make necklaces and bracelets to sell",
    category: "fashion", price: 0, currency: "GHS",
    description: "A free starter course on beadwork. Learn the tools, basic stitches and make two pieces you can sell this week.",
    what_you_learn: ["Choose beads and thread", "Three core stitches", "Finish clasps that last"],
    stats: { student_count: 3020, lesson_count: 4, total_seconds: 4 * 600, rating_avg: 4.6, rating_count: 540 },
  }),
  course({
    id: "c4", slug: "knotless-braids-masterclass", teacher: teachers.wanjiru,
    title: "Knotless Braids Masterclass",
    subtitle: "Clean parts, neat ends, happy clients",
    category: "hair-beauty", price: 2500, currency: "KES", level: "intermediate",
    description: "Learn knotless braids the way salons do it. Parting, feed-in technique, sizing and finishing, filmed from the braider's view.",
    what_you_learn: ["Clean parting for any size", "Feed-in technique without knots", "Speed tips to finish faster", "How to price braiding services"],
    stats: { student_count: 2110, lesson_count: 7, total_seconds: 7 * 840, rating_avg: 4.9, rating_count: 455 },
  }),
  course({
    id: "c5", slug: "wig-making-for-beginners", teacher: teachers.wanjiru,
    title: "Wig Making for Beginners",
    subtitle: "Build a closure wig from scratch",
    category: "hair-beauty", price: 3000, currency: "KES",
    description: "Make your own closure wig: measuring the head, sewing wefts on a cap and customising the hairline.",
    what_you_learn: ["Measure and prepare a wig cap", "Sew wefts flat", "Pluck and customise a closure"],
    stats: { student_count: 940, lesson_count: 6, total_seconds: 6 * 780, rating_avg: 4.7, rating_count: 201 },
  }),
  course({
    id: "c6", slug: "bridal-makeup-for-melanin-skin", teacher: teachers.amina,
    title: "Bridal Makeup for Melanin Skin",
    subtitle: "Flawless base, long-lasting looks",
    category: "hair-beauty", price: 20000, currency: "NGN", level: "advanced",
    description: "Pro bridal makeup for darker skin tones: colour matching, base that lasts all day, and three signature looks.",
    what_you_learn: ["Match foundation for deep skin tones", "Make makeup last 12+ hours", "Three bridal looks clients love"],
    stats: { student_count: 670, lesson_count: 5, total_seconds: 5 * 960, rating_avg: 4.8, rating_count: 142 },
  }),
  course({
    id: "c7", slug: "amapiano-dance-from-zero", teacher: teachers.thando,
    title: "Amapiano Dance From Zero",
    subtitle: "Learn the moves everyone is doing",
    category: "dance-music", price: 250, currency: "ZAR",
    description: "Break down the most popular Amapiano moves step by step, then put them together into a full routine.",
    what_you_learn: ["10 core Amapiano moves", "Count music and stay on beat", "A full 1-minute routine"],
    stats: { student_count: 4150, lesson_count: 6, total_seconds: 6 * 540, rating_avg: 4.9, rating_count: 980 },
  }),
  course({
    id: "c8", slug: "afrobeats-choreography", teacher: teachers.thando,
    title: "Afrobeats Choreography",
    subtitle: "Create and film your own routines",
    category: "dance-music", price: 350, currency: "ZAR", level: "intermediate",
    description: "Go from following routines to making your own. Includes filming tips for TikTok and Instagram.",
    what_you_learn: ["Build a routine from a song", "Add your own style", "Film dance videos with a phone"],
    stats: { student_count: 1880, lesson_count: 5, total_seconds: 5 * 660, rating_avg: 4.8, rating_count: 377 },
  }),
  course({
    id: "c9", slug: "djembe-drumming-basics", teacher: teachers.fatou,
    title: "Djembe Drumming Basics",
    subtitle: "Bass, tone and slap, the West African way",
    category: "dance-music", price: 6000, currency: "XOF",
    description: "Learn the three basic djembe sounds and play four traditional rhythms from Senegal and Mali.",
    what_you_learn: ["Play bass, tone and slap clearly", "Four traditional rhythms", "Keep time with other drummers"],
    stats: { student_count: 720, lesson_count: 5, total_seconds: 5 * 600, rating_avg: 4.7, rating_count: 133 },
  }),
];

// Public test stream so the player works in demo mode.
const DEMO_VIDEO = "demo";

export function demoLessons(courseId: string): Lesson[] {
  const c = DEMO_COURSES.find((x) => x.id === courseId);
  if (!c) return [];
  const titles = ["Welcome and what you need", "The basics", "Step by step: part 1", "Step by step: part 2", "Finishing touches", "Common mistakes", "Next steps"];
  return Array.from({ length: c.stats.lesson_count }, (_, i) => ({
    id: `${courseId}-l${i + 1}`,
    course_id: courseId,
    title: titles[i] ?? `Lesson ${i + 1}`,
    position: i,
    video_id: DEMO_VIDEO,
    duration_seconds: Math.round(c.stats.total_seconds / c.stats.lesson_count),
    is_preview: i === 0,
  }));
}

export function demoReviews(courseId: string): Review[] {
  const samples = [
    { name: "Chiamaka", country: "NG", rating: 5, comment: "Very clear. I could follow everything on my phone." },
    { name: "Esi", country: "GH", rating: 5, comment: "Worth every cedi. I already got two customers." },
    { name: "Brian", country: "UG", rating: 4, comment: "Good course. Would love more close-up shots in part 2." },
  ];
  return samples.map((s, i) => ({
    id: `${courseId}-r${i}`,
    course_id: courseId,
    student_id: `s${i}`,
    rating: s.rating,
    comment: s.comment,
    created_at: "2026-10-20T00:00:00Z",
    student: { full_name: s.name, country: s.country },
  }));
}
