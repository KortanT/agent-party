export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 7500, 12000, 20000];

export const LEVEL_TITLES: Record<number, string> = {
  1: "Cirak",
  2: "Kalfa",
  3: "Usta",
  4: "Buyukusta",
  5: "Efsane",
  6: "Mitolojik",
  7: "Kozmik",
  8: "Tanrisal",
  9: "Ebedi",
  10: "Sonsuz",
};

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForNextLevel(level: number): number {
  if (level >= LEVEL_THRESHOLDS.length) return Infinity;
  return LEVEL_THRESHOLDS[level];
}

export function getLevelProgress(xp: number, level: number): number {
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 1000;
  return ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
}
