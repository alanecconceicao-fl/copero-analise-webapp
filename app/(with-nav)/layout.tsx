// Route group of the navigable app surface: these pages carry the app-style
// footer nav. The desktop notice (/apenas-no-celular) lives OUTSIDE the group
// on purpose — a dead end gets no navigation.
import type { ReactNode } from "react";
import { FooterNav } from "../../shared/footer-nav";

export default function WithNavLayout({ children }: { children: ReactNode }) {
  return (
    <div className="with-nav-content">
      {children}
      <FooterNav />
    </div>
  );
}
