"use client";

import { useGameStore } from "@/lib/store";
import { AgentCard } from "./AgentCard";

export function AgentSidebar() {
  const { agents, selectedAgentId, selectAgent, clearMessages } = useGameStore();

  return (
    <aside className="w-[300px] min-w-[300px] border-r border-[#1e293b] bg-[#080c16] flex flex-col h-full">
      {/* Section header */}
      <div className="px-4 py-3 border-b border-[#1e293b]">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-[#475569] uppercase">
            Ekibin
          </h2>
          <span className="text-[10px] text-[#334155] font-mono">
            {agents.length} ajan
          </span>
        </div>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedAgentId === agent.id}
            onClick={() => selectAgent(agent.id)}
          />
        ))}
      </div>

      {/* Bottom action */}
      <div className="p-3 border-t border-[#1e293b]">
        <button
          onClick={clearMessages}
          className="w-full py-2 rounded-lg text-[11px] font-medium text-[#475569] hover:text-[#94a3b8] hover:bg-[#111827] border border-[#1e293b] transition-all"
        >
          Sohbeti Temizle
        </button>
      </div>
    </aside>
  );
}
