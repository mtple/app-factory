import { ShareBar } from "@app-factory/ui";
import { buildComposeUrl } from "@app-factory/farcaster";
import { claudeTestLabConfig } from "./config";
import { TestLabShell } from "./client/TestLabShell";
import { TestCards } from "./client/TestCards";

const composeUrl = buildComposeUrl(claudeTestLabConfig, {
  text: "Running diagnostics in Claude Test Lab \u{1F9EA}"
});

export default function HomePage() {
  return (
    <TestLabShell>
      <main className="min-h-dvh bg-violet-50 px-5 py-8 text-slate-950">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <header className="flex items-center gap-4">
            <img
              alt=""
              className="h-16 w-16 rounded-xl border border-violet-200 bg-white"
              height="64"
              src={claudeTestLabConfig.iconPath}
              width="64"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{claudeTestLabConfig.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{claudeTestLabConfig.subtitle}</p>
            </div>
          </header>

          <TestCards />

          <ShareBar composeUrl={composeUrl} label="Share your results" />
        </div>
      </main>
    </TestLabShell>
  );
}
