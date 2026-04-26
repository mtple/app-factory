import type { HTMLAttributes } from "react";

type ShareBarProps = HTMLAttributes<HTMLDivElement> & {
  composeUrl: string;
  label?: string;
};

export function ShareBar({ composeUrl, label = "Share", className = "", ...props }: ShareBarProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-md border border-neutral-200 bg-white p-3 ${className}`}
      {...props}
    >
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <a
        className="inline-flex min-h-10 items-center justify-center rounded-md bg-neutral-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        href={composeUrl}
        rel="noreferrer"
        target="_blank"
      >
        Open Compose
      </a>
    </div>
  );
}
