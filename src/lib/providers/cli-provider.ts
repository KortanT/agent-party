import { spawn } from "child_process";
import { AIProvider, ProviderResponse } from "./types";

export class CliProvider implements AIProvider {
  async sendMessage(
    prompt: string,
    systemPrompt: string
  ): Promise<ReadableStream<string>> {
    const fullPrompt = `${systemPrompt}\n\n---\n\nUser: ${prompt}`;

    return new ReadableStream<string>({
      start(controller) {
        const proc = spawn(
          "claude",
          ["-p", fullPrompt, "--output-format", "stream-json", "--verbose"],
          { stdio: ["pipe", "pipe", "pipe"] }
        );

        let buffer = "";
        let sentContent = "";

        proc.stdout.on("data", (data: Buffer) => {
          buffer += data.toString();
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const parsed = JSON.parse(line);

              if (parsed.type === "assistant" && parsed.message?.content) {
                for (const block of parsed.message.content) {
                  if (block.type === "text" && block.text) {
                    // Only send new content (not already sent)
                    const newText = block.text;
                    if (newText.length > sentContent.length) {
                      controller.enqueue(newText.slice(sentContent.length));
                      sentContent = newText;
                    } else if (!sentContent) {
                      controller.enqueue(newText);
                      sentContent = newText;
                    }
                  }
                }
              } else if (parsed.type === "result" && parsed.result) {
                // Final result - send anything not yet sent
                const remaining = parsed.result.slice(sentContent.length).trim();
                if (remaining) {
                  controller.enqueue(remaining);
                }
              }
            } catch {
              // Not JSON - ignore
            }
          }
        });

        proc.stderr.on("data", (data: Buffer) => {
          const errMsg = data.toString().trim();
          if (errMsg && !errMsg.includes("Warning")) {
            controller.enqueue(`[CLI Error: ${errMsg}]`);
          }
        });

        proc.on("close", () => {
          // Process remaining buffer
          if (buffer.trim()) {
            try {
              const parsed = JSON.parse(buffer);
              if (parsed.type === "result" && parsed.result) {
                const remaining = parsed.result.slice(sentContent.length).trim();
                if (remaining) {
                  controller.enqueue(remaining);
                }
              }
            } catch {
              // ignore
            }
          }
          controller.close();
        });

        proc.on("error", () => {
          controller.enqueue(
            "[Error: Claude CLI not found. Make sure 'claude' is installed and in PATH.]"
          );
          controller.close();
        });
      },
    });
  }

  async sendMessageSync(
    prompt: string,
    systemPrompt: string
  ): Promise<ProviderResponse> {
    const fullPrompt = `${systemPrompt}\n\n---\n\nUser: ${prompt}`;

    return new Promise((resolve, reject) => {
      const proc = spawn(
        "claude",
        ["-p", fullPrompt, "--output-format", "json"],
        { stdio: ["pipe", "pipe", "pipe"] }
      );

      let stdout = "";
      let stderr = "";

      proc.stdout.on("data", (data: Buffer) => {
        stdout += data.toString();
      });

      proc.stderr.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      proc.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Claude CLI exited with code ${code}: ${stderr}`));
          return;
        }

        try {
          const parsed = JSON.parse(stdout);
          const inputTokens = parsed.usage?.input_tokens || 0;
          const outputTokens = parsed.usage?.output_tokens || 0;
          const cacheTokens =
            (parsed.usage?.cache_read_input_tokens || 0) +
            (parsed.usage?.cache_creation_input_tokens || 0);
          resolve({
            content: parsed.result || "",
            tokenCount: inputTokens + outputTokens + cacheTokens || 500,
          });
        } catch {
          resolve({ content: stdout.trim(), tokenCount: 500 });
        }
      });

      proc.on("error", (err) => {
        reject(
          new Error(
            `Claude CLI not found. Make sure 'claude' is installed and in PATH. ${err.message}`
          )
        );
      });
    });
  }
}
