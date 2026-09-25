const chapterTocLinks = [...document.querySelectorAll(".chapter-toc a")];
const chapterToc = document.querySelector(".chapter-toc");
const chapterTocToggle = document.querySelector(".chapter-toc-toggle");
const chapterTocCurrent = document.querySelector(".chapter-toc-current");
const chapterSections = chapterTocLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (chapterTocLinks.length && chapterSections.length) {
  let navigationFrame = 0;

  const closeChapterToc = () => {
    chapterToc.classList.remove("is-open");
    chapterTocToggle.setAttribute("aria-expanded", "false");
  };

  chapterTocToggle.addEventListener("click", () => {
    const isOpen = chapterToc.classList.toggle("is-open");
    chapterTocToggle.setAttribute("aria-expanded", String(isOpen));
  });
  chapterTocLinks.forEach((link) => link.addEventListener("click", closeChapterToc));
  chapterToc.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeChapterToc();
  });

  const updateChapterToc = () => {
    const readingLine = Math.min(window.innerHeight * 0.28, 240);
    const sectionPositions = chapterSections.map((section) => ({
      id: section.id,
      top: section.getBoundingClientRect().top,
    }));
    const activeId = window.MTRiskTraceNavigation.selectActiveChapter(sectionPositions, readingLine);

    let activeLink;
    chapterTocLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
        activeLink = link;
      }
      else link.removeAttribute("aria-current");
    });
    if (activeLink) {
      chapterTocCurrent.textContent = `${activeLink.querySelector("span").textContent} · ${activeLink.querySelector("small").textContent}`;
    }
    navigationFrame = 0;
  };

  const scheduleChapterTocUpdate = () => {
    if (!navigationFrame) navigationFrame = window.requestAnimationFrame(updateChapterToc);
  };

  window.addEventListener("scroll", scheduleChapterTocUpdate, { passive: true });
  window.addEventListener("resize", scheduleChapterTocUpdate);
  updateChapterToc();
}

const leaderboardBody = document.getElementById("leaderboard-body");

if (leaderboardBody && window.MTRiskTraceLeaderboard) {
  const { rankEntries } = window.MTRiskTraceLeaderboard;
  const harnessButtons = [...document.querySelectorAll("[data-leaderboard-harness]")];
  const metricSelect = document.getElementById("leaderboard-metric");
  const metricColumns = [...document.querySelectorAll("[data-leaderboard-column]")];
  const leaderboardNote = document.getElementById("leaderboard-note");
  const metrics = ["a1", "a2", "a3", "a4", "a5", "a6", "overall"];
  let selectedHarness = "all";

  const renderLeaderboard = () => {
    const selectedMetric = metricSelect.value;
    const rows = rankEntries({ harness: selectedHarness, metric: selectedMetric });
    const fragment = document.createDocumentFragment();

    rows.forEach((entry) => {
      const row = document.createElement("tr");
      if (entry.rank <= 3) row.classList.add("leaderboard-top-row");
      if (entry.rank === 1) row.classList.add("leaderboard-first-row");

      const rankCell = document.createElement("td");
      const rankBadge = document.createElement("span");
      rankBadge.className = "leaderboard-rank";
      rankBadge.textContent = String(entry.rank).padStart(2, "0");
      rankCell.append(rankBadge);
      row.append(rankCell);

      const modelCell = document.createElement("th");
      modelCell.scope = "row";
      modelCell.className = "leaderboard-model";
      const modelName = document.createElement("span");
      modelName.textContent = entry.model;
      const harnessName = document.createElement("small");
      harnessName.textContent = entry.harness;
      modelCell.append(modelName, harnessName);
      row.append(modelCell);

      metrics.forEach((metric) => {
        const cell = document.createElement("td");
        cell.className = "leaderboard-score";
        if (metric === selectedMetric) cell.classList.add("is-ranked-metric");
        cell.textContent = entry[metric].toFixed(2);
        row.append(cell);
      });
      fragment.append(row);
    });

    leaderboardBody.replaceChildren(fragment);
    harnessButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.leaderboardHarness === selectedHarness));
    });
    metricColumns.forEach((column) => {
      const isSelected = column.dataset.leaderboardColumn === selectedMetric;
      column.classList.toggle("is-ranked-metric", isSelected);
      if (isSelected) column.setAttribute("aria-sort", "ascending");
      else column.removeAttribute("aria-sort");
    });
    const metricLabel = selectedMetric === "overall" ? "Overall ASR" : selectedMetric.toUpperCase();
    const runContext = selectedHarness === "all" ? "runs across all harnesses" : "OpenClaw runs";
    leaderboardNote.textContent = `Showing ${rows.length} ${runContext} · ranked by ${metricLabel}, lowest first. A1–A6 are attack strategies.`;
  };

  harnessButtons.forEach((button) => button.addEventListener("click", () => {
    selectedHarness = button.dataset.leaderboardHarness;
    renderLeaderboard();
  }));
  metricSelect.addEventListener("change", renderLeaderboard);
  renderLeaderboard();
}

const dialog = document.getElementById("image-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogTitle = document.getElementById("dialog-title");

document.querySelectorAll("[data-full-image]").forEach((button) => {
  button.addEventListener("click", () => {
    const preview = button.querySelector("img");
    dialogImage.src = button.dataset.fullImage;
    dialogImage.alt = preview?.alt || "";
    dialogTitle.textContent = button.dataset.imageTitle || "";
    dialog.showModal();
  });
});

document.querySelectorAll(".zoom-hint").forEach((button) => {
  const imageButton = button.closest(".exhibit")?.querySelector(".exhibit-image");
  if (!imageButton) return;
  button.setAttribute("aria-label", imageButton.getAttribute("aria-label") || "Enlarge image");
  button.addEventListener("click", () => imageButton.click());
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("close", () => {
  dialogImage.removeAttribute("src");
});
