import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="flex-1 flex flex-col justify-end gap-[42px] pl-[40px] pb-[20px] pt-[100px]">
      <h1 className="font-[family-name:var(--font-display)] text-[46px] leading-[1.2] tracking-[1.84px] text-red">
        <span className="block">Welcome</span>
        <span className="block">To the Pookieverse</span>
      </h1>

      <div className="flex flex-col items-start">
        <p className="font-[family-name:var(--font-body)] text-[18px] leading-[1.2] tracking-[0.72px] text-soft-white w-[266px]">
          You are currently in the innerworkings of iis0&apos;s mind, AKA the
          Pookieverse
        </p>

        <Link
          href="/gallery"
          className="mt-[91px] bg-red px-[20px] py-[7px] inline-flex items-center justify-center font-[family-name:var(--font-display)] text-[18px] tracking-[0.72px] text-black hover:brightness-[1.15] transition-[filter]"
        >
          Enter
        </Link>
      </div>
    </div>
  );
}
