import { SobreNosPage } from "../../../features/sobre-nos/sobre-nos-page";

export const metadata = {
  title: "About Us",
  description:
    "Meet the people behind Copero Analysis and learn why our Grêmio analysis is in-depth without being complicated.",
  alternates: { canonical: "/sobre-nos" },
};

export default function Page() {
  return <SobreNosPage />;
}
