import { hashString } from "@/lib/utils/slug";
import { cn } from "@/lib/utils/cn";

/**
 * Generated cover art inspired by Ndebele wall painting, kente cloth, mud cloth and
 * adire. Every course gets a stable, unique composition from its id.
 * Pure SVG with no ids, so many covers can share a page safely. Rendered on the server.
 */

const INK = "#1A1A1A";
const CREAM = "#FBF6EE";
const S = 400;

type Palette = [string, string, string];
type Shape = React.ReactElement;
type Generator = (p: Palette, rnd: () => number) => Shape[];

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const kente: Generator = ([a, b, c]) => {
  const out: Shape[] = [<rect key="bg" width={S} height={S} fill={a} />];
  for (let r = 0; r < 5; r++) {
    const y = r * 80;
    if (r % 2 === 0) {
      for (let x = 0; x < S; x += 50) {
        out.push(
          <rect key={`s${r}-${x}a`} x={x} y={y} width={22} height={80} fill={b} />,
          <rect key={`s${r}-${x}b`} x={x + 22} y={y} width={6} height={80} fill={INK} />,
          <rect key={`s${r}-${x}c`} x={x + 28} y={y} width={16} height={80} fill={c} />,
          <rect key={`s${r}-${x}d`} x={x + 44} y={y} width={3} height={80} fill={CREAM} />,
        );
      }
    } else {
      for (let x = 0; x < S; x += 40) {
        out.push(<rect key={`k${r}-${x}`} x={x} y={y + ((x / 40) % 2) * 40} width={40} height={40} fill={c} />);
      }
      out.push(<rect key={`l${r}t`} x={0} y={y} width={S} height={4} fill={INK} />, <rect key={`l${r}b`} x={0} y={y + 76} width={S} height={4} fill={INK} />);
    }
  }
  return out;
};

const ndebele: Generator = ([a, b, c]) => {
  const stroke = { stroke: INK, strokeWidth: 8, strokeLinejoin: "round" as const };
  return [
    <rect key="bg" width={S} height={S} fill={CREAM} />,
    // top-left: stepped triangle
    <rect key="p1" x={20} y={20} width={176} height={176} fill={a} {...stroke} />,
    <path key="p1s" d="M40 176 L40 140 L76 140 L76 104 L112 104 L112 68 L148 68 L148 40 L176 40 L176 176 Z" fill={b} {...stroke} />,
    // top-right: concentric squares
    <rect key="p2" x={204} y={20} width={176} height={176} fill={c} {...stroke} />,
    <rect key="p2a" x={236} y={52} width={112} height={112} fill={CREAM} {...stroke} />,
    <rect key="p2b" x={264} y={80} width={56} height={56} fill={a} {...stroke} />,
    // bottom-left: diamond
    <rect key="p3" x={20} y={204} width={176} height={176} fill={b} {...stroke} />,
    <path key="p3d" d="M108 222 L178 292 L108 362 L38 292 Z" fill={CREAM} {...stroke} />,
    <path key="p3e" d="M108 262 L138 292 L108 322 L78 292 Z" fill={c} {...stroke} />,
    // bottom-right: bars
    <rect key="p4" x={204} y={204} width={176} height={176} fill={a} {...stroke} />,
    ...[0, 1, 2, 3].map((i) => (
      <rect key={`p4b${i}`} x={222 + i * 40} y={222} width={20} height={140} fill={i % 2 ? CREAM : c} {...stroke} strokeWidth={6} />
    )),
  ];
};

const sunrise: Generator = ([a, b, c]) => {
  const out: Shape[] = [<rect key="bg" width={S} height={S} fill={c === CREAM ? INK : c} />];
  for (let i = 0; i < 12; i++) {
    const angle = Math.PI + (i * Math.PI) / 11;
    const x1 = 200 + Math.cos(angle) * 150;
    const y1 = 270 + Math.sin(angle) * 150;
    const x2 = 200 + Math.cos(angle + 0.12) * 260;
    const y2 = 270 + Math.sin(angle + 0.12) * 260;
    const x3 = 200 + Math.cos(angle - 0.12) * 260;
    const y3 = 270 + Math.sin(angle - 0.12) * 260;
    out.push(<path key={`r${i}`} d={`M${x1} ${y1} L${x2} ${y2} L${x3} ${y3} Z`} fill={b} />);
  }
  [140, 110, 80, 50].forEach((r, i) => out.push(<circle key={`c${r}`} cx={200} cy={270} r={r} fill={i % 2 ? b : a} />));
  out.push(<rect key="h" x={0} y={270} width={S} height={130} fill={a} />);
  for (let x = 0; x < S; x += 40) {
    out.push(<path key={`z${x}`} d={`M${x} 320 L${x + 20} 300 L${x + 40} 320`} fill="none" stroke={CREAM} strokeWidth={6} />);
    out.push(<path key={`y${x}`} d={`M${x} 360 L${x + 20} 340 L${x + 40} 360`} fill="none" stroke={INK} strokeWidth={6} />);
  }
  return out;
};

const mudcloth: Generator = ([a], rnd) => {
  const bg = "#2A1D14";
  const mark = "#EADBC4";
  const out: Shape[] = [<rect key="bg" width={S} height={S} fill={bg} />];
  out.push(<circle key="sun" cx={300 + rnd() * 40} cy={90 + rnd() * 30} r={70} fill={a} />);
  for (let row = 0; row < 5; row++) {
    const y = 40 + row * 80;
    out.push(<rect key={`rule${row}`} x={0} y={y + 34} width={S} height={3} fill={mark} opacity={0.5} />);
    for (let x = 20; x < S; x += 48) {
      const k = `${row}-${x}`;
      if (row % 3 === 0) out.push(<path key={k} d={`M${x} ${y} l14 0 M${x + 7} ${y - 7} l0 14`} stroke={mark} strokeWidth={4} strokeLinecap="round" />);
      else if (row % 3 === 1) out.push(<circle key={k} cx={x + 7} cy={y} r={5} fill={mark} />);
      else out.push(<path key={k} d={`M${x - 6} ${y + 6} l10 -12 l10 12 l10 -12`} fill="none" stroke={mark} strokeWidth={4} strokeLinejoin="round" />);
    }
  }
  return out;
};

const diamonds: Generator = ([a, b, c]) => {
  const out: Shape[] = [<rect key="bg" width={S} height={S} fill={a} />];
  const size = 100;
  for (let row = -1; row < 5; row++) {
    for (let col = -1; col < 5; col++) {
      const cx = col * size + (row % 2 ? size / 2 : 0);
      const cy = row * (size / 2) + size / 2;
      const fill = (row + col) % 2 ? b : c;
      out.push(
        <path key={`d${row}-${col}`} d={`M${cx} ${cy - 46} L${cx + 46} ${cy} L${cx} ${cy + 46} L${cx - 46} ${cy} Z`} fill={fill} stroke={INK} strokeWidth={5} />,
        <path key={`i${row}-${col}`} d={`M${cx} ${cy - 14} L${cx + 14} ${cy} L${cx} ${cy + 14} L${cx - 14} ${cy} Z`} fill={CREAM} />,
      );
    }
  }
  return out;
};

const arcs: Generator = ([a, b, c], rnd) => {
  const colors = [a, c, INK, CREAM];
  const out: Shape[] = [<rect key="bg" width={S} height={S} fill={b} />];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 100;
      const y = row * 100;
      const fill = colors[Math.floor(rnd() * colors.length)]!;
      // Quarter circle anchored in one of the tile's corners (TL, TR, BR, BL).
      const quarter = [
        `M${x} ${y} L${x + 100} ${y} A100 100 0 0 1 ${x} ${y + 100} Z`,
        `M${x + 100} ${y} L${x + 100} ${y + 100} A100 100 0 0 1 ${x} ${y} Z`,
        `M${x + 100} ${y + 100} L${x} ${y + 100} A100 100 0 0 1 ${x + 100} ${y} Z`,
        `M${x} ${y + 100} L${x} ${y} A100 100 0 0 1 ${x + 100} ${y + 100} Z`,
      ][Math.floor(rnd() * 4)]!;
      if (rnd() < 0.18) {
        out.push(<circle key={`a${row}-${col}`} cx={x + 50} cy={y + 50} r={36} fill={fill} />);
      } else {
        out.push(<path key={`a${row}-${col}`} d={quarter} fill={fill} />);
      }
    }
  }
  return out;
};

const GENERATORS: Generator[] = [kente, ndebele, sunrise, mudcloth, diamonds, arcs];

export function CourseArt({ seed, palette, className, variant }: { seed: string; palette: Palette; className?: string; variant?: number }) {
  const h = hashString(seed);
  const gen = GENERATORS[(variant ?? h) % GENERATORS.length]!;
  const shift = (h >> 4) % 3;
  const rotated = [palette[shift % 3], palette[(shift + 1) % 3], palette[(shift + 2) % 3]] as Palette;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} preserveAspectRatio="xMidYMid slice" className={cn("block h-full w-full", className)} aria-hidden focusable="false">
      {gen(rotated, rng(h))}
    </svg>
  );
}
