import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section
      className={`rounded-md border border-neutral-200 bg-white p-5 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
