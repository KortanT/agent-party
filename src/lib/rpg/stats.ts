import { AgentStats, AgentStatus } from "../agents/types";
import { getLevelFromXP } from "./levels";

export function calculateHPCost(tokenCount: number): number {
  return Math.min(Math.ceil(tokenCount / 100), 30);
}

export function calculateXPGain(tokenCount: number): number {
  return Math.min(10 + Math.ceil(tokenCount / 200), 25);
}

export function applyTaskCompletion(
  stats: AgentStats,
  tokenCount: number
): AgentStats {
  const hpCost = calculateHPCost(tokenCount);
  const xpGain = calculateXPGain(tokenCount);
  const newXP = stats.xp + xpGain;
  const newLevel = getLevelFromXP(newXP);
  const newHP = Math.max(0, stats.hp - hpCost);

  return {
    ...stats,
    hp: newHP,
    xp: newXP,
    level: newLevel,
  };
}

export function regenerateHP(stats: AgentStats, seconds: number): AgentStats {
  const regen = Math.floor(seconds / 30); // 1 HP per 30 seconds
  return {
    ...stats,
    hp: Math.min(stats.maxHp, stats.hp + regen),
  };
}

export function getStatusFromHP(hp: number): AgentStatus {
  if (hp <= 0) return "tired";
  if (hp < 20) return "tired";
  return "ready";
}
