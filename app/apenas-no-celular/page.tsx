import { Logo } from "../../shared/logo";

export const metadata = {
  title: "Só no celular",
  robots: { index: false, follow: false },
};

export default function MobileOnlyNoticePage() {
  return (
    <main className="page notice-page" data-testid="apenas-no-celular">
      <header className="page-header page-header--centered">
        <Logo size="md" />
      </header>
      <div className="stripe-divider" />
      <h1>
        Só no <span className="accent">celular</span>, tricolor.
      </h1>
      <p>
        O Copero Análise é feito pra arquibancada de bolso. Abre no teu
        celular.
      </p>
      <span className="badge">Acesso via desktop não é permitido</span>
      <div className="qr-card">
        <p>Aponte a câmera para abrir no celular.</p>
        <img src="https://quickchart.io/qr?text=https%3A%2F%2Fcoperoanalise.com&size=220" alt="QR code para coperoanalise.com" width="220" height="220" />
      </div>
    </main>
  );
}
