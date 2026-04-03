"use client";

import { motion } from "framer-motion";
import { Agent } from "@/lib/agents/types";
import { HPBar } from "./HPBar";
import { XPBadge } from "./XPBadge";
import { LEVEL_TITLES } from "@/lib/rpg/levels";

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig: Record<Agent["status"], { label: string; dot: string }> = {
  ready: { label: "HAZIR", dot: "bg-emerald-400" },
  working: { label: "CALISIYOR", dot: "bg-amber-400 animate-pulse" },
  tired: { label: "YORGUN", dot: "bg-red-400" },
  leveled_up: { label: "LVL UP!", dot: "bg-purple-400 animate-pulse" },
};

export function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  const status = statusConfig[agent.status];
  const levelTitle = LEVEL_TITLES[agent.stats.level] || "Bilinmeyen";

  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group relative overflow-hidden ${
        isSelected
          ? "border-opacity-60 bg-opacity-20"
          : "border-[#1e293b] bg-[#111827] hover:bg-[#151d2e]"
      }`}
      style={{
        borderColor: isSelected ? agent.color + "60" : undefined,
        backgroundColor: isSelected ? agent.color + "10" : undefined,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Subtle shimmer on selected */}
      {isSelected && <div className="absolute inset-0 shimmer pointer-events-none" />}

      {/* Header row */}
      <div className="flex items-start justify-between mb-2.5 relative">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: agent.color + "15" }}
          >
            {agent.emoji}
          </div>
          <div>
            <div
              className="text-[10px] font-bold tracking-[0.15em] leading-none"
              style={{ color: agent.color }}
            >
              {agent.name}
            </div>
            <div className="text-xs text-[#94a3b8] mt-0.5">{agent.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span className="text-[9px] font-medium text-[#475569]">{status.label}</span>
        </div>
      </div>

      {/* Skills + Level */}
      <div className="flex items-center gap-1.5 mb-2.5">
        {agent.skills.map((skill) => (
          <span
            key={skill}
            className="text-[9px] px-1.5 py-[2px] rounded-md font-medium"
            style={{
              backgroundColor: agent.color + "12",
              color: agent.color + "cc",
            }}
          >
            {skill}
          </span>
        ))}
        <span className="text-[9px] text-[#475569] ml-auto font-mono">
          Lv.{agent.stats.level} {levelTitle}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-1">
        <HPBar hp={agent.stats.hp} maxHp={agent.stats.maxHp} color={agent.color} />
        <XPBadge xp={agent.stats.xp} level={agent.stats.level} />
      </div>
    </motion.button>
  );
}
