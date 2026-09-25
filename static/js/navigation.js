(function (root) {
  function selectActiveChapter(sections, readingLine) {
    if (!sections.length) return null;

    let activeId = sections[0].id;
    for (const section of sections) {
      if (section.top > readingLine) break;
      activeId = section.id;
    }
    return activeId;
  }

  const navigation = { selectActiveChapter };
  root.MTRiskTraceNavigation = navigation;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = navigation;
  }
})(typeof window !== "undefined" ? window : globalThis);
