"use client";

import { useCallback } from "react";
import { useGameStore } from "@/lib/store";
import { ChatMessage } from "@/lib/agents/types";

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useChat() {
  const {
    agents,
    selectedAgentId,
    settings,
    addMessage,
    updateMessage,
    setStreaming,
    completeTask,
    setAgentStatus,
  } = useGameStore();

  const sendToAgent = useCallback(
    async (prompt: string, agentId: string) => {
      const msgId = createId();

      // Add placeholder message
      addMessage({
        id: msgId,
        agentId,
        content: "",
        timestamp: Date.now(),
        type: "response",
      });

      setAgentStatus(agentId, "working");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            agentId,
            provider: settings.provider,
            apiKey: settings.apiKey,
            model: settings.model,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "API error");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          updateMessage(msgId, fullContent);
        }

        // Estimate tokens from content length
        const estimatedTokens = Math.ceil(fullContent.length / 4) + 200;
        completeTask(agentId, estimatedTokens);
        setAgentStatus(agentId, "ready");
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        updateMessage(msgId, `[Hata: ${errorMsg}]`);
        setAgentStatus(agentId, "ready");
      }
    },
    [addMessage, updateMessage, completeTask, setAgentStatus, settings]
  );

  const sendMessage = useCallback(
    async (prompt: string) => {
      // Add user message
      addMessage({
        id: createId(),
        agentId: "user",
        content: prompt,
        timestamp: Date.now(),
        type: "task",
      });

      setStreaming(true);

      if (selectedAgentId === "all") {
        // Send to all agents in parallel
        await Promise.all(agents.map((agent) => sendToAgent(prompt, agent.id)));
      } else {
        await sendToAgent(prompt, selectedAgentId);
      }

      setStreaming(false);
    },
    [agents, selectedAgentId, addMessage, setStreaming, sendToAgent]
  );

  return { sendMessage };
}

export function useDiscussion() {
  const {
    agents,
    settings,
    addMessage,
    setStreaming,
    setDiscussing,
    completeTask,
  } = useGameStore();

  const startDiscussion = useCallback(
    async (topic: string) => {
      addMessage({
        id: Date.now().toString(36),
        agentId: "system",
        content: `Tartisma basladi: "${topic}"`,
        timestamp: Date.now(),
        type: "system",
      });

      setStreaming(true);
      setDiscussing(true);

      try {
        const res = await fetch("/api/discuss", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            agentIds: agents.map((a) => a.id),
            rounds: 2,
            provider: settings.provider,
            apiKey: settings.apiKey,
            model: settings.model,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Discussion API error");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        let currentAgentId: string | null = null;
        let currentMsgId: string | null = null;
        let currentContent = "";

        const processBuffer = () => {
          // Check for agent markers
          const agentMatch = buffer.match(/__AGENT:(.+?)__/);
          if (agentMatch) {
            const newAgentId = agentMatch[1];
            const markerEnd =
              buffer.indexOf(`__AGENT:${newAgentId}__`) +
              `__AGENT:${newAgentId}__`.length;

            // Save remaining content before marker
            const before = buffer.substring(0, agentMatch.index).trim();
            if (before && currentMsgId) {
              currentContent += before;
              useGameStore
                .getState()
                .updateMessage(currentMsgId, currentContent);
            }

            buffer = buffer.substring(markerEnd);
            currentAgentId = newAgentId;
            currentContent = "";
            currentMsgId = Date.now().toString(36) + Math.random().toString(36).slice(2);

            addMessage({
              id: currentMsgId,
              agentId: currentAgentId,
              content: "",
              timestamp: Date.now(),
              type: "discussion",
            });

            return true;
          }

          // Check for token markers
          const tokenMatch = buffer.match(
            /__TOKENS:(.+?):(\d+)__/
          );
          if (tokenMatch) {
            const tokenAgentId = tokenMatch[1];
            const tokenCount = parseInt(tokenMatch[2]);
            completeTask(tokenAgentId, tokenCount);

            buffer = buffer.substring(
              (tokenMatch.index ?? 0) + tokenMatch[0].length
            );
            return true;
          }

          // Regular content
          if (currentMsgId && buffer.length > 0 && !buffer.includes("__")) {
            currentContent += buffer;
            useGameStore
              .getState()
              .updateMessage(currentMsgId, currentContent);
            buffer = "";
          }

          return false;
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          while (processBuffer()) {
            /* keep processing markers */
          }
        }

        // Process remaining buffer
        if (buffer.trim() && currentMsgId) {
          const clean = buffer.replace(/__\w+:.+?__/g, "").trim();
          if (clean) {
            currentContent += clean;
            useGameStore
              .getState()
              .updateMessage(currentMsgId, currentContent);
          }
        }

        addMessage({
          id: Date.now().toString(36),
          agentId: "system",
          content: "Tartisma sona erdi.",
          timestamp: Date.now(),
          type: "system",
        });
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        addMessage({
          id: Date.now().toString(36),
          agentId: "system",
          content: `[Tartisma hatasi: ${errorMsg}]`,
          timestamp: Date.now(),
          type: "system",
        });
      } finally {
        setStreaming(false);
        setDiscussing(false);
      }
    },
    [agents, settings, addMessage, setStreaming, setDiscussing, completeTask]
  );

  return { startDiscussion };
}
