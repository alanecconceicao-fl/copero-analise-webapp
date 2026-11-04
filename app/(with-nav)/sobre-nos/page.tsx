import { SobreNosPage } from "../../../features/sobre-nos/sobre-nos-page";

export const metadata = {
  title: "Sobre nós",
  description:
    "Quem faz o Copero Análise e por que a análise do Grêmio aqui é profunda sem ser complicada.",
  alternates: { canonical: "/sobre-nos" },
};

export default function Page() {
  return <SobreNosPage />;
}
