import { cn } from "@/utils/cn";
import Navbar from "./Navbar";

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
      <main className={cn("flex flex-1", className)}>{children}</main>
    </div>
  );
}
