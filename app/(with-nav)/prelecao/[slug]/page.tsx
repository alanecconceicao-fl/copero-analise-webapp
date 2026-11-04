import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { PrelecaoPage } from "../../../../features/prelecao/prelecao-page";
import { fetchPrelecao } from "../../../../features/prelecao/prelecao-api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const getPrelecao = cache(async (slug: string) => {
  return fetchPrelecao(slug);
});

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const prelecao = await getPrelecao(slug);

  if (!prelecao) {
    return {};
  }

  const title = `Preleção: ${prelecao.home ? `Grêmio x ${prelecao.match.opponent}` : `${prelecao.match.opponent} x Grêmio`}`;
  const description = `Análise do jogo no ${prelecao.stadium}.`;

  return {
    title,
    description,
    alternates: { canonical: `/prelecao/${prelecao.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/prelecao/${prelecao.slug}`,
    },
  };
}

export default async function PublicPrelecaoRoute({ params }: PageProps) {
  const { slug } = await params;
  const prelecao = await getPrelecao(slug);

  if (!prelecao) {
    notFound();
  }
  if (prelecao.slug !== slug) {
    permanentRedirect(`/prelecao/${prelecao.slug}`);
  }

  return <PrelecaoPage prelecao={prelecao} />;
}
