import { notFound } from "next/navigation";
import { TutorialDocument } from "@/components/tutorial-document";
import { getTutorial, sourceAuthor, tutorialEntries } from "@/lib/tutorials";

export function generateStaticParams() { return tutorialEntries.map(({ slug }) => ({ slug })); }

export default async function TutorialDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tutorial = getTutorial(slug);
  if (!tutorial) notFound();
  return <TutorialDocument tutorial={tutorial} sourceAuthors={(tutorial.sources || []).map(([, url]) => sourceAuthor(url))} />;
}
