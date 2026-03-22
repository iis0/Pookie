"use client";

import { SOCIALS } from "@/utils/consts";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b-thin border-red-faint px-page-x shrink-0">
      <div className="grid grid-cols-3 items-center py-[10px]">
        {/* Logo */}
        <Link href="/" className="flex items-end justify-self-start">
          <Image
            src="/images/pookie-logo.png"
            alt="Pookie"
            width={168}
            height={37}
            priority
            className="h-[37px] w-auto"
          />
        </Link>

        {/* Nav Links */}
        <div className="flex gap-[20px] items-center justify-self-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-body text-[14px] uppercase tracking-[0.56px] transition-colors hover:text-soft-white ${
                  isActive ? "text-soft-white" : "text-soft-white-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Social */}
        <div className="flex items-center justify-self-end">
          <a
            href={SOCIALS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-55 hover:opacity-80 transition-opacity"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0416 1.4165H4.95829C3.00228 1.4165 1.41663 3.00216 1.41663 4.95817V12.0415C1.41663 13.9975 3.00228 15.5832 4.95829 15.5832H12.0416C13.9976 15.5832 15.5833 13.9975 15.5833 12.0415V4.95817C15.5833 3.00216 13.9976 1.4165 12.0416 1.4165Z"
                stroke="#A11212"
                strokeWidth="1.13333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.49996 11.3332C10.0648 11.3332 11.3333 10.0646 11.3333 8.49984C11.3333 6.93503 10.0648 5.6665 8.49996 5.6665C6.93515 5.6665 5.66663 6.93503 5.66663 8.49984C5.66663 10.0646 6.93515 11.3332 8.49996 11.3332Z"
                stroke="#A11212"
                strokeWidth="1.13333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.3958 5.31266C12.787 5.31266 13.1042 4.99553 13.1042 4.60433C13.1042 4.21313 12.787 3.896 12.3958 3.896C12.0046 3.896 11.6875 4.21313 11.6875 4.60433C11.6875 4.99553 12.0046 5.31266 12.3958 5.31266Z"
                fill="#A11212"
              />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
