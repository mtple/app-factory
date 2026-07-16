"use client";

import { useMemo, useState } from "react";
import { buildComposeUrl } from "@app-factory/farcaster";
import { palettePotionConfig } from "../config";
import { generatePalette, type PaletteResult } from "../../lib/palette";

type BrewResponse = { ok: true; mode: string; result: PaletteResult } | { ok: false; error: string };

const initialBrief = {
  vibe: "trustworthy AI launch studio with playful magic",
  audience: "founders, creator teams, and indie builders",
  industry: "AI productivity",
  avoid: "generic blue SaaS, neon overload"
};

export function PalettePotionApp() {
  const [brief, setBrief] = useState(initialBrief);
  const [result, setResult] = useState<PaletteResult>(() => generatePalette(initialBrief));
  const [mode, setMode] = useState("deterministic");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("Ready to brew.");

  const composeUrl = useMemo(
    () =>
      buildComposeUrl(palettePotionConfig, {
        text: `I brewed a ${result.strategy.mood} palette with Palette Potion ✨\nPrimary ${result.swatches.find((swatch) => swatch.role === "primary")?.hex ?? "#7E22CE"} · Accent ${result.swatches.find((swatch) => swatch.role === "accent")?.hex ?? "#EC4899"}`
      }),
    [result]
  );

  async function brew() {
    setStatus("loading");
    setMessage("Reading the brief, mixing accessible tokens…");
    try {
      const response = await fetch("/api/brew", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(brief)
      });
      const data = (await response.json()) as BrewResponse;
      if (!response.ok || !data.ok) throw new Error(data.ok ? "Could not brew palette." : data.error);
      setResult(data.result);
      setMode(data.mode);
      setStatus("idle");
      setMessage(data.mode === "llm-assisted" ? "AI read complete. Tokens are deterministic and exportable." : "Brewed with the local palette engine; AI assist was unavailable for this run.");
    } catch (error) {
      setResult(generatePalette(brief));
      setMode("deterministic-fallback");
      setStatus("error");
      setMessage(error instanceof Error ? `${error.message} Using local deterministic fallback.` : "Using local deterministic fallback.");
    }
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard?.writeText(text).catch(() => undefined);
    setMessage(`${label} copied.`);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[2rem] border border-white/30 bg-white/90 p-5 shadow-xl shadow-purple-950/10">
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-semibold text-slate-800">
            Brand vibe
            <textarea
              className="min-h-24 rounded-2xl border border-purple-200 bg-purple-50/60 p-3 text-base font-medium outline-none focus:border-purple-500"
              maxLength={240}
              value={brief.vibe}
              onChange={(event) => setBrief({ ...brief, vibe: event.target.value })}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Audience" value={brief.audience} onChange={(audience) => setBrief({ ...brief, audience })} />
            <TextInput label="Industry" value={brief.industry} onChange={(industry) => setBrief({ ...brief, industry })} />
          </div>
          <TextInput label="Colors / vibes to avoid" value={brief.avoid} onChange={(avoid) => setBrief({ ...brief, avoid })} />
          <button
            className="rounded-2xl bg-purple-700 px-5 py-4 text-base font-black text-white shadow-lg shadow-purple-900/20 disabled:opacity-60"
            disabled={status === "loading"}
            onClick={brew}
          >
            {status === "loading" ? "Brewing…" : "Brew brand palette"}
          </button>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-xl shadow-purple-950/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-200">{mode}</p>
            <h2 className="mt-1 text-2xl font-black capitalize">{result.strategy.mood}</h2>
          </div>
          <a className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950" href={composeUrl} rel="noreferrer" target="_blank">
            Share
          </a>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{result.strategy.audienceRead}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{result.strategy.colorLogic}</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {result.swatches.map((swatch) => (
          <div
            className="min-h-36 rounded-[1.5rem] border border-black/5 p-4 shadow-sm"
            key={swatch.role}
            style={{ backgroundColor: swatch.hex, color: swatch.textHex }}
          >
            <p className="text-xs font-black uppercase tracking-widest opacity-75">{swatch.role}</p>
            <p className="mt-3 text-lg font-black">{swatch.hex}</p>
            <p className="mt-1 text-sm font-semibold opacity-85">{swatch.name}</p>
            <p className="mt-4 text-xs font-bold opacity-75">Contrast {swatch.contrast}:1</p>
          </div>
        ))}
      </section>

      <section className="grid gap-3 rounded-[2rem] bg-white/90 p-5 shadow-xl shadow-purple-950/10">
        <h2 className="text-xl font-black text-slate-950">Usage notes</h2>
        <ul className="grid gap-2 text-sm leading-6 text-slate-700">
          {result.strategy.usageNotes.map((note) => (
            <li className="rounded-2xl bg-purple-50 p-3" key={note}>✨ {note}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <ExportCard title="CSS variables" text={result.cssVariables} onCopy={() => copy(result.cssVariables, "CSS variables")} />
        <ExportCard title="Tailwind colors" text={result.tailwindSnippet} onCopy={() => copy(result.tailwindSnippet, "Tailwind snippet")} />
      </section>
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-800">
      {label}
      <input
        className="rounded-2xl border border-purple-200 bg-purple-50/60 p-3 text-base font-medium outline-none focus:border-purple-500"
        maxLength={160}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ExportCard({ title, text, onCopy }: { title: string; text: string; onCopy: () => void }) {
  return (
    <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-black">{title}</h3>
        <button className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950" onClick={onCopy}>Copy</button>
      </div>
      <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-300">{text}</pre>
    </div>
  );
}
