import rawTutorials from "@/data/tutorials.json";

type LegacySource = [string, string];
export type TutorialBlock =
  | { type: "prompt" | "code"; label?: string; text: string }
  | { type: "note"; kind?: "tip" | "ok" | "warn" | "danger"; icon?: string; label?: string; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "text"; text?: string };
export type Tutorial = {
  short: string;
  eyebrow: string;
  titleHtml: string;
  sub: string;
  chips: string[];
  introIcon?: string;
  introTitle?: string;
  intro?: string;
  goalLead?: string;
  goal?: string;
  outcomes?: [string, string][];
  module?: string;
  moduleSub?: string;
  criteria?: string[];
  steps: Array<{ title: string; time: string; target: string; blocks: TutorialBlock[]; done: string }>;
  faq?: [string, string, string][];
  sources?: LegacySource[];
};

// Legacy tutorial JSON is imported from the original static site. Its arrays are
// structurally validated by rendering code, so cross the JSON boundary explicitly.
const data = rawTutorials as unknown as Record<string, Tutorial>;

export const tutorialEntries = Object.entries(data).map(([slug, tutorial]) => ({ slug, ...tutorial }));

export function getTutorial(slug: string) {
  return tutorialEntries.find((tutorial) => tutorial.slug === slug);
}

export function sourceAuthor(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith("x.com")) {
      const handle = parsed.pathname.split("/").filter(Boolean)[0];
      return handle ? `@${handle}` : "X 原帖作者";
    }
    if (parsed.hostname.includes("supabase.com") || parsed.hostname.includes("openai.com") || parsed.hostname.includes("shopify.com") || parsed.hostname.includes("amazon.com")) return "官方文档";
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return "来源待核验";
  }
}

export function categoryFor(slug: string) {
  if (slug.includes("ecom") || slug.includes("shopify") || slug.includes("amazon") || slug.includes("ugc") || slug.includes("store") || slug.includes("health")) return "跨境电商";
  if (slug.includes("video") || slug.includes("tts") || slug.includes("character")) return "创作";
  if (slug.includes("rag") || slug.includes("document") || slug.includes("csv")) return "数据与知识";
  if (slug.includes("agent") || slug.includes("n8n") || slug.includes("codex")) return "Agent 自动化";
  return "AI 实战";
}
