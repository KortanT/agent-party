"use client";

import { useState } from "react";
import { PartyHeader } from "@/components/PartyHeader";
import { AgentSidebar } from "@/components/AgentSidebar";
import { ChatArea } from "@/components/ChatArea";
import { TaskInput } from "@/components/TaskInput";
import { TargetSelector } from "@/components/TargetSelector";
import { QuickActions } from "@/components/QuickActions";
import { SettingsModal } from "@/components/SettingsModal";
import { useChat, useDiscussion } from "@/hooks/useChat";
import { useGameStore } from "@/lib/store";
import { QuickAction } from "@/lib/agents/types";

export default function Home() {
  const { sendMessage } = useChat();
  const { startDiscussion } = useDiscussion();
  const settings = useGameStore((s) => s.settings);
  const [showDiscussInput, setShowDiscussInput] = useState(false);

  const isConfigured =
    settings.provider === "cli" ||
    (settings.provider === "api" && settings.apiKey.length > 0);

  const handleSend = (message: string) => {
    if (!isConfigured) {
      useGameStore.getState().toggleSettings();
      return;
    }
    if (showDiscussInput) {
      setShowDiscussInput(false);
      startDiscussion(message);
    } else {
      sendMessage(message);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (!isConfigured) {
      useGameStore.getState().toggleSettings();
      return;
    }
    sendMessage(action.prompt);
  };

  const handleDiscuss = () => {
    setShowDiscussInput((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <PartyHeader />
      <div className="flex flex-1 overflow-hidden">
        <AgentSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <ChatArea />

          {/* Input area */}
          <div className="border-t border-[#1e293b] bg-[#080c16] p-4 space-y-2.5">
            <TargetSelector />

            {showDiscussInput && (
              <div className="flex items-center gap-2 text-[11px] text-purple-400 bg-purple-500/5 border border-purple-500/20 rounded-lg px-3 py-2">
                <span>&#x26a1;</span>
                <span className="flex-1">Tartisma konusu girin — tum agentlar sirayla tartisacak.</span>
                <button
                  onClick={() => setShowDiscussInput(false)}
                  className="text-[#475569] hover:text-white transition-colors"
                >
                  &#x2715;
                </button>
              </div>
            )}

            <TaskInput onSend={handleSend} />
            <QuickActions onAction={handleQuickAction} onDiscuss={handleDiscuss} />

            {!isConfigured && (
              <button
                onClick={() => useGameStore.getState().toggleSettings()}
                className="w-full text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2 hover:bg-amber-500/10 transition-all text-left"
              >
                &#x26a0; Henuz yapilandirilmadi — tikla ve API key gir veya CLI modunu sec.
              </button>
            )}
          </div>
        </main>
      </div>
      <SettingsModal />
    </div>
  );
}
