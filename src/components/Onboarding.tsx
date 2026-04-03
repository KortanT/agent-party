"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { CharacterAvatar } from "./characters/CharacterAvatar";
import { defaultAgents } from "@/lib/agents/registry";

// Pre-compute particle positions to avoid SSR/client mismatch
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5 + 3) % 100}%`,
  top: `${(i * 7 + 10) % 90}%`,
  duration: 3 + (i % 4),
  delay: (i % 5) * 0.4,
}));

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [projectPath, setProjectPath] = useState("");
  const { addProject, updateSettings, toggleSettings } = useGameStore();
  const settings = useGameStore((s) => s.settings);

  const isConfigured =
    settings.provider === "cli" ||
    (settings.provider === "api" && settings.apiKey.length > 0);

  const handleAddProject = (path: string) => {
    const trimmed = path.trim();
    if (!trimmed) return;
    const name = trimmed.split("/").filter(Boolean).pop() || trimmed;
    addProject({
      id: Date.now().toString(36),
      name,
      path: trimmed,
      lastOpened: Date.now(),
    });
  };

  const handleBrowseFolder = async () => {
    try {
      // Chrome File System Access API
      const dirHandle = await (window as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
      // We get the folder name but not the full path from the API
      // Use the name as a display-friendly identifier
      const folderName = dirHandle.name;
      setProjectPath(folderName);
      handleAddProject(folderName);
    } catch {
      // User cancelled or API not supported — silently ignore
    }
  };

  const hasFolderPicker = useMemo(() => {
    if (typeof window === "undefined") return false;
    return "showDirectoryPicker" in window;
  }, []);

  const handleSkipProject = () => {
    updateSettings({ currentProjectPath: "__skipped__" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080f] flex items-center justify-center overflow-hidden">
      {/* Deterministic animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400"
            style={{ left: p.left, top: p.top }}
            animate={{ y: [0, -30, 0], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Step 0: Welcome */}
        {step === 0 && (
          <motion.div
            key="step-0"
            className="text-center space-y-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div>
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                &#x2694;&#xfe0f;
              </motion.div>
              <h1 className="text-2xl font-bold text-emerald-400 tracking-[0.2em] mb-2">
                AGENT PARTY
              </h1>
              <p className="text-sm text-[#94a3b8]">
                AI takim arkadaslarin seninle taninmak icin sabirsizlaniyor
              </p>
            </div>

            <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6">
              <p className="text-xs text-[#475569] mb-4 leading-relaxed">
                Yazilim gelistirmeyi bir oyuna donusturuyoruz.
                Her biri farkli yeteneklere sahip AI ajanlarinla bir ekip kur,
                gorevler ver ve projelerini birlikte gelistir.
              </p>
              <div className="flex items-center justify-center gap-1">
                {defaultAgents.map((a, i) => (
                  <motion.div
                    key={a.id}
                    className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {a.emoji}
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold tracking-wider text-white transition-all active:scale-[0.98]"
            >
              BASLA &#x2192;
            </button>
          </motion.div>
        )}

        {/* Step 1: Meet the team */}
        {step === 1 && (
          <motion.div
            key="step-1"
            className="text-center space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <h2 className="text-lg font-bold mb-1">Ekibinle Tanis</h2>
              <p className="text-xs text-[#475569]">Her biri farkli yeteneklere sahip 5 ajan seni bekliyor</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {defaultAgents.map((agent, i) => (
                <motion.div
                  key={agent.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-2 mb-1.5">
                    <CharacterAvatar
                      appearance={agent.appearance}
                      color={agent.color}
                      size={56}
                      animState="idle"
                    />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: agent.color }}>
                    {agent.name}
                  </span>
                  <span className="text-[7px] text-[#475569] leading-tight text-center">
                    {agent.title}
                  </span>
                </motion.div>
              ))}
            </div>

            <p className="text-[11px] text-[#475569] bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-3">
              &#x1f451; <strong className="text-[#fbbf24]">Komutan</strong> gorevleri analiz eder ve dogru ajanlara delege eder.
              Sen sadece Komutan&apos;a soyle — o gerisini halleder.
            </p>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-sm font-bold tracking-wider text-white transition-all active:scale-[0.98]"
            >
              DEVAM &#x2192;
            </button>
          </motion.div>
        )}

        {/* Step 2: Select project */}
        {step === 2 && (
          <motion.div
            key="step-2"
            className="text-center space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <h2 className="text-lg font-bold mb-1">Projeni Sec</h2>
              <p className="text-xs text-[#475569]">Calisma klasorunu belirle ve maceraya basla</p>
            </div>

            {/* Provider setup */}
            {!isConfigured && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
                <p className="text-[11px] text-amber-400">
                  &#x26a0; Once AI saglayicisini ayarla
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSettings({ provider: "cli" })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.provider === "cli"
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "border-[#1e293b] hover:border-[#334155]"
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400">&#x1f4bb; Claude CLI</div>
                    <div className="text-[9px] text-[#475569]">Max plan, ucretsiz</div>
                  </button>
                  <button
                    onClick={toggleSettings}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      settings.provider === "api"
                        ? "bg-blue-500/10 border-blue-500/30"
                        : "border-[#1e293b] hover:border-[#334155]"
                    }`}
                  >
                    <div className="text-xs font-bold text-blue-400">&#x1f511; API Key</div>
                    <div className="text-[9px] text-[#475569]">Ayarlardan gir</div>
                  </button>
                </div>
              </div>
            )}

            {/* Project path input */}
            <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4 space-y-3">
              <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase block text-left">
                Proje Klasoru
              </label>

              {/* File picker button */}
              {hasFolderPicker && (
                <button
                  onClick={handleBrowseFolder}
                  className="w-full py-3 rounded-xl border-2 border-dashed border-[#1e293b] hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="text-lg mb-1 group-hover:scale-110 transition-transform">&#x1f4c2;</div>
                  <div className="text-xs text-[#475569] group-hover:text-[#94a3b8]">Klasor Sec</div>
                  <div className="text-[9px] text-[#334155]">Bilgisayarindan bir klasor secin</div>
                </button>
              )}

              {/* Manual path input */}
              <div>
                <div className="text-[9px] text-[#334155] mb-1.5 text-left">
                  {hasFolderPicker ? "veya yolu elle girin:" : "Proje yolunu girin:"}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={projectPath}
                    onChange={(e) => setProjectPath(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddProject(projectPath)}
                    placeholder="/Users/you/projects/my-app"
                    className="flex-1 bg-[#0a0e17] border border-[#1e293b] rounded-lg px-3 py-2.5 text-xs text-[#e2e8f0] font-mono placeholder:text-[#334155] focus:outline-none focus:border-[#334155]"
                  />
                  <button
                    onClick={() => handleAddProject(projectPath)}
                    disabled={!projectPath.trim()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white disabled:opacity-30 transition-all"
                  >
                    Basla
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSkipProject}
              className="text-[11px] text-[#475569] hover:text-[#94a3b8] transition-colors"
            >
              Proje secmeden devam et &#x2192;
            </button>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 pt-2">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full transition-all ${
                    s <= step ? "bg-emerald-400" : "bg-[#1e293b]"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
