import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Agent, ChatMessage, Settings, ProviderType } from "./agents/types";
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
  clearMessages: () => void;
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
      settings: {
        provider: "api" as ProviderType,
        apiKey: "",
        model: "claude-sonnet-4-20250514",
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

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "agent-party-storage",
      partialize: (state) => ({
        agents: state.agents,
        settings: state.settings,
      }),
    }
  )
);
