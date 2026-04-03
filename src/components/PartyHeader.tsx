"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";

export function PartyHeader() {
  const toggleSettings = useGameStore((s) => s.toggleSettings);
  const settings = useGameStore((s) => s.settings);

  const isConfigured =
    settings.provider === "cli" ||
    (settings.provider === "api" && settings.apiKey.length > 0);

  return (
    <motion.header
      className="flex items-center justify-between px-5 py-3 border-b border-[#1e293b] bg-[#080c16]/80 backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <span className="text-base">&#x2694;&#xfe0f;</span>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-[0.15em] text-emerald-400">
            AGENT PARTY
          </h1>
          <p className="text-[10px] text-[#475569]">
            Ekibini kur &middot; Gorev ver &middot; Onlari izle
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Provider badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono ${
          isConfigured
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            isConfigured ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
          }`} />
          {settings.provider === "cli" ? "CLI" : "API"}
          {isConfigured ? "" : " (ayar gerekli)"}
        </div>

        {/* Settings button */}
        <button
          onClick={toggleSettings}
          className="w-8 h-8 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:text-[#94a3b8] hover:border-[#334155] hover:bg-[#111827] transition-all"
          title="Ayarlar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}
