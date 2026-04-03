"use client";

import { useCallback } from "react";
import { useGameStore } from "@/lib/store";

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function useChat() {
  const {
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

        const estimatedTokens = Math.ceil(fullContent.length / 4) + 200;
        completeTask(agentId, estimatedTokens);
        setAgentStatus(agentId, "ready");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        updateMessage(msgId, `[Hata: ${errorMsg}]`);
        setAgentStatus(agentId, "ready");
      }
    },
    [addMessage, updateMessage, completeTask, setAgentStatus, settings]
  );

  // CEO delegation flow: user -> CEO -> agents
  const sendToCEO = useCallback(
    async (prompt: string) => {
      // 1. Show user message
      addMessage({
        id: createId(),
        agentId: "user",
        content: prompt,
        timestamp: Date.now(),
        type: "task",
      });

      setStreaming(true);
      setAgentStatus("komutan", "working");

      try {
        // 2. Send to CEO for delegation
        const res = await fetch("/api/delegate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            provider: settings.provider,
            apiKey: settings.apiKey,
            model: settings.model,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Delegation error");
        }

        const data = await res.json();

        // 3. Show CEO thinking
        addMessage({
          id: createId(),
          agentId: "komutan",
          content: data.thinking,
          timestamp: Date.now(),
          type: "delegation",
        });

        if (data.tokenCount) {
          completeTask("komutan", data.tokenCount);
        }
        setAgentStatus("komutan", "ready");

        // 4. Delegate to agents in parallel
        if (data.delegations?.length > 0) {
          addMessage({
            id: createId(),
            agentId: "system",
            content: `Komutan ${data.delegations.length} ajana gorev dagitti`,
            timestamp: Date.now(),
            type: "system",
          });

          await Promise.all(
            data.delegations.map((d: { agentId: string; task: string }) =>
              sendToAgent(d.task, d.agentId)
            )
          );
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        addMessage({
          id: createId(),
          agentId: "komutan",
          content: `[Hata: ${errorMsg}]`,
          timestamp: Date.now(),
          type: "response",
        });
        setAgentStatus("komutan", "ready");
      } finally {
        setStreaming(false);
      }
    },
    [addMessage, setStreaming, completeTask, setAgentStatus, sendToAgent, settings]
  );

  // Direct message to specific agent (bypass CEO)
  const sendDirect = useCallback(
    async (prompt: string, agentId: string) => {
      addMessage({
        id: createId(),
        agentId: "user",
        content: prompt,
        timestamp: Date.now(),
        type: "task",
      });

      setStreaming(true);
      await sendToAgent(prompt, agentId);
      setStreaming(false);
    },
    [addMessage, setStreaming, sendToAgent]
  );

  return { sendToCEO, sendDirect };
}
