export interface ProviderResponse {
  content: string;
  tokenCount: number;
}

export interface AIProvider {
  sendMessage(
    prompt: string,
    systemPrompt: string
  ): Promise<ReadableStream<string>>;

  sendMessageSync(
    prompt: string,
    systemPrompt: string
  ): Promise<ProviderResponse>;
}
