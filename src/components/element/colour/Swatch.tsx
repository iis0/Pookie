interface SwatchProps {
  colour: string;
  showLabel?: boolean;
  
}

export default function Swatch({ colour, showLabel }: SwatchProps) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className="w-8 h-8 shrink-0 border-1 border-red-faint"
        style={{ background: colour }}
      />
      {showLabel && (
        <span className="font-body text-[11px] text-soft-white-muted tracking-[0.5px] uppercase">
          {colour}
        </span>
      )}
    </div>
  );
}
