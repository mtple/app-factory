import { palettePotionConfig } from "./config";
import { PalettePotionShell } from "./client/PalettePotionShell";
import { PalettePotionApp } from "./client/PalettePotionApp";

export default function HomePage() {
  return (
    <PalettePotionShell>
      <main className="min-h-dvh bg-[radial-gradient(circle_at_top_left,#f5d0fe,transparent_34%),linear-gradient(135deg,#fff7ed,#f5f3ff_45%,#ecfeff)] px-5 py-7 text-slate-950">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
          <header className="rounded-[2rem] border border-white/40 bg-white/80 p-5 shadow-xl shadow-purple-950/10 backdrop-blur">
            <div className="flex items-center gap-4">
              <img
                alt=""
                className="h-16 w-16 rounded-2xl border border-purple-200 bg-white"
                height="64"
                src={palettePotionConfig.iconPath}
                width="64"
              />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-700">App Factory</p>
                <h1 className="text-3xl font-black tracking-tight">{palettePotionConfig.name}</h1>
                <p className="mt-1 text-sm font-semibold text-slate-600">{palettePotionConfig.subtitle}</p>
              </div>
            </div>
            <p className="mt-4 text-base leading-7 text-slate-700">{palettePotionConfig.description}</p>
          </header>
          <PalettePotionApp />
        </div>
      </main>
    </PalettePotionShell>
  );
}
