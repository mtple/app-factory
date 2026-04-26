import { Card } from "@app-factory/ui";
import { helloMiniAppConfig } from "./config";
import { MiniAppShell } from "./client/MiniAppShell";

export default function HomePage() {
  return (
    <MiniAppShell>
      <main className="min-h-dvh bg-slate-50 px-5 py-8 text-slate-950">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <header className="flex items-center gap-4">
            <img
              alt=""
              className="h-16 w-16 rounded-md border border-slate-200 bg-white"
              height="64"
              src={helloMiniAppConfig.iconPath}
              width="64"
            />
            <div>
              <h1 className="text-2xl font-bold tracking-normal">{helloMiniAppConfig.name}</h1>
              <p className="mt-1 text-sm text-slate-600">{helloMiniAppConfig.subtitle}</p>
            </div>
          </header>

          <Card>
            <p className="text-base leading-7 text-slate-700">{helloMiniAppConfig.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-950">Category</dt>
                <dd className="mt-1 text-slate-600">{helloMiniAppConfig.primaryCategory}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-950">Webhook</dt>
                <dd className="mt-1 break-words text-slate-600">{helloMiniAppConfig.webhookPath}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </main>
    </MiniAppShell>
  );
}
