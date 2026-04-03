"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VirtualWorld } from "@/components/VirtualWorld";
import { ChatMessage } from "@/components/ChatMessage";
import { SettingsModal } from "@/components/SettingsModal";
import { ProjectPicker } from "@/components/ProjectPicker";
import { CharacterCustomizer } from "@/components/CharacterCustomizer";
import { Onboarding } from "@/components/Onboarding";
import { useChat } from "@/hooks/useChat";
import { useGameStore } from "@/lib/store";

export default function Home() {
  const { sendToCEO } = useChat();
  const settings = useGameStore((s) => s.settings);

  // Show onboarding if no project selected
  const needsOnboarding = !settings.currentProjectPath;
  if (needsOnboarding) {
    return (
      <>
        <Onboarding />
        <SettingsModal />
      </>
    );
  }
  const messages = useGameStore((s) => s.messages);
  const isStreaming = useGameStore((s) => s.isStreaming);
  const toggleSettings = useGameStore((s) => s.toggleSettings);
  const toggleProjectPicker = useGameStore((s) => s.toggleProjectPicker);
  const clearMessages = useGameStore((s) => s.clearMessages);
  const [input, setInput] = useState("");
  const [showLog, setShowLog] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const isConfigured =
    settings.provider === "cli" ||
    (settings.provider === "api" && settings.apiKey.length > 0);

  const handleSend = () => {
    const prompt = input.trim();
    if (!prompt || isStreaming) return;
    if (!isConfigured) {
      toggleSettings();
      return;
    }
    setInput("");
    setShowLog(true);
    sendToCEO(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const projectName = settings.currentProjectPath
    ? settings.currentProjectPath.split("/").filter(Boolean).pop()
    : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#06080f]">
      {/* Top bar */}
      <header className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1e293b] bg-[#080c16]/90 backdrop-blur-sm z-10 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <span className="text-sm">&#x2694;&#xfe0f;</span>
          </div>
          <span className="text-xs font-bold tracking-[0.15em] text-emerald-400 hidden sm:inline">AGENT PARTY</span>
        </div>

        {/* Prompt input */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isConfigured ? "Komutan'a gorev ver..." : "Once ayarlari yapilandir..."}
              disabled={isStreaming}
              className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2 text-[13px] text-[#e2e8f0] placeholder:text-[#334155] focus:outline-none focus:border-[#334155] focus:bg-[#0f172a] disabled:opacity-40 transition-all"
            />
            {isStreaming && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5">
                <span className="dot-1 inline-block w-1 h-1 rounded-full bg-emerald-400" />
                <span className="dot-2 inline-block w-1 h-1 rounded-full bg-emerald-400" />
                <span className="dot-3 inline-block w-1 h-1 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="h-[36px] px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-[11px] font-bold tracking-wider text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all shrink-0"
          >
            GONDER
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Project badge */}
          <button
            onClick={toggleProjectPicker}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#1e293b] text-[10px] text-[#475569] hover:text-[#94a3b8] hover:border-[#334155] transition-all"
            title="Proje sec"
          >
            <span>&#x1f4c1;</span>
            <span className="max-w-[80px] truncate">{projectName || "Proje sec"}</span>
          </button>

          {/* Provider badge */}
          <button
            onClick={toggleSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono transition-all ${
              isConfigured
                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 animate-pulse"
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${isConfigured ? "bg-emerald-400" : "bg-amber-400"}`} />
            {settings.provider === "cli" ? "CLI" : "API"}
          </button>

          {/* Settings gear */}
          <button
            onClick={toggleSettings}
            className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:text-[#94a3b8] hover:border-[#334155] transition-all"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Virtual World */}
        <VirtualWorld />

        {/* Chat log overlay */}
        <AnimatePresence>
          {showLog && messages.length > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#06080f] via-[#06080fee] to-transparent pointer-events-none"
              style={{ height: "45%" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="absolute inset-0 overflow-y-auto pointer-events-auto pt-12 px-4 pb-2">
                {/* Toggle button */}
                <div className="sticky top-0 z-10 flex justify-center mb-2">
                  <button
                    onClick={() => setShowLog(false)}
                    className="text-[10px] text-[#475569] bg-[#111827] border border-[#1e293b] rounded-full px-3 py-1 hover:text-[#94a3b8] transition-all"
                  >
                    &#x25BC; Gizle
                  </button>
                </div>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={logEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show log button when hidden */}
        {!showLog && messages.length > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            <button
              onClick={() => setShowLog(true)}
              className="text-[10px] text-[#475569] bg-[#111827] border border-[#1e293b] rounded-full px-4 py-1.5 hover:text-[#94a3b8] hover:border-[#334155] transition-all"
            >
              &#x25B2; Sohbet ({messages.length})
            </button>
            <button
              onClick={clearMessages}
              className="text-[10px] text-[#475569] bg-[#111827] border border-[#1e293b] rounded-full px-3 py-1.5 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
              &#x2715;
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <SettingsModal />
      <ProjectPicker />
      <CharacterCustomizer />
    </div>
  );
}
