import PageShell from "@/components/layout/PageShell";
import KatakanaDivider from "@/components/layout/KatakanaDivider";
import HeroSection from "@/app/(home)/components/HeroSection";
import HeroImage from "@/app/(home)/components/HeroImage";

export default function Home() {
  return (
    <PageShell>
      <div className="max-h-[calc(100vh-var(--nav-height))] flex flex-1">
        <HeroSection />
        <KatakanaDivider />
        <HeroImage />
      </div>
    </PageShell>
  );
}
 