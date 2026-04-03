import { AIProvider } from "./types";
import { ApiProvider } from "./api-provider";
import { CliProvider } from "./cli-provider";
import { ProviderType } from "../agents/types";

export function createProvider(
  type: ProviderType,
  apiKey?: string,
  model?: string
): AIProvider {
  switch (type) {
    case "api":
      if (!apiKey) throw new Error("API key is required for API provider");
      return new ApiProvider(apiKey, model);
    case "cli":
      return new CliProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

export type { AIProvider, ProviderResponse } from "./types";
