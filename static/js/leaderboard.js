(function (root) {
  // Table 2 values are stored as published; Overall is not recalculated from A1–A6.
  const entries = [
    { harness: "OpenClaw", model: "Claude Sonnet 4.6", a1: 6.39, a2: 6.25, a3: 6.78, a4: 5.78, a5: 7.08, a6: 5.50, overall: 8.55 },
    { harness: "OpenClaw", model: "DeepSeek-V4-Flash", a1: 75.80, a2: 63.02, a3: 63.84, a4: 63.72, a5: 63.05, a6: 67.28, overall: 69.09 },
    { harness: "OpenClaw", model: "Gemini 3.5 Flash", a1: 27.40, a2: 25.52, a3: 26.55, a4: 24.72, a5: 29.20, a6: 26.61, overall: 30.36 },
    { harness: "OpenClaw", model: "GLM-5V-Turbo", a1: 90.41, a2: 88.89, a3: 78.53, a4: 87.32, a5: 84.29, a6: 89.91, overall: 85.91 },
    { harness: "OpenClaw", model: "GPT-5.5", a1: 8.22, a2: 6.94, a3: 14.12, a4: 5.78, a5: 7.96, a6: 7.65, overall: 11.27 },
    { harness: "OpenClaw", model: "Grok 4.3", a1: 34.25, a2: 36.46, a3: 33.33, a4: 35.31, a5: 37.61, a6: 36.39, overall: 36.73 },
    { harness: "OpenClaw", model: "Kimi K2.6", a1: 64.84, a2: 54.86, a3: 57.06, a4: 53.13, a5: 51.77, a6: 57.49, overall: 57.09 },
    { harness: "OpenClaw", model: "Llama 3.3-70B", a1: 89.11, a2: 92.80, a3: 88.24, a4: 93.91, a5: 92.46, a6: 86.77, overall: 87.18 },
    { harness: "OpenClaw", model: "MiMo-V2.5-Pro", a1: 63.93, a2: 60.59, a3: 58.19, a4: 62.60, a5: 63.72, a6: 65.44, overall: 62.18 },
    { harness: "OpenClaw", model: "MiniMax-M2.7", a1: 71.69, a2: 58.33, a3: 51.98, a4: 59.71, a5: 54.65, a6: 65.44, overall: 62.45 },
    { harness: "OpenClaw", model: "Qwen3.5-Plus", a1: 31.96, a2: 32.29, a3: 24.29, a4: 31.78, a5: 30.97, a6: 32.11, overall: 30.91 },
    { harness: "Codex", model: "GPT-5.5", a1: 5.02, a2: 5.73, a3: 6.21, a4: 5.14, a5: 5.31, a6: 5.81, overall: 6.09 },
    { harness: "Claude Code", model: "Claude Sonnet 4.6", a1: 6.85, a2: 5.73, a3: 7.34, a4: 5.30, a5: 6.42, a6: 4.89, overall: 8.55 },
  ];

  const metrics = new Set(["overall", "a1", "a2", "a3", "a4", "a5", "a6"]);

  function rankEntries({ harness = "all", metric = "overall" } = {}) {
    if (!metrics.has(metric)) throw new RangeError(`Unknown leaderboard metric: ${metric}`);

    const sorted = entries
      .filter((entry) => harness === "all" || entry.harness === harness)
      .sort((a, b) => a[metric] - b[metric] || a.overall - b.overall || a.model.localeCompare(b.model));

    let rank = 0;
    return sorted.map((entry, index) => {
      if (index === 0 || entry[metric] !== sorted[index - 1][metric]) rank = index + 1;
      return { ...entry, rank };
    });
  }

  const leaderboard = { entries, rankEntries };
  root.MTRiskTraceLeaderboard = leaderboard;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = leaderboard;
  }
})(typeof window !== "undefined" ? window : globalThis);
