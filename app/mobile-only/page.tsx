import { Logo } from "../../shared/logo";

export const metadata = {
  title: "Mobile only",
  robots: { index: false, follow: false },
};

export default function MobileOnlyNoticePage() {
  return (
    <main className="page notice-page" data-testid="mobile-only">
      <header className="page-header page-header--centered">
        <Logo size="md" />
      </header>
      <div className="stripe-divider" />
      <h1>
        Only on <span className="accent">mobile</span>, Tricolor.
      </h1>
      <p>
        Copero Analysis is made for the stands in your pocket. Open it on your
        phone.
      </p>
      <span className="badge">Desktop access is not allowed</span>
      <div className="qr-card">
        <p>Point your camera to open it on your phone.</p>
        <img src="https://quickchart.io/qr?text=https%3A%2F%2Fcoperoanalise.com&size=220" alt="QR code for coperoanalise.com" width="220" height="220" />
      </div>
    </main>
  );
}
