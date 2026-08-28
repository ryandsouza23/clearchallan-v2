import { NextResponse, type NextRequest } from "next/server";

/*
  AI-access firewall. Blocks every self-identifying AI crawler and
  chat-assistant fetcher (the agents that fetch a URL when it's pasted
  into ChatGPT, Claude, Perplexity, Gemini, Copilot, …) with a 403.
  Ordinary browsers are untouched. This stops well-behaved, identified
  bots; nothing except real authentication stops a client that lies
  about its User-Agent.
*/

const AI_BOT_PATTERN = new RegExp(
  [
    // OpenAI
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    // Anthropic
    "ClaudeBot",
    "Claude-Web",
    "Claude-User",
    "Claude-SearchBot",
    "anthropic-ai",
    // Perplexity
    "PerplexityBot",
    "Perplexity-User",
    // Google AI (Gemini fetching; search crawl uses Googlebot, unaffected)
    "Google-Extended",
    "Google-CloudVertexBot",
    // Meta
    "meta-externalagent",
    "meta-externalfetcher",
    "FacebookBot",
    // Microsoft Copilot's fetcher identifies via these
    "BingPreview",
    // Common-crawl & training scrapers
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
  ].join("|"),
  "i",
);

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (AI_BOT_PATTERN.test(ua)) {
    return new NextResponse(
      "Automated AI access to this site is not permitted.\n",
      { status: 403, headers: { "content-type": "text/plain" } },
    );
  }
  // Signal "no AI use" to compliant crawlers on every response.
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noai, noimageai");
  return response;
}

export const config = {
  // Everything except static assets emitted by Next itself.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
