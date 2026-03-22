import PageShell from "@/components/layout/PageShell";
import KatakanaDivider from "@/components/layout/KatakanaDivider";
import HeroSection from "@/components/home/HeroSection";
import HeroImage from "@/components/home/HeroImage";

export default function Home() {
  return (
    <PageShell>
      <div className="max-h-[calc(100vh-57px)] flex flex-1">
        <HeroSection />
        <KatakanaDivider />
        <HeroImage />
      </div>
    </PageShell>
  );
}
