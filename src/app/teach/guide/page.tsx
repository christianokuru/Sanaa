import { ProsePage } from "@/components/content/Prose";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Filming guide for teachers", description: "Film a professional course with just your phone: light, sound, angles and lesson length.", alternates: { canonical: "/teach/guide" } };

const TIPS = [
  ["Use the back camera", "It is sharper than the selfie camera. Wipe the lens before every session."],
  ["Film in landscape", "Turn your phone sideways so learners see more of your hands and your work."],
  ["Light from the front", "Face a window or put a lamp behind the phone. Never film with a bright window behind you."],
  ["Get close", "For sewing, braiding and makeup, film your hands up close. Learners need the details."],
  ["Keep the phone still", "Use a tripod, or lean the phone on a stack of books. Shaky video is hard to follow."],
  ["Quiet room", "Switch off fans and TV. Speak clearly and a little slower than normal."],
  ["Short lessons", "Keep each lesson between 5 and 15 minutes. One step per lesson is easiest to follow."],
  ["Lesson 1 is a free preview", "Show what learners will make by the end. This is what makes people buy."],
];

export default function GuidePage() {
  return (
    <ProsePage eyebrow="For teachers" title="Film a great course with just your phone" intro="You don't need a studio. Follow these eight rules and your course will look and sound professional.">
      <ol className="space-y-4">
        {TIPS.map(([title, text], i) => (
          <li key={title} className="flex gap-5 rounded-card bg-canvas p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-body font-bold text-white">{i + 1}</span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-ink-soft">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Button href="/teach/dashboard" variant="dark">Create your course</Button>
    </ProsePage>
  );
}
