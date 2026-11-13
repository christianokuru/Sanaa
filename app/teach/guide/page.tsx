export const metadata = { title: "Filming guide" };

const tips = [
  { title: "Use your back camera", text: "It is sharper than the selfie camera. Clean the lens first." },
  { title: "Film in landscape", text: "Turn your phone sideways so learners see more of your hands and work." },
  { title: "Light from the front", text: "Face a window or put a lamp behind the phone. Never film with a bright window behind you." },
  { title: "Get close", text: "For sewing, braiding and makeup, film close-ups of your hands. Learners need to see the details." },
  { title: "Steady the phone", text: "Use a tripod or lean the phone on books. Shaky video is hard to follow." },
  { title: "Quiet room", text: "Turn off fans and TV. Speak clearly and a little slower than normal." },
  { title: "Short lessons", text: "Keep each lesson 5 to 15 minutes. One step per lesson is easiest to follow." },
  { title: "Make lesson 1 a free preview", text: "Show what learners will make by the end. This is what makes people buy." },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Filming guide</h1>
      <p className="mt-2 text-earth-soft">You don&apos;t need a studio. A phone and these tips are enough.</p>
      <ol className="mt-6 space-y-3">
        {tips.map((t, i) => (
          <li key={t.title} className="card flex gap-4 p-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold font-bold">{i + 1}</span>
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="mt-1 text-earth-soft">{t.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
