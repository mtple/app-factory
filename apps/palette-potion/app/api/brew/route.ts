import { z } from "zod";
import { generatePalette, type BrandBrief } from "../../../lib/palette";

const requestSchema = z.object({
  vibe: z.string().trim().min(3).max(240),
  audience: z.string().trim().min(2).max(160).default("builders and creators"),
  industry: z.string().trim().min(2).max(120).default("software"),
  avoid: z.string().trim().max(120).default("")
});

const aiStrategySchema = z.object({
  mood: z.string().max(80).optional(),
  audienceRead: z.string().max(260).optional(),
  colorLogic: z.string().max(300).optional(),
  usageNotes: z.array(z.string().max(140)).min(1).max(4).optional()
});

function llmConfig(): { apiKey?: string; baseUrl: string; model: string; headers: Record<string, string> } {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();
  if (process.env.OPENROUTER_API_KEY || provider === "openrouter") {
    return {
      apiKey: process.env.OPENROUTER_API_KEY,
      baseUrl: process.env.LLM_BASE_URL || "https://openrouter.ai/api/v1",
      model: process.env.LLM_MODEL || "qwen/qwen3.5-flash-02-23",
      headers: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://app-factory-palette-potion-matt-lee.vercel.app",
        "X-Title": "Palette Potion"
      }
    };
  }

  return {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.LLM_BASE_URL || "https://api.openai.com/v1",
    model: process.env.LLM_MODEL || "gpt-4.1-mini",
    headers: {}
  };
}

async function getAiStrategy(brief: BrandBrief) {
  const config = llmConfig();
  if (!config.apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.apiKey}`,
        ...config.headers
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a pragmatic brand designer. Return compact JSON only with mood, audienceRead, colorLogic, and usageNotes (1-4 strings). No hex colors."
          },
          {
            role: "user",
            content: JSON.stringify(brief)
          }
        ]
      })
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const jsonText = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/i, "").trim();
    const raw = JSON.parse(jsonText) as Record<string, unknown>;
    const normalized = {
      mood: typeof raw.mood === "string" ? raw.mood.slice(0, 80) : undefined,
      audienceRead: typeof raw.audienceRead === "string" ? raw.audienceRead.slice(0, 260) : undefined,
      colorLogic: typeof raw.colorLogic === "string" ? raw.colorLogic.slice(0, 300) : undefined,
      usageNotes: Array.isArray(raw.usageNotes)
        ? raw.usageNotes.filter((note): note is string => typeof note === "string").slice(0, 4).map((note) => note.slice(0, 140))
        : undefined
    };
    const parsed = aiStrategySchema.safeParse(normalized);
    return parsed.success ? parsed.data : null;
  } catch (error) {
    console.warn("Palette Potion AI strategy failed", error instanceof Error ? error.message : "unknown error");
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Tell us the vibe, audience, industry, and colors to avoid.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const brief = parsed.data;
  const aiStrategy = await getAiStrategy(brief);
  const result = generatePalette(brief, aiStrategy ?? undefined);
  return Response.json({ ok: true, mode: aiStrategy ? "llm-assisted" : "deterministic", result });
}
