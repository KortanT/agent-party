"use client";

import { useGameStore } from "@/lib/store";
import { CharacterAvatar } from "./characters/CharacterAvatar";
import { SpeechBubble } from "./SpeechBubble";
import { WorldBackground } from "./WorldBackground";
import { Agent, AnimationState } from "@/lib/agents/types";
import { motion } from "framer-motion";

function getAnimState(agent: Agent, hasRecentMessage: boolean): AnimationState {
  if (agent.status === "working") return "coding";
  if (agent.status === "leveled_up") return "celebrating";
  if (hasRecentMessage) return "thinking";
  if (agent.status === "tired") return "idle";
  // Random idle vs walking for variety
  return "idle";
}

interface AgentInWorldProps {
  agent: Agent;
  latestMessage?: string;
  onClick: () => void;
}

function AgentInWorld({ agent, latestMessage, onClick }: AgentInWorldProps) {
  const animState = getAnimState(agent, !!latestMessage);

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
          animState={animState}
        />

        {/* Status indicator */}
        {agent.status === "working" && (
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

        {/* Animation state label */}
        <span className="text-[7px] text-[#334155] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {animState === "coding" && "Kodluyor..."}
          {animState === "thinking" && "Dusunuyor..."}
          {animState === "celebrating" && "Kutluyor!"}
          {animState === "idle" && "Hazir"}
        </span>
      </div>
    </motion.div>
  );
}

export function VirtualWorld() {
  const agents = useGameStore((s) => s.agents);
  const messages = useGameStore((s) => s.messages);

  // Get latest message per agent (within last 30 seconds)
  const now = Date.now();
  const recentMessages: Record<string, string> = {};
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (now - msg.timestamp > 30000) break;
    if (msg.agentId !== "user" && msg.agentId !== "system" && !recentMessages[msg.agentId]) {
      recentMessages[msg.agentId] = msg.content;
    }
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Beautiful background */}
      <WorldBackground />

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
          <p className="text-[11px] text-[#334155] bg-[#0a0e17]/80 rounded-full px-4 py-2 backdrop-blur-sm border border-[#1e293b]/50">
            &#x2b50; Yukaridaki bara prompt gir — Komutan ekibine gorev dagitacak
          </p>
        </div>
      )}
    </div>
  );
}
