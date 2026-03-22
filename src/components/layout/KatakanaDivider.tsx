const glyphs = ["a", "e", "f", "v"];

export default function KatakanaDivider() {
  const glyphBlock = glyphs.map((g, i) => (
    <p key={i} className="mb-0">
      {g}
    </p>
  ));

  return (
    <div className="w-[41px] shrink-0 border-x-thin border-red-faint bg-black overflow-hidden relative">
      <div
        className="flex flex-col gap-[20px] items-center pt-[15px]"
        style={{
          animation: "katakana-scroll 30s linear infinite",
        }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="font-decorative text-[24px] text-red-subtle tracking-[0.96px] uppercase leading-normal whitespace-nowrap"
          >
            {glyphBlock}
          </div>
        ))}
      </div>
    </div>
  );
}
