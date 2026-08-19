import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TutorialDocument } from "@/components/tutorial-document";
import { getTutorial, sourceAuthor, tutorialEntries } from "@/lib/tutorials";

export function generateStaticParams() { return tutorialEntries.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) return {};
  return {
    title: tutorial.short,
    description: tutorial.sub,
    alternates: { canonical: `/tutorials/${slug}` },
    openGraph: {
      title: tutorial.short,
      description: tutorial.sub,
      type: "article",
    },
  };
}

export default async function TutorialDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tutorial.short,
    description: tutorial.sub,
    step: tutorial.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.target,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TutorialDocument tutorial={tutorial} sourceAuthors={(tutorial.sources || []).map(([, url]) => sourceAuthor(url))} />
    </>
  );
}
