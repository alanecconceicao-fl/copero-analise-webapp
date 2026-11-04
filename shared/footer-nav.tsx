"use client";

// Mobile-app style bottom navigation (AC 7): fixed bar, persists on scroll.
// v0 shortcuts: Home · About Us. Public routes use English slugs.
import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M14.8 14.4c2.9.4 5.2 2.8 5.2 5.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="footer-nav" data-testid="footer-nav" aria-label="Navigation">
      <Link href="/" className={pathname === "/" ? "active" : undefined}>
        <HomeIcon />
        Home
      </Link>
      <Link
        href="/about-us"
        className={pathname === "/about-us" ? "active" : undefined}
      >
        <PeopleIcon />
        About Us
      </Link>
    </nav>
  );
}
