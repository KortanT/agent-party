"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";

export function ProjectPicker() {
  const { projects, showProjectPicker, toggleProjectPicker, addProject, selectProject, removeProject, settings } = useGameStore();
  const [newPath, setNewPath] = useState("");

  const handleAdd = () => {
    const path = newPath.trim();
    if (!path) return;
    const name = path.split("/").filter(Boolean).pop() || path;
    addProject({
      id: Date.now().toString(36),
      name,
      path,
      lastOpened: Date.now(),
    });
    setNewPath("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <AnimatePresence>
      {showProjectPicker && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleProjectPicker}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b]">
                <div>
                  <h2 className="text-sm font-bold">Proje Sec</h2>
                  <p className="text-[10px] text-[#475569] mt-0.5">Calisma klasoru belirle</p>
                </div>
                <button
                  onClick={toggleProjectPicker}
                  className="w-7 h-7 rounded-lg border border-[#1e293b] flex items-center justify-center text-[#475569] hover:text-white hover:border-[#334155] transition-all"
                >
                  &#x2715;
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Add new project */}
                <div>
                  <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">
                    Yeni Proje Ekle
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPath}
                      onChange={(e) => setNewPath(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="/Users/you/projects/my-app"
                      className="flex-1 bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2.5 text-xs text-[#e2e8f0] font-mono placeholder:text-[#334155] focus:outline-none focus:border-[#334155]"
                    />
                    <button
                      onClick={handleAdd}
                      disabled={!newPath.trim()}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white disabled:opacity-30 transition-all"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                {/* Current project */}
                {settings.currentProjectPath && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <div className="text-[10px] text-emerald-400 font-bold mb-1">Aktif Proje</div>
                    <div className="text-xs text-[#94a3b8] font-mono truncate">{settings.currentProjectPath}</div>
                  </div>
                )}

                {/* Recent projects */}
                {projects.length > 0 && (
                  <div>
                    <label className="text-[10px] text-[#475569] font-bold tracking-wider uppercase mb-2 block">
                      Son Projeler
                    </label>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group ${
                            settings.currentProjectPath === project.path
                              ? "bg-emerald-500/8 border-emerald-500/20"
                              : "border-[#1e293b] hover:bg-[#111827] hover:border-[#334155]"
                          }`}
                          onClick={() => selectProject(project.path)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center text-sm">
                            &#x1f4c1;
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium truncate">{project.name}</div>
                            <div className="text-[10px] text-[#475569] font-mono truncate">{project.path}</div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                            className="opacity-0 group-hover:opacity-100 text-[#475569] hover:text-red-400 transition-all text-xs"
                          >
                            &#x2715;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {projects.length === 0 && !settings.currentProjectPath && (
                  <div className="text-center py-6 text-[#334155] text-xs">
                    Henuz proje eklenmedi.<br/>
                    Bir klasor yolu girin ve Ekle&apos;ye basin.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
