import { SobreNosPage } from "../../../features/sobre-nos/sobre-nos-page";

export const metadata = {
  title: "About Us",
  description:
    "Meet the people behind Copero Analysis and learn why our Team PA analysis is in-depth without being complicated.",
  alternates: { canonical: "/about-us" },
};

export default function Page() {
  return <SobreNosPage />;
}
