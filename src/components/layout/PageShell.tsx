import { cn } from "@/utils/cn";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />
      <main className={cn("flex flex-1 min-h-[calc(100vh-var(--nav-height))]", className)}>{children}</main>
      <Footer />
    </div>
  );
}
