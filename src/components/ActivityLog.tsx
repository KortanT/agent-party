"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";

export function ActivityLog() {
  const messages = useGameStore((s) => s.messages);
  const agents = useGameStore((s) => s.agents);
  const clearMessages = useGameStore((s) => s.clearMessages);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  const getAgent = (id: string) => agents.find((a) => a.id === id);

  return (
    <motion.div
      className="absolute right-0 top-0 bottom-0 z-10 flex flex-col"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      style={{ width: collapsed ? 36 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -left-7 top-3 w-6 h-12 bg-[#111827] border border-[#1e293b] border-r-0 rounded-l-lg flex items-center justify-center text-[#475569] hover:text-[#94a3b8] transition-all z-20"
        title={collapsed ? "Log Ac" : "Log Kapat"}
      >
        <span className="text-[9px]">{collapsed ? "\u25C0" : "\u25B6"}</span>
      </button>

      {collapsed ? (
        /* Collapsed: just a thin bar with message count */
        <div className="w-9 h-full bg-[#0a0e17]/80 border-l border-[#1e293b] flex flex-col items-center pt-3">
          <div className="text-[8px] text-[#475569] writing-mode-vertical">
            {messages.length}
          </div>
        </div>
      ) : (
        /* Expanded: compact activity log */
        <div className="w-[260px] h-full bg-[#0a0e17]/90 backdrop-blur-sm border-l border-[#1e293b] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e293b]/50 shrink-0">
            <span className="text-[9px] font-bold tracking-widest text-[#475569] uppercase">
              Aktivite Log
            </span>
            <button
              onClick={clearMessages}
              className="text-[8px] text-[#334155] hover:text-red-400 transition-colors"
            >
              Temizle
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1">
            {messages.map((msg) => {
              const agent = getAgent(msg.agentId);
              const isExpanded = selectedMsg === msg.id;

              if (msg.agentId === "system") {
                return (
                  <div key={msg.id} className="text-[8px] text-[#334155] text-center py-0.5 italic">
                    {msg.content}
                  </div>
                );
              }

              if (msg.agentId === "user") {
                return (
                  <div
                    key={msg.id}
                    className="flex items-start gap-1.5 py-1 cursor-pointer hover:bg-[#111827]/50 rounded px-1"
                    onClick={() => setSelectedMsg(isExpanded ? null : msg.id)}
                  >
                    <span className="text-[9px] shrink-0">&#x1f464;</span>
                    <div className="min-w-0">
                      <span className="text-[8px] text-blue-400 font-bold">SEN</span>
                      <p className={`text-[9px] text-[#94a3b8] leading-tight ${isExpanded ? "" : "line-clamp-2"}`}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-1.5 py-1 cursor-pointer hover:bg-[#111827]/50 rounded px-1"
                  onClick={() => setSelectedMsg(isExpanded ? null : msg.id)}
                >
                  <span className="text-[9px] shrink-0">{agent?.emoji || "?"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span
                        className="text-[8px] font-bold"
                        style={{ color: agent?.color || "#94a3b8" }}
                      >
                        {agent?.name || msg.agentId}
                      </span>
                      {msg.type === "delegation" && (
                        <span className="text-[7px] text-[#fbbf24] bg-[#fbbf24]/10 px-1 rounded">plan</span>
                      )}
                    </div>
                    <p className={`text-[9px] text-[#94a3b8] leading-tight ${isExpanded ? "" : "line-clamp-2"}`}>
                      {msg.content || (
                        <span className="flex items-center gap-0.5 text-[#334155]">
                          <span className="dot-1 inline-block w-1 h-1 rounded-full bg-current" />
                          <span className="dot-2 inline-block w-1 h-1 rounded-full bg-current" />
                          <span className="dot-3 inline-block w-1 h-1 rounded-full bg-current" />
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
