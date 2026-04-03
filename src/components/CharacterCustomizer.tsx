"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { CharacterAvatar } from "./characters/CharacterAvatar";
import { CharacterAppearance } from "@/lib/agents/types";

const EYE_OPTIONS: { value: CharacterAppearance["eyeStyle"]; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "happy", label: "Mutlu" },
  { value: "angry", label: "Kizgin" },
  { value: "cool", label: "Cool" },
  { value: "sleepy", label: "Uykulu" },
];

const ACCESSORY_OPTIONS: { value: CharacterAppearance["accessory"]; label: string; emoji: string }[] = [
  { value: "none", label: "Yok", emoji: "" },
  { value: "crown", label: "Tac", emoji: "\ud83d\udc51" },
  { value: "wizard-hat", label: "Buyucu", emoji: "\ud83e\uddd9" },
  { value: "helmet", label: "Kask", emoji: "\u26d1\ufe0f" },
  { value: "bow", label: "Fiyonk", emoji: "\ud83c\udf80" },
  { value: "crystal", label: "Kristal", emoji: "\ud83d\udd2e" },
  { value: "headset", label: "Kulaklik", emoji: "\ud83c\udfa7" },
];

const OUTFIT_OPTIONS: { value: CharacterAppearance["outfit"]; label: string }[] = [
  { value: "suit", label: "Takim Elbise" },
  { value: "robe", label: "Cüppe" },
  { value: "armor", label: "Zirh" },
  { value: "dress", label: "Elbise" },
  { value: "hoodie", label: "Hoodie" },
  { value: "lab-coat", label: "Lab Onlugu" },
];

const COLOR_PALETTE = [
  "#4ade80", "#60a5fa", "#fb923c", "#c084fc", "#f87171",
  "#fbbf24", "#34d399", "#a78bfa", "#f472b6", "#38bdf8",
  "#818cf8", "#fb7185", "#2dd4bf", "#e879f9", "#facc15",
];

export function CharacterCustomizer() {
  const { agents, showCustomizer, customizerAgentId, closeCustomizer, updateAgentName, updateAgentAppearance, randomizeAppearance } = useGameStore();
  const agent = agents.find((a) => a.id === customizerAgentId);
  const [nameInput, setNameInput] = useState("");

  if (!agent) return null;

  const handleNameSave = () => {
    if (nameInput.trim()) {
      updateAgentName(agent.id, nameInput.trim());
      setNameInput("");
    }
  };

  return (
    <AnimatePresence>
      {showCustomizer && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCustomizer}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] shrink-0">
                <h2 className="text-sm font-bold">Karakter Duzenle</h2>
                <button
                  onClick={closeCustomizer}
                  className="w-7 h-7 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:text-white transition-all"
                >
                  &#x2715;
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Preview */}
                <div className="flex flex-col items-center">
                  <div className="bg-[#111827] rounded-2xl p-6 border border-[#1e293b]">
                    <CharacterAvatar
                      appearance={agent.appearance}
                      color={agent.color}
                      size={120}
                    />
                  </div>
                  <span className="text-xs font-bold mt-2" style={{ color: agent.color }}>
                    {agent.name}
                  </span>

                  {/* Randomize button */}
                  <button
                    onClick={() => randomizeAppearance(agent.id)}
                    className="mt-3 px-4 py-1.5 rounded-lg border border-[#1e293b] text-[11px] text-[#94a3b8] hover:bg-[#111827] hover:border-[#334155] transition-all"
                  >
                    &#x1f3b2; Rastgele
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">Isim</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                      placeholder={agent.name}
                      className="flex-1 bg-[#111827] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-[#e2e8f0] placeholder:text-[#334155] focus:outline-none focus:border-[#334155]"
                    />
                    <button onClick={handleNameSave} className="px-3 py-2 bg-[#1e293b] rounded-xl text-xs text-[#94a3b8] hover:bg-[#334155] transition-all">
                      Kaydet
                    </button>
                  </div>
                </div>

                {/* Body Color */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">Renk</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateAgentAppearance(agent.id, { bodyColor: c })}
                        className={`w-7 h-7 rounded-lg border-2 transition-all ${
                          agent.appearance.bodyColor === c ? "border-white scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Eyes */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">Gozler</label>
                  <div className="flex flex-wrap gap-1.5">
                    {EYE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateAgentAppearance(agent.id, { eyeStyle: opt.value })}
                        className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                          agent.appearance.eyeStyle === opt.value
                            ? "bg-[#1e293b] border-[#334155] text-white"
                            : "border-[#1e293b] text-[#475569] hover:text-[#94a3b8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accessory */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">Aksesuar</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ACCESSORY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateAgentAppearance(agent.id, { accessory: opt.value })}
                        className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                          agent.appearance.accessory === opt.value
                            ? "bg-[#1e293b] border-[#334155] text-white"
                            : "border-[#1e293b] text-[#475569] hover:text-[#94a3b8]"
                        }`}
                      >
                        {opt.emoji} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">Kiyafet</label>
                  <div className="flex flex-wrap gap-1.5">
                    {OUTFIT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateAgentAppearance(agent.id, { outfit: opt.value })}
                        className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                          agent.appearance.outfit === opt.value
                            ? "bg-[#1e293b] border-[#334155] text-white"
                            : "border-[#1e293b] text-[#475569] hover:text-[#94a3b8]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#1e293b] shrink-0">
                <button
                  onClick={closeCustomizer}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold tracking-wider text-white transition-all"
                >
                  TAMAM
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
