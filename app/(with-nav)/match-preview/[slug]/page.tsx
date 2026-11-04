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

  const title = `Match Preview: ${prelecao.home ? `Team PA x ${prelecao.match.opponent}` : `${prelecao.match.opponent} x Team PA`}`;
  const description = `Match analysis at ${prelecao.stadium}.`;

  return {
    title,
    description,
    alternates: { canonical: `/match-preview/${prelecao.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/match-preview/${prelecao.slug}`,
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
    permanentRedirect(`/match-preview/${prelecao.slug}`);
  }

  return <PrelecaoPage prelecao={prelecao} />;
}
