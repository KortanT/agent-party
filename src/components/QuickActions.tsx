"use client";

import { QuickAction } from "@/lib/agents/types";

const quickActions: QuickAction[] = [
  { id: "suggest", label: "Oneri", emoji: "\ud83d\udca1", prompt: "Bu konuda bir onerin var mi? Kisa ve oz tut." },
  { id: "debug", label: "Debug", emoji: "\ud83d\udc1b", prompt: "Bu kodu incele ve potansiyel buglari bul:" },
  { id: "introduce", label: "Tanit", emoji: "\ud83d\udc4b", prompt: "Kendini tanitir misin? Kim sin, ne yapiyorsun?" },
  { id: "mood", label: "Ruh hali", emoji: "\ud83c\udfad", prompt: "Su anki ruh halini paylasir misin?" },
  { id: "discuss", label: "Tartis", emoji: "\u26a1", prompt: "" },
];

interface QuickActionsProps {
  onAction: (action: QuickAction) => void;
  onDiscuss: () => void;
}

export function QuickActions({ onAction, onDiscuss }: QuickActionsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() =>
            action.id === "discuss" ? onDiscuss() : onAction(action)
          }
          className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
            action.id === "discuss"
              ? "border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50"
              : "border-[#1e293b] text-[#475569] hover:text-[#94a3b8] hover:border-[#334155] hover:bg-[#111827]"
          }`}
        >
          <span>{action.emoji}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
