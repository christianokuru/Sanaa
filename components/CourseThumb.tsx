import { Scissors, Sparkles, Music } from "lucide-react";

const STYLES: Record<string, { bg: string; icon: typeof Scissors }> = {
  fashion: { bg: "from-terracotta to-gold", icon: Scissors },
  "hair-beauty": { bg: "from-forest to-gold", icon: Sparkles },
  "dance-music": { bg: "from-earth to-terracotta", icon: Music },
};

export function CourseThumb({
  url, category, title, className = "",
}: { url: string | null; category: string; title: string; className?: string }) {
  if (url) {
    return <img src={url} alt="" loading="lazy" className={`aspect-video w-full object-cover ${className}`} />;
  }
  const style = STYLES[category] ?? STYLES.fashion;
  const Icon = style.icon;
  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-gradient-to-br ${style.bg} ${className}`} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
        <defs>
          <pattern id={`p-${category}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 16 8 8 16 16 24 8 32 16" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="16" cy="26" r="2" fill="#fff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${category})`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Icon className="h-7 w-7 text-white" />
        </span>
      </div>
      <p className="absolute bottom-2 left-3 right-3 truncate font-display text-sm font-bold text-white/90">{title}</p>
    </div>
  );
}
