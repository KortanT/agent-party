import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Agent, ChatMessage, Settings, ProviderType, Project, CharacterAppearance } from "./agents/types";
import { defaultAgents } from "./agents/registry";
import { applyTaskCompletion, getStatusFromHP, regenerateHP } from "./rpg/stats";

interface GameState {
  // Agents
  agents: Agent[];
  selectedAgentId: string | "all";

  // Chat
  messages: ChatMessage[];
  isStreaming: boolean;

  // Discussion
  isDiscussing: boolean;
  discussionRound: number;

  // Projects
  projects: Project[];
  showProjectPicker: boolean;

  // Character customizer
  showCustomizer: boolean;
  customizerAgentId: string | null;

  // Settings
  settings: Settings;
  showSettings: boolean;

  // Actions
  selectAgent: (id: string | "all") => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setDiscussing: (discussing: boolean, round?: number) => void;
  completeTask: (agentId: string, tokenCount: number) => void;
  setAgentStatus: (agentId: string, status: Agent["status"]) => void;
  regenHP: (agentId: string, seconds: number) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  toggleSettings: () => void;
  toggleProjectPicker: () => void;
  addProject: (project: Project) => void;
  selectProject: (path: string) => void;
  removeProject: (id: string) => void;
  openCustomizer: (agentId: string) => void;
  closeCustomizer: () => void;
  updateAgentName: (agentId: string, name: string) => void;
  updateAgentAppearance: (agentId: string, appearance: Partial<CharacterAppearance>) => void;
  randomizeAppearance: (agentId: string) => void;
  clearMessages: () => void;
}

const RANDOM_COLORS = ["#4ade80", "#60a5fa", "#fb923c", "#c084fc", "#f87171", "#fbbf24", "#34d399", "#a78bfa", "#f472b6", "#38bdf8"];
const RANDOM_EYES: CharacterAppearance["eyeStyle"][] = ["normal", "happy", "angry", "cool", "sleepy"];
const RANDOM_ACCESSORIES: CharacterAppearance["accessory"][] = ["crown", "wizard-hat", "helmet", "bow", "crystal", "headset"];
const RANDOM_OUTFITS: CharacterAppearance["outfit"][] = ["suit", "robe", "armor", "dress", "hoodie", "lab-coat"];
const RANDOM_SKIN = ["#fcd9b6", "#f5c9a8", "#d4a574", "#c68642", "#8d5524", "#ffe0bd"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      agents: defaultAgents,
      selectedAgentId: "all",
      messages: [],
      isStreaming: false,
      isDiscussing: false,
      discussionRound: 0,
      projects: [],
      showProjectPicker: false,
      showCustomizer: false,
      customizerAgentId: null,
      settings: {
        provider: "api" as ProviderType,
        apiKey: "",
        model: "claude-sonnet-4-20250514",
        currentProjectPath: "",
      },
      showSettings: false,

      selectAgent: (id) => set({ selectedAgentId: id }),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      updateMessage: (id, content) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, content } : m
          ),
        })),

      setStreaming: (streaming) => set({ isStreaming: streaming }),

      setDiscussing: (discussing, round = 0) =>
        set({ isDiscussing: discussing, discussionRound: round }),

      completeTask: (agentId, tokenCount) =>
        set((state) => ({
          agents: state.agents.map((a) => {
            if (a.id !== agentId) return a;
            const newStats = applyTaskCompletion(a.stats, tokenCount);
            return {
              ...a,
              stats: newStats,
              status: getStatusFromHP(newStats.hp),
            };
          }),
        })),

      setAgentStatus: (agentId, status) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, status } : a
          ),
        })),

      regenHP: (agentId, seconds) =>
        set((state) => ({
          agents: state.agents.map((a) => {
            if (a.id !== agentId) return a;
            const newStats = regenerateHP(a.stats, seconds);
            return {
              ...a,
              stats: newStats,
              status: getStatusFromHP(newStats.hp),
            };
          }),
        })),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      toggleSettings: () =>
        set((state) => ({ showSettings: !state.showSettings })),

      toggleProjectPicker: () =>
        set((state) => ({ showProjectPicker: !state.showProjectPicker })),

      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects.filter((p) => p.path !== project.path)].slice(0, 10),
          settings: { ...state.settings, currentProjectPath: project.path },
          showProjectPicker: false,
        })),

      selectProject: (path) =>
        set((state) => ({
          settings: { ...state.settings, currentProjectPath: path },
          projects: state.projects.map((p) =>
            p.path === path ? { ...p, lastOpened: Date.now() } : p
          ),
          showProjectPicker: false,
          messages: [], // Clear chat for new project context
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      openCustomizer: (agentId) =>
        set({ showCustomizer: true, customizerAgentId: agentId }),

      closeCustomizer: () =>
        set({ showCustomizer: false, customizerAgentId: null }),

      updateAgentName: (agentId, name) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, name: name.toUpperCase() } : a
          ),
        })),

      updateAgentAppearance: (agentId, appearance) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId
              ? { ...a, appearance: { ...a.appearance, ...appearance }, color: appearance.bodyColor || a.color }
              : a
          ),
        })),

      randomizeAppearance: (agentId) =>
        set((state) => {
          const color = randomItem(RANDOM_COLORS);
          return {
            agents: state.agents.map((a) =>
              a.id === agentId
                ? {
                    ...a,
                    color,
                    appearance: {
                      bodyColor: color,
                      hatColor: randomItem(RANDOM_COLORS),
                      eyeStyle: randomItem(RANDOM_EYES),
                      accessory: randomItem(RANDOM_ACCESSORIES),
                      skinTone: randomItem(RANDOM_SKIN),
                      outfit: randomItem(RANDOM_OUTFITS),
                    },
                  }
                : a
            ),
          };
        }),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "agent-party-storage",
      version: 2,
      partialize: (state) => ({
        agents: state.agents,
        settings: state.settings,
        projects: state.projects,
      }),
      migrate: () => {
        // On version mismatch, reset to defaults to get new fields
        return {
          agents: defaultAgents,
          settings: {
            provider: "api" as ProviderType,
            apiKey: "",
            model: "claude-sonnet-4-20250514",
            currentProjectPath: "",
          },
          projects: [],
        };
      },
    }
  )
);
