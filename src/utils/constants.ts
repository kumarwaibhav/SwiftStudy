export const TYPE_META: Record<string, { color: string; bg: string }> = {
  concept:        { color: "#00D4FF", bg: "rgba(0,212,255,0.08)"   },
  lecture:        { color: "#FFD93D", bg: "rgba(255,217,61,0.08)"  },
  implementation: { color: "#6BCB77", bg: "rgba(107,203,119,0.08)" },
  visualization:  { color: "#FF6B6B", bg: "rgba(255,107,107,0.08)" },
};

export const DIFF_META: Record<string, { color: string }> = {
  beginner:     { color: "#6BCB77" },
  intermediate: { color: "#FFD93D" },
  advanced:     { color: "#FF6B6B" },
};
