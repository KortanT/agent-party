"use client";

import { useGameStore } from "@/lib/store";
import { CharacterAvatar } from "./characters/CharacterAvatar";
import { SpeechBubble } from "./SpeechBubble";
import { Agent } from "@/lib/agents/types";
import { motion } from "framer-motion";

interface AgentInWorldProps {
  agent: Agent;
  latestMessage?: string;
  onClick: () => void;
}

function AgentInWorld({ agent, latestMessage, onClick }: AgentInWorldProps) {
  const isWorking = agent.status === "working";

  return (
    <motion.div
      className="absolute flex flex-col items-center cursor-pointer group"
      style={{
        left: `${agent.worldPosition.x}%`,
        top: `${agent.worldPosition.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: Math.random() * 0.3 }}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
    >
      {/* Speech bubble */}
      <SpeechBubble
        message={latestMessage || ""}
        color={agent.color}
        visible={!!latestMessage}
      />

      {/* Character */}
      <div className="relative">
        <CharacterAvatar
          appearance={agent.appearance}
          color={agent.color}
          size={agent.role === "ceo" ? 90 : 75}
          isWorking={isWorking}
        />

        {/* Working indicator */}
        {isWorking && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
            style={{ backgroundColor: agent.color }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Name tag */}
      <div className="mt-1 flex flex-col items-center">
        <span
          className="text-[10px] font-bold tracking-wider"
          style={{ color: agent.color }}
        >
          {agent.name}
        </span>
        <span className="text-[8px] text-[#475569]">{agent.title}</span>

        {/* HP mini bar */}
        <div className="w-12 h-[3px] bg-[#1e293b] rounded-full mt-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(agent.stats.hp / agent.stats.maxHp) * 100}%`,
              backgroundColor: agent.stats.hp < 20 ? "#f87171" : agent.color,
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function VirtualWorld() {
  const agents = useGameStore((s) => s.agents);
  const messages = useGameStore((s) => s.messages);

  // Get latest message per agent (within last 60 seconds)
  const now = Date.now();
  const recentMessages: Record<string, string> = {};
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (now - msg.timestamp > 60000) break;
    if (msg.agentId !== "user" && msg.agentId !== "system" && !recentMessages[msg.agentId]) {
      recentMessages[msg.agentId] = msg.content;
    }
  }

  return (
    <div className="flex-1 relative bg-grid overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Desk for CEO */}
        <div
          className="absolute w-28 h-10 rounded-lg border border-[#1e293b]"
          style={{
            left: "50%",
            top: "28%",
            transform: "translate(-50%, 0)",
            background: "linear-gradient(180deg, #1a2035 0%, #111827 100%)",
          }}
        />

        {/* Work stations for agents */}
        {agents.filter(a => a.role !== "ceo").map((agent) => (
          <div
            key={agent.id + "-desk"}
            className="absolute w-16 h-6 rounded border border-[#1e293b]/50"
            style={{
              left: `${agent.worldPosition.x}%`,
              top: `${agent.worldPosition.y + 12}%`,
              transform: "translate(-50%, 0)",
              background: `linear-gradient(180deg, ${agent.color}08 0%, ${agent.color}04 100%)`,
            }}
          />
        ))}

        {/* Connection lines from CEO to agents */}
        <svg className="absolute inset-0 w-full h-full">
          {agents.filter(a => a.role !== "ceo").map((agent) => {
            const ceo = agents.find(a => a.role === "ceo");
            if (!ceo) return null;
            return (
              <line
                key={agent.id + "-line"}
                x1={`${ceo.worldPosition.x}%`}
                y1={`${ceo.worldPosition.y + 8}%`}
                x2={`${agent.worldPosition.x}%`}
                y2={`${agent.worldPosition.y - 8}%`}
                stroke={agent.color}
                strokeWidth={0.5}
                strokeDasharray="4,4"
                opacity={0.15}
              />
            );
          })}
        </svg>
      </div>

      {/* Agent characters */}
      {agents.map((agent) => (
        <AgentInWorld
          key={agent.id}
          agent={agent}
          latestMessage={recentMessages[agent.id]}
          onClick={() => useGameStore.getState().openCustomizer(agent.id)}
        />
      ))}

      {/* Empty state hint */}
      {messages.length === 0 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center animate-fade-up">
          <p className="text-xs text-[#334155]">
            Yukaridaki bara prompt gir — Komutan ekibine gorev dagitacak
          </p>
        </div>
      )}
    </div>
  );
}
