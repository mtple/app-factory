import type { HTMLAttributes, ReactNode } from "react";

type SafeAreaProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function SafeArea({ children, className = "", ...props }: SafeAreaProps) {
  return (
    <div
      className={`min-h-dvh px-[max(1rem,env(safe-area-inset-left))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
