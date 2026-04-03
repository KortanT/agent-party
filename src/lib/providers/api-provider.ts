import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, ProviderResponse } from "./types";

export class ApiProvider implements AIProvider {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = "claude-sonnet-4-20250514") {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async sendMessage(
    prompt: string,
    systemPrompt: string
  ): Promise<ReadableStream<string>> {
    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    return new ReadableStream<string>({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(event.delta.text);
          }
        }
        controller.close();
      },
    });
  }

  async sendMessageSync(
    prompt: string,
    systemPrompt: string
  ): Promise<ProviderResponse> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    return {
      content,
      tokenCount: (response.usage.input_tokens || 0) + (response.usage.output_tokens || 0),
    };
  }
}
