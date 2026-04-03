"use client";

import { motion } from "framer-motion";

interface HPBarProps {
  hp: number;
  maxHp: number;
  color: string;
}

export function HPBar({ hp, maxHp, color }: HPBarProps) {
  const pct = (hp / maxHp) * 100;
  const isCritical = pct < 20;
  const barColor = isCritical ? "#f87171" : color;

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[9px] font-mono text-[#475569] w-5 shrink-0">HP</span>
      <div className="flex-1 h-[5px] bg-[#0b0f1a] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isCritical ? "hp-critical" : ""}`}
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className={`text-[9px] font-mono w-6 text-right ${isCritical ? "text-red-400" : "text-[#475569]"}`}>
        {hp}
      </span>
    </div>
  );
}
