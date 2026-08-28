import type { MetadataRoute } from "next";

/*
  robots.txt: AI crawlers and AI-training agents are disallowed entirely.
  (The proxy also hard-blocks them by User-Agent with a 403 — this file is
  the polite signal, that one is the enforcement.)
*/

const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Google-CloudVertexBot",
  "meta-externalagent",
  "meta-externalfetcher",
  "FacebookBot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "cohere-ai",
  "cohere-training-data-crawler",
  "MistralAI-User",
  "AI2Bot",
  "Diffbot",
  "DuckAssistBot",
  "YouBot",
  "omgili",
  "ImagesiftBot",
  "PanguBot",
  "Timpibot",
  "GrokBot",
  "xAI-Crawler",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_AGENTS.map((agent) => ({
        userAgent: agent,
        disallow: "/",
      })),
      { userAgent: "*", allow: "/" },
    ],
  };
}
