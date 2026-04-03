export type AgentSkill =
  | "Mimari" | "Sistem" | "Kod" | "Bug"
  | "Tasarim" | "UX" | "Veri" | "ML"
  | "Liderlik" | "Strateji";

export type AgentStatus = "ready" | "working" | "tired" | "leveled_up";

export type AnimationState = "idle" | "walking" | "thinking" | "coding" | "celebrating";

export type AgentMood = "happy" | "focused" | "angry" | "sleepy" | "excited";

export type AgentRole = "ceo" | "agent";

// Where the agent currently is
export type AgentZone = "desk" | "wandering" | "waiting-room";

export interface AgentStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
}

export interface CharacterAppearance {
  bodyColor: string;
  hatColor: string;
  eyeStyle: "normal" | "happy" | "angry" | "cool" | "sleepy";
  accessory: "none" | "crown" | "wizard-hat" | "helmet" | "bow" | "crystal" | "headset";
  skinTone: string;
  outfit: "suit" | "robe" | "armor" | "dress" | "hoodie" | "lab-coat";
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  emoji: string;
  skills: AgentSkill[];
  color: string;
  stats: AgentStats;
  status: AgentStatus;
  mood: AgentMood;
  role: AgentRole;
  appearance: CharacterAppearance;
  worldPosition: { x: number; y: number };
  zone: AgentZone;
  // Live state for real-time display
  currentTask: string;
  isStreamingResponse: boolean;
  workStartedAt: number | null; // timestamp for timer
}

export interface ChatMessage {
  id: string;
  agentId: string | "user" | "system";
  content: string;
  timestamp: number;
  type: "task" | "response" | "discussion" | "system" | "delegation";
}

export interface DelegationTask {
  agentId: string;
  task: string;
}

export interface CEOResponse {
  thinking: string;
  delegations: DelegationTask[];
}

// Floating notification (XP gain, level up, etc.)
export interface GameNotification {
  id: string;
  agentId: string;
  text: string;
  type: "xp" | "levelup" | "hp" | "task-done";
  timestamp: number;
}

export type QuickAction = {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
};

export type ProviderType = "api" | "cli";

export interface Project {
  id: string;
  name: string;
  path: string;
  lastOpened: number;
}

export interface Settings {
  provider: ProviderType;
  apiKey: string;
  model: string;
  currentProjectPath: string;
}
