import { SOCIALS } from "@/utils/consts";

const footerLinks = [
  { label: "Gallery", href: "/gallery" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t-thin border-red-faint px-page-x py-[18px] flex items-center justify-between">
      {/* Copyright */}
      <span className="font-display text-[10px] tracking-[0.4px] text-soft-white-muted">
        &copy; 2026 iis0
      </span>

      {/* Social */}
      <div className="flex items-center">
        <a
          href={SOCIALS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex items-center opacity-55 hover:opacity-85 transition-opacity"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-soft-white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="5" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1.2"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
