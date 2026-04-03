import { NextRequest, NextResponse } from "next/server";
import { createProvider } from "@/lib/providers";
import { agentPrompts, discussionPrompt } from "@/lib/agents/prompts";

export async function POST(req: NextRequest) {
  try {
    const { topic, agentIds, rounds, provider, apiKey, model } = await req.json();

    if (!topic || !agentIds?.length) {
      return NextResponse.json(
        { error: "Missing topic or agentIds" },
        { status: 400 }
      );
    }

    const ai = createProvider(provider || "api", apiKey, model);
    const totalRounds = Math.min(rounds || 3, 5);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const allMessages: { agentId: string; content: string }[] = [];

        for (let round = 0; round < totalRounds; round++) {
          for (const agentId of agentIds) {
            const systemPrompt = agentPrompts[agentId];
            if (!systemPrompt) continue;

            const previousMessages = allMessages
              .map((m) => `[${m.agentId}]: ${m.content}`)
              .join("\n\n");

            const fullPrompt = discussionPrompt(topic, previousMessages);

            // Send a marker for which agent is speaking
            controller.enqueue(
              encoder.encode(`\n__AGENT:${agentId}__\n`)
            );

            const response = await ai.sendMessageSync(fullPrompt, systemPrompt);
            allMessages.push({ agentId, content: response.content });

            // Send the response content
            controller.enqueue(encoder.encode(response.content));

            // Send token count for RPG stats
            controller.enqueue(
              encoder.encode(`\n__TOKENS:${agentId}:${response.tokenCount}__\n`)
            );
          }
        }

        controller.close();
      },
    });

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
