export type AgentSkill =
  | "Mimari" | "Sistem" | "Kod" | "Bug"
  | "Tasarim" | "UX" | "Veri" | "ML"
  | "Liderlik" | "Strateji";

export type AgentStatus = "ready" | "working" | "tired" | "leveled_up";

export type AnimationState = "idle" | "walking" | "thinking" | "coding" | "celebrating";

export type AgentMood = "happy" | "focused" | "angry" | "sleepy" | "excited";

export type AgentRole = "ceo" | "agent";

export interface AgentStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
}

// Character appearance - customizable
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
  // Position in virtual world (percentage based)
  worldPosition: { x: number; y: number };
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
