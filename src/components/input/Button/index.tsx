import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  buttonType?: "primary" | "secondary";
}

const styleMap = {
  base: "font-body text-[14px] tracking-[0.72px] py-1.5 px-5 cursor-pointer transition-all duration-150 uppercase disabled:cursor-not-allowed",
  type: {
    primary: "bg-red text-black border-none hover:brightness-[1.15] hover:brightness-[1]",
    secondary: "border-1 border-red-faint text-soft-white bg-transparent hover:bg-red/20 hover:text-white disabled:text-soft-white disabled:bg-transparent"
  }
};

export default function Button({
  onClick,
  buttonType = "primary",
  className,
  children,
  ...props
}: ButtonProps) {

    const buttonClass = twMerge(clsx(styleMap.base, styleMap.type[buttonType], className));

  return (
    <button onClick={onClick} className={buttonClass} {...props}>
        {children}
    </button>
  );
}
