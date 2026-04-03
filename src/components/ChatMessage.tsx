"use client";

import { motion } from "framer-motion";
import { ChatMessage as ChatMessageType } from "@/lib/agents/types";
import { useGameStore } from "@/lib/store";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const agents = useGameStore((s) => s.agents);

  // System message
  if (message.agentId === "system") {
    return (
      <motion.div
        className="flex justify-center my-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-[10px] text-[#475569] bg-[#111827] border border-[#1e293b] rounded-full px-4 py-1.5 font-medium">
          {message.content}
        </div>
      </motion.div>
    );
  }

  // User message
  if (message.agentId === "user") {
    return (
      <motion.div
        className="flex justify-end mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-[75%]">
          <div className="flex items-center justify-end gap-2 mb-1.5">
            <span className="text-[10px] font-medium text-[#475569]">Sen</span>
            <div className="w-6 h-6 rounded-md bg-[#1e293b] flex items-center justify-center text-xs">
              &#x1f464;
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#1a2f4a] rounded-2xl rounded-tr-md px-4 py-2.5 border border-blue-500/10">
            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Agent message
  const agent = agents.find((a) => a.id === message.agentId);
  if (!agent) return null;

  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-[80%]">
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
            style={{ backgroundColor: agent.color + "18" }}
          >
            {agent.emoji}
          </div>
          <span
            className="text-[10px] font-bold tracking-[0.12em]"
            style={{ color: agent.color }}
          >
            {agent.name}
          </span>
          {message.type === "discussion" && (
            <span className="text-[9px] text-[#475569] bg-[#111827] px-1.5 py-0.5 rounded">
              tartisma
            </span>
          )}
        </div>
        <div
          className="rounded-2xl rounded-tl-md px-4 py-2.5 border"
          style={{
            backgroundColor: agent.color + "08",
            borderColor: agent.color + "15",
          }}
        >
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-[#cbd5e1]">
            {message.content || (
              <span className="flex items-center gap-1 text-[#475569]">
                <span className="dot-1 inline-block w-1 h-1 rounded-full bg-current" />
                <span className="dot-2 inline-block w-1 h-1 rounded-full bg-current" />
                <span className="dot-3 inline-block w-1 h-1 rounded-full bg-current" />
              </span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
