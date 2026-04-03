import { NextRequest, NextResponse } from "next/server";
import { createProvider } from "@/lib/providers";
import { agentPrompts } from "@/lib/agents/prompts";

export async function POST(req: NextRequest) {
  try {
    const { prompt, agentId, provider, apiKey, model } = await req.json();

    if (!prompt || !agentId) {
      return NextResponse.json(
        { error: "Missing prompt or agentId" },
        { status: 400 }
      );
    }

    const systemPrompt = agentPrompts[agentId];
    if (!systemPrompt) {
      return NextResponse.json(
        { error: "Unknown agent" },
        { status: 400 }
      );
    }

    const ai = createProvider(provider || "api", apiKey, model);
    const stream = await ai.sendMessage(prompt, systemPrompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
