export type BrandBrief = {
  vibe: string;
  audience: string;
  industry: string;
  avoid: string;
};

export type PaletteSwatch = {
  role: "background" | "surface" | "primary" | "accent" | "ink" | "muted";
  name: string;
  hex: string;
  textHex: string;
  contrast: number;
};

export type PaletteResult = {
  brief: BrandBrief;
  strategy: {
    mood: string;
    audienceRead: string;
    colorLogic: string;
    usageNotes: string[];
  };
  swatches: PaletteSwatch[];
  cssVariables: string;
  tailwindSnippet: string;
};

const ROLE_NAMES: Record<PaletteSwatch["role"], string> = {
  background: "Spellbook Background",
  surface: "Card Surface",
  primary: "Signature Potion",
  accent: "Spark Accent",
  ink: "Readable Ink",
  muted: "Soft Muted"
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashText(input: string) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function hslToRgb(h: number, s: number, l: number) {
  const hue = (((h % 360) + 360) % 360) / 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;
  if (sat === 0) {
    const v = Math.round(light * 255);
    return [v, v, v] as const;
  }
  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;
  const channel = (t0: number) => {
    let t = t0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [Math.round(channel(hue + 1 / 3) * 255), Math.round(channel(hue) * 255), Math.round(channel(hue - 1 / 3) * 255)] as const;
}

function hexFromHsl(h: number, s: number, l: number) {
  const [r, g, b] = hslToRgb(h, s, l);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function luminance(hex: string) {
  const channels = hex
    .replace("#", "")
    .match(/.{2}/g)!
    .map((part) => parseInt(part, 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)));
  const r = channels[0] ?? 0;
  const g = channels[1] ?? 0;
  const b = channels[2] ?? 0;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string) {
  const lighter = Math.max(luminance(a), luminance(b));
  const darker = Math.min(luminance(a), luminance(b));
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function readableText(hex: string) {
  const onDark = contrastRatio(hex, "#FFFFFF");
  const onLight = contrastRatio(hex, "#101018");
  return onDark >= onLight ? "#FFFFFF" : "#101018";
}

function normalizeBrief(brief: Partial<BrandBrief>): BrandBrief {
  return {
    vibe: String(brief.vibe ?? "confident, useful, a little magical").slice(0, 240),
    audience: String(brief.audience ?? "indie builders and creator teams").slice(0, 160),
    industry: String(brief.industry ?? "software").slice(0, 120),
    avoid: String(brief.avoid ?? "muddy browns, low contrast").slice(0, 120)
  };
}

function moodFor(vibe: string) {
  const lower = vibe.toLowerCase();
  if (/lux|premium|elegant|calm|minimal/.test(lower)) return "premium calm";
  if (/fun|play|weird|meme|bold/.test(lower)) return "playful voltage";
  if (/trust|serious|finance|secure|clinical/.test(lower)) return "credible precision";
  if (/warm|human|community|cozy/.test(lower)) return "warm community";
  return "focused magic";
}

export function generatePalette(briefInput: Partial<BrandBrief>, aiStrategy?: Partial<PaletteResult["strategy"]>): PaletteResult {
  const brief = normalizeBrief(briefInput);
  const seed = hashText(`${brief.vibe}|${brief.audience}|${brief.industry}|${brief.avoid}`);
  const mood = aiStrategy?.mood ?? moodFor(brief.vibe);
  const baseHue = seed % 360;
  const sat = 62 + (seed % 18);
  const bgLight = /calm|premium|credible/.test(mood) ? 96 : 94;
  const primaryLight = /premium|credible/.test(mood) ? 35 : 43;
  const accentHue = (baseHue + 132 + (seed % 42)) % 360;

  const raw = [
    ["background", hexFromHsl(baseHue, 38, bgLight)],
    ["surface", hexFromHsl(baseHue + 8, 45, 99)],
    ["primary", hexFromHsl(baseHue, sat, primaryLight)],
    ["accent", hexFromHsl(accentHue, 72, 48)],
    ["ink", hexFromHsl(baseHue, 30, 10)],
    ["muted", hexFromHsl(baseHue, 22, 44)]
  ] as const;

  const swatches = raw.map(([role, hex]) => {
    const textHex = readableText(hex);
    return {
      role,
      name: ROLE_NAMES[role],
      hex,
      textHex,
      contrast: contrastRatio(hex, textHex)
    };
  });

  const cssVariables = `:root {\n${swatches.map((s) => `  --pp-${s.role}: ${s.hex};`).join("\n")}\n}`;
  const tailwindSnippet = `theme: {\n  extend: {\n    colors: {\n${swatches
    .map((s) => `      "pp-${s.role}": "${s.hex}",`)
    .join("\n")}\n    }\n  }\n}`;

  return {
    brief,
    strategy: {
      mood,
      audienceRead:
        aiStrategy?.audienceRead ?? `${brief.audience} need fast trust signals, obvious affordances, and colors that still feel distinctive in a feed.`,
      colorLogic:
        aiStrategy?.colorLogic ?? `The base hue is derived from the brief, then paired with a split-complement accent and high-contrast ink for repeatable brand tokens.`,
      usageNotes: aiStrategy?.usageNotes ?? [
        "Use primary for the main CTA and product screenshots.",
        "Use accent sparingly for badges, hover states, and celebratory moments.",
        "Keep body text on background/surface with the generated ink token."
      ]
    },
    swatches,
    cssVariables,
    tailwindSnippet
  };
}
