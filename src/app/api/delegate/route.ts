import { NextRequest, NextResponse } from "next/server";
import { createProvider } from "@/lib/providers";
import { agentPrompts } from "@/lib/agents/prompts";
import { DelegationTask } from "@/lib/agents/types";

export async function POST(req: NextRequest) {
  try {
    const { prompt, provider, apiKey, model } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const systemPrompt = agentPrompts["komutan"];
    const ai = createProvider(provider || "api", apiKey, model);
    const response = await ai.sendMessageSync(prompt, systemPrompt);

    // Parse CEO response
    const content = response.content;
    const thinkingMatch = content.match(/\[THINKING\]\s*([\s\S]*?)(?=\[DELEGATE\]|$)/i);
    const delegateMatch = content.match(/\[DELEGATE\]\s*([\s\S]*?)$/i);

    const thinking = thinkingMatch?.[1]?.trim() || content.trim();
    const delegations: DelegationTask[] = [];

    if (delegateMatch) {
      const lines = delegateMatch[1].trim().split("\n");
      for (const line of lines) {
        const match = line.match(/^([\w-]+):\s*(.+)$/);
        if (match) {
          const agentId = match[1].trim();
          const task = match[2].trim();
          if (agentPrompts[agentId] && agentId !== "komutan") {
            delegations.push({ agentId, task });
          }
        }
      }
    }

    // If no valid delegations parsed, try to delegate to all agents
    if (delegations.length === 0) {
      delegations.push({ agentId: "merlin", task: prompt });
    }

    return NextResponse.json({
      thinking,
      delegations,
      tokenCount: response.tokenCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
