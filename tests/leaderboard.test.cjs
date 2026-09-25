const test = require("node:test");
const assert = require("node:assert/strict");

let leaderboard;
try {
  leaderboard = require("../static/js/leaderboard.js");
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
  leaderboard = {};
}

test("leaderboard preserves the published Table 2 runs and scores", () => {
  assert.ok(Array.isArray(leaderboard.entries));
  assert.equal(leaderboard.entries.length, 13);
  assert.equal(leaderboard.entries.filter((entry) => entry.harness === "OpenClaw").length, 11);
  const codex = leaderboard.entries.find((entry) => entry.harness === "Codex");
  assert.deepEqual(
    [codex.model, codex.a1, codex.a2, codex.a3, codex.a4, codex.a5, codex.a6, codex.overall],
    ["GPT-5.5", 5.02, 5.73, 6.21, 5.14, 5.31, 5.81, 6.09],
  );
  const llama = leaderboard.entries.find((entry) => entry.model === "Llama 3.3-70B");
  assert.equal(llama.overall, 87.34);
  assert.equal(llama.a4, 93.91);
});

test("default leaderboard ranks all harness runs by lower overall ASR", () => {
  assert.equal(typeof leaderboard.rankEntries, "function");
  const ranked = leaderboard.rankEntries();
  assert.equal(ranked.length, 13);
  assert.equal(ranked[0].model, "GPT-5.5");
  assert.equal(ranked[0].harness, "Codex");
  assert.equal(ranked[0].overall, 6.09);
  assert.equal(ranked[0].rank, 1);
  assert.equal(ranked.at(-1).model, "Llama 3.3-70B");
  assert.ok(ranked.every((entry, index) => index === 0 || entry.overall >= ranked[index - 1].overall));

  const openClawOnly = leaderboard.rankEntries({ harness: "OpenClaw" });
  assert.equal(openClawOnly.length, 11);
  assert.equal(openClawOnly[0].model, "Claude Sonnet 4.6");
  assert.equal(openClawOnly[0].overall, 8.55);
});

test("all-harness and strategy rankings retain ties", () => {
  assert.equal(typeof leaderboard.rankEntries, "function");
  const all = leaderboard.rankEntries({ harness: "all" });
  assert.equal(all.length, 13);
  assert.deepEqual([all[0].harness, all[0].model, all[0].overall], ["Codex", "GPT-5.5", 6.09]);
  const tiedOverall = all.filter((entry) => entry.overall === 8.55);
  assert.equal(tiedOverall.length, 2);
  assert.equal(tiedOverall[0].rank, tiedOverall[1].rank);

  const byA4 = leaderboard.rankEntries({ harness: "OpenClaw", metric: "a4" });
  assert.equal(byA4[0].a4, 5.78);
  assert.equal(byA4[1].a4, 5.78);
  assert.equal(byA4[0].rank, byA4[1].rank);
});
