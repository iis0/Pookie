import { useMemo } from "react";
import Button from "./Button";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface ControlOption<T> {
  label: string;
  value: T;
}

interface SegmentControlProps<T> {
  options: ControlOption<T>[];
  value: T;
  setValue: (value: T) => void;
  className?: string;
}

export default function SegmentControl<T>({
  options,
  value,
  setValue,
  className
}: SegmentControlProps<T>) {
  const Options = useMemo(() => {
    return options.map(({ label, value: optionValue }, index) => {
      const isActive = optionValue === value;
      const showBorder = index !== options.length - 1;
      return (
        <Button
          key={nanoid()}
          onClick={() => setValue(optionValue)}
          buttonType="secondary"
          className={twMerge(clsx(
            `text-[10px] px-0 w-full text-soft-white ${showBorder ? "border-t-0 border-b-0 border-l-0" : "border-0"} ${
              isActive
                ? "bg-red-subtle hover:text-soft-white hover:text-white"
                : "bg-transparent"
            } ${className}`,
          ))}
        >
          {label}
        </Button>
      );
    });
  }, [options, value, setValue, className]);

  return (
    <div className="border-1 border-red-faint grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
      {Options}
    </div>
  );
}
