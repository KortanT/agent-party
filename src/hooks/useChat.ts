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
    setAgentWorking,
    setAgentDone,
    setAgentStreaming,
    sendIdleToWaiting,
  } = useGameStore();

  const sendToAgent = useCallback(
    async (prompt: string, agentId: string) => {
      const msgId = createId();

      // 1. Agent moves to desk and starts working
      setAgentWorking(agentId, prompt.slice(0, 80));

      // 2. Add placeholder message
      addMessage({
        id: msgId,
        agentId,
        content: "",
        timestamp: Date.now(),
        type: "response",
      });

      // 3. Start streaming
      setAgentStreaming(agentId, true);

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
          // Real-time update — UI sees every chunk
          updateMessage(msgId, fullContent);
        }

        // 4. Task complete — XP/HP/Level updates + notifications
        const estimatedTokens = Math.ceil(fullContent.length / 4) + 200;
        setAgentStreaming(agentId, false);
        completeTask(agentId, estimatedTokens);

        // 5. Brief celebration, then back to ready
        setTimeout(() => {
          setAgentDone(agentId);
        }, 2000);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        updateMessage(msgId, `[Hata: ${errorMsg}]`);
        setAgentStreaming(agentId, false);
        setAgentDone(agentId);
      }
    },
    [addMessage, updateMessage, completeTask, setAgentWorking, setAgentDone, setAgentStreaming, settings]
  );

  // CEO delegation flow
  const sendToCEO = useCallback(
    async (prompt: string) => {
      // 1. User message
      addMessage({
        id: createId(),
        agentId: "user",
        content: prompt,
        timestamp: Date.now(),
        type: "task",
      });

      setStreaming(true);

      // 2. CEO starts analyzing
      setAgentWorking("komutan", "Gorevi analiz ediyor...");

      try {
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

        // 3. CEO announces plan
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

        setTimeout(() => setAgentDone("komutan"), 1500);

        // 4. Delegate to agents
        if (data.delegations?.length > 0) {
          const activeIds = data.delegations.map((d: { agentId: string }) => d.agentId);

          // System announcement
          const agentNames = data.delegations
            .map((d: { agentId: string }) => {
              const a = useGameStore.getState().agents.find((ag) => ag.id === d.agentId);
              return a?.name || d.agentId;
            })
            .join(", ");

          addMessage({
            id: createId(),
            agentId: "system",
            content: `Komutan gorev dagitti: ${agentNames}`,
            timestamp: Date.now(),
            type: "system",
          });

          // Move idle agents to waiting room
          sendIdleToWaiting(["komutan", ...activeIds]);

          // Run agents in parallel — each one walks to desk, works, streams
          await Promise.all(
            data.delegations.map((d: { agentId: string; task: string }) =>
              sendToAgent(d.task, d.agentId)
            )
          );

          // 5. CEO gives final summary report
          setAgentWorking("komutan", "Rapor hazirlaniyor...");
          try {
            const summaryRes = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                prompt: `Ekibin az once su gorev uzerinde calisti: "${prompt}"

Her ajanin verdigi cevaplari gorebiliyorsun. Simdi CEO olarak kisa bir durum raporu ver:
- Kim ne yapti (1 cumle per ajan)
- Sonuc/ozet (1-2 cumle)
- Sonraki adim onerisi (varsa)

Kisa tut, 3-5 cumle yeterli.`,
                agentId: "komutan",
                provider: settings.provider,
                apiKey: settings.apiKey,
                model: settings.model,
              }),
            });

            if (summaryRes.ok) {
              const reader = summaryRes.body?.getReader();
              if (reader) {
                const summaryMsgId = createId();
                addMessage({
                  id: summaryMsgId,
                  agentId: "komutan",
                  content: "",
                  timestamp: Date.now(),
                  type: "response",
                });
                setAgentStreaming("komutan", true);

                const decoder = new TextDecoder();
                let summaryContent = "";
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  summaryContent += decoder.decode(value, { stream: true });
                  updateMessage(summaryMsgId, summaryContent);
                }
                setAgentStreaming("komutan", false);
              }
            }
          } catch {
            // Summary is optional — don't block on failure
          }
          setAgentDone("komutan");

          // Recall all agents back to desks
          useGameStore.getState().recallAllToDesks();
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
        setAgentDone("komutan");
      } finally {
        setStreaming(false);
      }
    },
    [addMessage, setStreaming, completeTask, setAgentWorking, setAgentDone, sendIdleToWaiting, sendToAgent, settings]
  );

  return { sendToCEO, sendToAgent };
}
