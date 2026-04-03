"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";

export function TargetSelector() {
  const { agents, selectedAgentId, selectAgent } = useGameStore();

  const items = [
    { id: "all" as const, emoji: "\ud83c\udf0d", label: "Tumu" },
    ...agents.map((a) => ({ id: a.id, emoji: a.emoji, label: a.name })),
  ];

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-[#475569] font-medium mr-1">Gonder</span>
      {items.map((item) => {
        const isActive = selectedAgentId === item.id;
        const agent = agents.find((a) => a.id === item.id);
        const color = agent?.color || "#34d399";

        return (
          <motion.button
            key={item.id}
            onClick={() => selectAgent(item.id)}
            className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
              isActive
                ? "text-white font-medium"
                : "border-[#1e293b] text-[#475569] hover:text-[#94a3b8] hover:border-[#334155]"
            }`}
            style={isActive ? {
              backgroundColor: color + "18",
              borderColor: color + "40",
              color: color,
            } : undefined}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="text-xs">{item.emoji}</span>
            <span>{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
