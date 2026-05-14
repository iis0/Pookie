import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface InfoRowProps {
  label: string;
  value: string;
  className?: string;
}

export default function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={twMerge(clsx("flex justify-between items-center py-1.5 border-b-1 border-red-faint", className))}>
      <span className="font-body text-[10px] text-soft-white-muted tracking-[0.8px] uppercase">
        {label}
      </span>
      <span className="font-body text-[11px] text-soft-white tracking-[0.5px] uppercase">
        {value}
      </span>
    </div>
  );
}
