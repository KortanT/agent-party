"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";

export function SettingsModal() {
  const { settings, showSettings, updateSettings, toggleSettings } = useGameStore();

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettings}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
                <div>
                  <h2 className="text-sm font-bold">Ayarlar</h2>
                  <p className="text-[10px] text-[#475569] mt-0.5">AI saglayici yapilandirmasi</p>
                </div>
                <button
                  onClick={toggleSettings}
                  className="w-7 h-7 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:text-white hover:border-[#334155] transition-all"
                >
                  &#x2715;
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Provider Selection */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2.5 block">
                    Saglayici
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => updateSettings({ provider: "api" })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        settings.provider === "api"
                          ? "bg-blue-500/10 border-blue-500/30"
                          : "border-[#1e293b] hover:border-[#334155] hover:bg-[#111827]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">&#x1f511;</span>
                        <span className={`text-xs font-bold ${settings.provider === "api" ? "text-blue-400" : "text-[#94a3b8]"}`}>
                          API Key
                        </span>
                      </div>
                      <p className="text-[10px] text-[#475569]">
                        Anthropic API erisimi
                      </p>
                    </button>
                    <button
                      onClick={() => updateSettings({ provider: "cli" })}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        settings.provider === "cli"
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "border-[#1e293b] hover:border-[#334155] hover:bg-[#111827]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-base">&#x1f4bb;</span>
                        <span className={`text-xs font-bold ${settings.provider === "cli" ? "text-emerald-400" : "text-[#94a3b8]"}`}>
                          Claude CLI
                        </span>
                      </div>
                      <p className="text-[10px] text-[#475569]">
                        Max plan ile ucretsiz
                      </p>
                    </button>
                  </div>
                </div>

                {/* API Key Input */}
                <AnimatePresence mode="wait">
                  {settings.provider === "api" && (
                    <motion.div
                      key="api-settings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={settings.apiKey}
                          onChange={(e) => updateSettings({ apiKey: e.target.value })}
                          placeholder="sk-ant-..."
                          className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-[#e2e8f0] font-mono placeholder:text-[#334155] focus:outline-none focus:border-[#334155] transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">
                          Model
                        </label>
                        <select
                          value={settings.model}
                          onChange={(e) => updateSettings({ model: e.target.value })}
                          className="w-full bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-[#e2e8f0] focus:outline-none focus:border-[#334155] transition-all"
                        >
                          <option value="claude-sonnet-4-20250514">Claude Sonnet 4</option>
                          <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5</option>
                          <option value="claude-opus-4-20250918">Claude Opus 4</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {settings.provider === "cli" && (
                    <motion.div
                      key="cli-settings"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-emerald-500/15 flex items-center justify-center">
                            <span className="text-[10px] text-emerald-400">&#x2713;</span>
                          </div>
                          <p className="text-[11px] text-[#94a3b8]">
                            Claude Code CLI kurulu ve giris yapilmis olmali.
                          </p>
                        </div>
                        <p className="text-[10px] text-[#475569] pl-7">
                          Terminalde <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">claude --version</code> ile kontrol edin.
                        </p>
                        <p className="text-[10px] text-[#475569] pl-7">
                          Max, Pro veya Team planla ek maliyet yok.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#1e293b]">
                <button
                  onClick={toggleSettings}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold tracking-wider text-white transition-all active:scale-[0.98]"
                >
                  KAYDET
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
