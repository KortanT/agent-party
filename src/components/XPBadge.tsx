"use client";

import { getLevelProgress } from "@/lib/rpg/levels";

interface XPBadgeProps {
  xp: number;
  level: number;
}

export function XPBadge({ xp, level }: XPBadgeProps) {
  const progress = getLevelProgress(xp, level);

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[9px] font-mono text-[#475569] w-5 shrink-0">XP</span>
      <div className="flex-1 h-[5px] bg-[#0b0f1a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-500/60 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[9px] font-mono text-[#475569] w-6 text-right">{xp}</span>
    </div>
  );
}
