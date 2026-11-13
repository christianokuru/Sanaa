import type { Review } from "@/lib/catalog/types";
import { COURSES } from "@/lib/catalog/seed/courses";
import { hashString } from "@/lib/utils/slug";

// Sample reviews, generated deterministically so every build shows the same ones.
const AUTHORS: Array<[string, string]> = [
  ["Chiamaka", "NG"], ["Esi", "GH"], ["Brian", "UG"], ["Zanele", "ZA"], ["Moussa", "SN"],
  ["Achieng", "KE"], ["Tolu", "NG"], ["Ama", "GH"], ["Lindiwe", "ZA"], ["Ife", "GB"],
  ["Kemi", "US"], ["Yaw", "GH"], ["Aisha", "TZ"], ["Mariam", "CI"], ["Sipho", "ZA"],
];

const BODIES = [
  "So clear. I followed everything on my phone and finished in a week.",
  "Worth every coin. I got two paying customers from what I learnt here.",
  "The close-up shots make all the difference. Finally I understand it.",
  "My teacher explains like a big sister. Patient and very detailed.",
  "I have watched YouTube for years. This is on another level.",
  "Short lessons, easy to watch with small data. Perfect.",
  "Already recommended it to my whole group chat.",
  "The business tips alone paid for the course.",
  "Beautifully filmed and well organised. Felt premium.",
  "I was scared to start but the first lessons made it simple.",
];

export const REVIEWS: Review[] = COURSES.flatMap((course) => {
  const seed = hashString(course.id);
  const count = 4 + (seed % 3);
  return Array.from({ length: count }, (_, i) => {
    const [author, country] = AUTHORS[(seed + i * 7) % AUTHORS.length]!;
    const rating = (seed + i) % 6 === 0 ? 4 : 5;
    const day = 1 + ((seed >> (i + 1)) % 27);
    return {
      id: `${course.id}-r${i}`,
      courseId: course.id,
      author,
      country,
      rating,
      body: BODIES[(seed + i * 3) % BODIES.length]!,
      createdAt: new Date(Date.UTC(2026, 9 - (i % 3), day)).toISOString(),
    };
  });
});
