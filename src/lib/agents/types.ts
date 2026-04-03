export type AgentSkill =
  | "Mimari" | "Sistem" | "Kod" | "Bug"
  | "Tasarim" | "UX" | "Veri" | "ML";

export type AgentStatus = "ready" | "working" | "tired" | "leveled_up";

export type AgentMood = "happy" | "focused" | "angry" | "sleepy" | "excited";

export interface AgentStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
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
}

export interface ChatMessage {
  id: string;
  agentId: string | "user" | "system";
  content: string;
  timestamp: number;
  type: "task" | "response" | "discussion" | "system";
}

export type QuickAction = {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
};

export type ProviderType = "api" | "cli";

export interface Settings {
  provider: ProviderType;
  apiKey: string;
  model: string;
}
