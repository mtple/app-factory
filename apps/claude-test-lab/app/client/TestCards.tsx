"use client";

import { useEffect, useState } from "react";
import { useTestLab, type ReadyStatus } from "./TestLabShell";

type CheckStatus = "pending" | "ok" | "error";

function StatusDot({ status }: { status: CheckStatus }) {
  const colors: Record<CheckStatus, string> = {
    pending: "bg-amber-400",
    ok: "bg-emerald-500",
    error: "bg-red-500"
  };
  const labels: Record<CheckStatus, string> = {
    pending: "checking…",
    ok: "pass",
    error: "fail"
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${colors[status]}`} />
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {labels[status]}
      </span>
    </span>
  );
}

function ReadyCard({ status }: { status: ReadyStatus }) {
  const detail: Record<ReadyStatus, string> = {
    pending: "Waiting for sdk.actions.ready() to resolve…",
    ok: "sdk.actions.ready() resolved successfully.",
    error: "sdk.actions.ready() threw — check the console."
  };
  return (
    <section className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">Check 1</p>
          <h2 className="mt-0.5 text-base font-bold text-slate-900">Ready Signal</h2>
        </div>
        <StatusDot status={status} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{detail[status]}</p>
    </section>
  );
}

function EmbedMetaCard() {
  const [status, setStatus] = useState<CheckStatus>("pending");
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    const tag = document.querySelector<HTMLMetaElement>('meta[name="fc:miniapp"]');
    if (tag?.content) {
      setContent(tag.content);
      setStatus("ok");
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <section className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">Check 2</p>
          <h2 className="mt-0.5 text-base font-bold text-slate-900">Embed Metadata</h2>
        </div>
        <StatusDot status={status} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        {status === "pending" && "Scanning <head> for fc:miniapp meta tag…"}
        {status === "error" && "fc:miniapp meta tag not found in <head>."}
        {status === "ok" && (
          <>
            fc:miniapp meta tag found.{" "}
            <code className="break-all rounded bg-violet-50 px-1 py-0.5 text-xs text-violet-700">
              {content}
            </code>
          </>
        )}
      </p>
    </section>
  );
}

function ManifestCard() {
  const [status, setStatus] = useState<CheckStatus>("pending");
  const [detail, setDetail] = useState("Tap Verify to fetch the manifest route.");

  function verify() {
    setStatus("pending");
    setDetail("Fetching /.well-known/farcaster.json…");
    fetch("/.well-known/farcaster.json")
      .then((r) => r.json())
      .then((json) => {
        if (json?.miniapp?.version) {
          setStatus("ok");
          setDetail(`Manifest v${json.miniapp.version} — "${json.miniapp.name}" returned.`);
        } else {
          setStatus("error");
          setDetail("Route responded but missing miniapp.version field.");
        }
      })
      .catch(() => {
        setStatus("error");
        setDetail("Fetch failed — is the dev server running?");
      });
  }

  return (
    <section className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500">Check 3</p>
          <h2 className="mt-0.5 text-base font-bold text-slate-900">Manifest Route</h2>
        </div>
        <StatusDot status={status} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{detail}</p>
      <button
        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        onClick={verify}
        type="button"
      >
        Verify
      </button>
    </section>
  );
}

export function TestCards() {
  const { readyStatus } = useTestLab();
  return (
    <div className="flex flex-col gap-4">
      <ReadyCard status={readyStatus} />
      <EmbedMetaCard />
      <ManifestCard />
    </div>
  );
}
