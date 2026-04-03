"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";
import { CharacterAvatar } from "./characters/CharacterAvatar";
import { defaultAgents } from "@/lib/agents/registry";

const steps = [
  {
    title: "Agent Party'ye Hosgeldin!",
    subtitle: "AI takim arkadaslarin seninle taninmak icin sabirsizlaniyor",
    emoji: "&#x1f389;",
  },
  {
    title: "Ekibinle Tanis",
    subtitle: "Her biri farkli yeteneklere sahip 5 ajan seni bekliyor",
    emoji: "&#x1f91d;",
  },
  {
    title: "Projeni Sec",
    subtitle: "Calisma klasorunu belirle ve maceraya basla",
    emoji: "&#x1f4c2;",
  },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [projectPath, setProjectPath] = useState("");
  const { addProject, updateSettings, toggleSettings } = useGameStore();
  const settings = useGameStore((s) => s.settings);

  const isConfigured =
    settings.provider === "cli" ||
    (settings.provider === "api" && settings.apiKey.length > 0);

  const handleAddProject = () => {
    const path = projectPath.trim();
    if (!path) return;
    const name = path.split("/").filter(Boolean).pop() || path;
    addProject({
      id: Date.now().toString(36),
      name,
      path,
      lastOpened: Date.now(),
    });
  };

  const handleSkipProject = () => {
    updateSettings({ currentProjectPath: "__skipped__" });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06080f] flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-emerald-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.05, 0.2, 0.05],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
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
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div>
              <motion.div
                className="text-5xl mb-4"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span dangerouslySetInnerHTML={{ __html: "&#x2694;&#xfe0f;" }} />
              </motion.div>
              <h1 className="text-2xl font-bold text-emerald-400 tracking-[0.2em] mb-2">
                AGENT PARTY
              </h1>
              <p className="text-sm text-[#94a3b8]">{steps[0].subtitle}</p>
            </div>

            <div className="bg-[#111827] border border-[#1e293b] rounded-2xl p-6">
              <p className="text-xs text-[#475569] mb-4 leading-relaxed">
                Yazilim gelistirmeyi bir oyuna donusturuyoruz.
                Her biri farkli yeteneklere sahip AI ajanlarinla bir ekip kur,
                gorevler ver ve projelerini birlikte gelistir.
              </p>
              <div className="flex items-center justify-center gap-1">
                {["&#x1f9d9;", "&#x2694;&#xfe0f;", "&#x1f451;", "&#x1f98a;", "&#x1f52e;"].map((e, i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    dangerouslySetInnerHTML={{ __html: e }}
                  />
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
              <h2 className="text-lg font-bold mb-1">{steps[1].title}</h2>
              <p className="text-xs text-[#475569]">{steps[1].subtitle}</p>
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
              <h2 className="text-lg font-bold mb-1">{steps[2].title}</h2>
              <p className="text-xs text-[#475569]">{steps[2].subtitle}</p>
            </div>

            {/* Provider setup */}
            {!isConfigured && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-3">
                <p className="text-[11px] text-amber-400">
                  &#x26a0; Once AI saglayicisini ayarla
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { updateSettings({ provider: "cli" }); }}
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={projectPath}
                  onChange={(e) => setProjectPath(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
                  placeholder="/Users/you/projects/my-app"
                  className="flex-1 bg-[#0a0e17] border border-[#1e293b] rounded-lg px-3 py-2.5 text-xs text-[#e2e8f0] font-mono placeholder:text-[#334155] focus:outline-none focus:border-[#334155]"
                />
                <button
                  onClick={handleAddProject}
                  disabled={!projectPath.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white disabled:opacity-30 transition-all"
                >
                  Basla
                </button>
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
