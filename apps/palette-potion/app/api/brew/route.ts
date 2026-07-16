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

async function getAiStrategy(brief: BrandBrief) {
  const apiKey = process.env.BANKR_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.LLM_BASE_URL || process.env.BANKR_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.LLM_MODEL || "gpt-4.1-mini";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
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
    return aiStrategySchema.parse(JSON.parse(content));
  } catch {
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
