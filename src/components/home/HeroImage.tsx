import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="flex-1 h-full border-l-[0.5px] border-red-faint overflow-hidden relative">
      <Image
        src="/images/barca-tile-plain.png"
        alt="Pookieverse hero art"
        fill
        sizes="50vw"
        className="object-cover opacity-50"
        priority
      />
    </div>
  );
}
