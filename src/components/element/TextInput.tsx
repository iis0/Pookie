import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface TextInputProps extends React.HTMLAttributes<HTMLInputElement> {
    value?: string;
    maxLength?: number;
}

export default function TextInput({ value, maxLength, ...props }: TextInputProps) {
  return (
    <input
      type="text"
      value={value}
      maxLength={maxLength}
      className={twMerge(clsx("flex-1 font-body text-[11px] text-soft-white bg-transparent border-1 border-red-faint py-1.5 px-2 tracking-[0.5px] outline-none w-full"))}
      {...props}
    />
  );
}
