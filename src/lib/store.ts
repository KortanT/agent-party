import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Agent, ChatMessage, Settings, ProviderType, Project, CharacterAppearance, GameNotification, AgentZone } from "./agents/types";
import { defaultAgents } from "./agents/registry";
import { applyTaskCompletion, getStatusFromHP, regenerateHP } from "./rpg/stats";
import { getLevelFromXP } from "./rpg/levels";

// Desk positions (where agents work)
const DESK_POSITIONS: Record<string, { x: number; y: number }> = {
  komutan: { x: 50, y: 20 },
  merlin: { x: 20, y: 55 },
  "sir-debug": { x: 80, y: 55 },
  pixie: { x: 35, y: 78 },
  "data-x": { x: 65, y: 78 },
};

// Waiting room positions (bottom corners)
const WAITING_POSITIONS = [
  { x: 8, y: 90 },
  { x: 16, y: 92 },
  { x: 88, y: 90 },
  { x: 92, y: 92 },
];

let waitingIndex = 0;
function getWaitingPosition() {
  const pos = WAITING_POSITIONS[waitingIndex % WAITING_POSITIONS.length];
  waitingIndex++;
  return pos;
}

interface GameState {
  agents: Agent[];
  selectedAgentId: string | "all";
  messages: ChatMessage[];
  isStreaming: boolean;
  isDiscussing: boolean;
  discussionRound: number;
  projects: Project[];
  showProjectPicker: boolean;
  showCustomizer: boolean;
  customizerAgentId: string | null;
  settings: Settings;
  showSettings: boolean;
  notifications: GameNotification[];

  // Actions
  selectAgent: (id: string | "all") => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setDiscussing: (discussing: boolean, round?: number) => void;
  completeTask: (agentId: string, tokenCount: number) => void;
  setAgentStatus: (agentId: string, status: Agent["status"]) => void;
  setAgentWorking: (agentId: string, task: string) => void;
  setAgentDone: (agentId: string) => void;
  setAgentStreaming: (agentId: string, streaming: boolean) => void;
  moveAgentToZone: (agentId: string, zone: AgentZone) => void;
  sendIdleToWaiting: (activeAgentIds: string[]) => void;
  recallAllToDesks: () => void;
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
  addNotification: (n: Omit<GameNotification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
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

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
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
      notifications: [],

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

      // Agent starts working on a task — move to desk, show task
      setAgentWorking: (agentId, task) =>
        set((state) => ({
          agents: state.agents.map((a) => {
            if (a.id !== agentId) return a;
            const deskPos = DESK_POSITIONS[agentId] || a.worldPosition;
            return {
              ...a,
              status: "working" as const,
              zone: "desk" as const,
              currentTask: task,
              worldPosition: deskPos,
              workStartedAt: Date.now(),
            };
          }),
        })),

      // Agent finished task
      setAgentDone: (agentId) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId
              ? { ...a, status: "ready" as const, currentTask: "", isStreamingResponse: false, workStartedAt: null }
              : a
          ),
        })),

      setAgentStreaming: (agentId, streaming) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, isStreamingResponse: streaming } : a
          ),
        })),

      // Move agent to a specific zone
      moveAgentToZone: (agentId, zone) =>
        set((state) => ({
          agents: state.agents.map((a) => {
            if (a.id !== agentId) return a;
            let pos = a.worldPosition;
            if (zone === "desk") pos = DESK_POSITIONS[agentId] || pos;
            if (zone === "waiting-room") pos = getWaitingPosition();
            return { ...a, zone, worldPosition: pos };
          }),
        })),

      // Send non-active agents to waiting room
      sendIdleToWaiting: (activeAgentIds) =>
        set((state) => ({
          agents: state.agents.map((a) => {
            if (a.role === "ceo") return a; // CEO always at desk
            if (activeAgentIds.includes(a.id)) return a;
            if (a.zone === "waiting-room") return a;
            const pos = getWaitingPosition();
            return { ...a, zone: "waiting-room" as const, worldPosition: pos };
          }),
        })),

      // Recall all agents to their desks
      recallAllToDesks: () =>
        set((state) => ({
          agents: state.agents.map((a) => ({
            ...a,
            zone: "desk" as const,
            worldPosition: DESK_POSITIONS[a.id] || a.worldPosition,
          })),
        })),

      completeTask: (agentId, tokenCount) =>
        set((state) => {
          const agent = state.agents.find((a) => a.id === agentId);
          if (!agent) return state;

          const oldLevel = agent.stats.level;
          const newStats = applyTaskCompletion(agent.stats, tokenCount);
          const xpGained = newStats.xp - agent.stats.xp;
          const hpLost = agent.stats.hp - newStats.hp;
          const newLevel = getLevelFromXP(newStats.xp);
          const leveledUp = newLevel > oldLevel;

          // Queue notifications
          const newNotifs: GameNotification[] = [];
          if (xpGained > 0) {
            newNotifs.push({
              id: makeId(),
              agentId,
              text: `+${xpGained} XP`,
              type: "xp",
              timestamp: Date.now(),
            });
          }
          if (hpLost > 0) {
            newNotifs.push({
              id: makeId(),
              agentId,
              text: `-${hpLost} HP`,
              type: "hp",
              timestamp: Date.now() + 500,
            });
          }
          if (leveledUp) {
            newNotifs.push({
              id: makeId(),
              agentId,
              text: `Seviye ${newLevel}!`,
              type: "levelup",
              timestamp: Date.now() + 1000,
            });
          }
          newNotifs.push({
            id: makeId(),
            agentId,
            text: "Gorev tamam!",
            type: "task-done",
            timestamp: Date.now() + 300,
          });

          return {
            agents: state.agents.map((a) => {
              if (a.id !== agentId) return a;
              return {
                ...a,
                stats: newStats,
                status: leveledUp ? ("leveled_up" as const) : getStatusFromHP(newStats.hp),
              };
            }),
            notifications: [...state.notifications, ...newNotifs],
          };
        }),

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
            return { ...a, stats: newStats, status: getStatusFromHP(newStats.hp) };
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
          messages: [],
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

      addNotification: (n) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...n, id: makeId(), timestamp: Date.now() },
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "agent-party-storage",
      version: 4,
      partialize: (state) => ({
        agents: state.agents,
        settings: state.settings,
        projects: state.projects,
      }),
      migrate: (persisted: unknown) => {
        const old = persisted as Record<string, unknown> | null;
        const oldSettings = old?.settings as Partial<Settings> | undefined;
        return {
        agents: defaultAgents,
        settings: {
          provider: (oldSettings?.provider || "api") as ProviderType,
          apiKey: oldSettings?.apiKey || "",
          model: oldSettings?.model || "claude-sonnet-4-20250514",
          currentProjectPath: oldSettings?.currentProjectPath || "",
        },
        projects: (old?.projects || []) as Project[],
      };
      },
    }
  )
);
