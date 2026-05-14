import clsx from "clsx";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ToolSectionProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export default function ToolSection({ title, children }: ToolSectionProps) {
  return (
    <section>
      <h2 className={twMerge(clsx("font-display text-[8px] text-red tracking-[1.5px] uppercase mb-3"))}>
        {title}
      </h2>
      { children }
    </section>
  );
}
