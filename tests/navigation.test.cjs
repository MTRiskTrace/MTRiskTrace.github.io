const test = require("node:test");
const assert = require("node:assert/strict");

const { selectActiveChapter } = require("../static/js/navigation.js");

test("selectActiveChapter highlights the latest chapter above the reading line", () => {
  const sections = [
    { id: "chapter-01", top: -520 },
    { id: "chapter-02", top: -40 },
    { id: "chapter-03", top: 480 },
  ];

  assert.equal(selectActiveChapter(sections, 120), "chapter-02");
});

test("selectActiveChapter keeps the first chapter active before its heading reaches the reading line", () => {
  const sections = [
    { id: "chapter-01", top: 180 },
    { id: "chapter-02", top: 720 },
  ];

  assert.equal(selectActiveChapter(sections, 120), "chapter-01");
});
