(function () {
  "use strict";

  const STORAGE_SEEN = "emmy-checklist:seen"; // flat per-entry seen (no season data)
  const STORAGE_EPISODES = "emmy-checklist:episodes"; // per-episode seen
  const STORAGE_CATEGORY = "emmy-checklist:category";
  const STORAGE_SORT = "emmy-checklist:sort";
  const STORAGE_EXPANDED = "emmy-checklist:expanded";

  const categorySegmented = document.getElementById("category-segmented");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const searchInput = document.getElementById("search");
  const sortToggle = document.getElementById("sort-toggle");
  const markAllBtn = document.getElementById("mark-all-seen");
  const clearAllBtn = document.getElementById("clear-all-seen");
  const winnersList = document.getElementById("winners-list");
  const categoryNote = document.getElementById("category-note");

  let seenFlat = loadJson(STORAGE_SEEN, {});
  let seenEpisodes = loadJson(STORAGE_EPISODES, {});
  let currentCategoryId = localStorage.getItem(STORAGE_CATEGORY) || EMMY_CATEGORIES[0].id;
  let sortNewestFirst = localStorage.getItem(STORAGE_SORT) !== "oldest";
  let searchTerm = "";
  let expandedShows = new Set(loadJson(STORAGE_EXPANDED, []));

  function loadJson(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function saveFlat() {
    localStorage.setItem(STORAGE_SEEN, JSON.stringify(seenFlat));
  }

  function saveEpisodes() {
    localStorage.setItem(STORAGE_EPISODES, JSON.stringify(seenEpisodes));
  }

  function saveExpanded() {
    localStorage.setItem(STORAGE_EXPANDED, JSON.stringify(Array.from(expandedShows)));
  }

  function flatKey(categoryId, entry) {
    return categoryId + ":" + entry.year;
  }

  // Most entries look up their season/movie data by their own display
  // title. A few (e.g. American Crime Story's per-installment titles)
  // share one underlying record via an explicit "seasonsKey" so the
  // franchise's seasons/movies aren't duplicated per winning entry.
  function seasonLookupKey(entry) {
    return entry.seasonsKey || entry.show;
  }

  function showKey(categoryId, lookupKey) {
    return categoryId + ":" + lookupKey;
  }

  function episodeKey(categoryId, lookupKey, seasonIdx, epIdx) {
    return categoryId + ":" + lookupKey + ":s" + seasonIdx + ":e" + epIdx;
  }

  function movieKey(categoryId, lookupKey, movieIdx) {
    return categoryId + ":" + lookupKey + ":movie:" + movieIdx;
  }

  function getCategory(id) {
    return EMMY_CATEGORIES.find((c) => c.id === id) || EMMY_CATEGORIES[0];
  }

  function getSeasons(lookupKey) {
    return typeof SHOW_SEASONS !== "undefined" ? SHOW_SEASONS[lookupKey] : undefined;
  }

  function getMovies(lookupKey) {
    return typeof SHOW_MOVIES !== "undefined" ? SHOW_MOVIES[lookupKey] : undefined;
  }

  function buildSegmented() {
    categorySegmented.innerHTML = "";
    EMMY_CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = cat.short;
      btn.dataset.cat = cat.id;
      if (cat.id === currentCategoryId) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentCategoryId = cat.id;
        localStorage.setItem(STORAGE_CATEGORY, currentCategoryId);
        searchInput.value = "";
        searchTerm = "";
        render();
      });
      categorySegmented.appendChild(btn);
    });
  }

  function checkIconSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  function chevronSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  // Episode counting for a show: how many total / seen.
  function episodeStats(categoryId, lookupKey) {
    const seasons = getSeasons(lookupKey);
    if (!seasons) return null;
    let total = 0;
    let seenCount = 0;
    seasons.forEach((count, sIdx) => {
      for (let e = 1; e <= count; e++) {
        total++;
        if (seenEpisodes[episodeKey(categoryId, lookupKey, sIdx, e)]) seenCount++;
      }
    });
    return { total, seen: seenCount };
  }

  function setShowFullySeen(categoryId, lookupKey, value) {
    const seasons = getSeasons(lookupKey);
    if (!seasons) return;
    seasons.forEach((count, sIdx) => {
      for (let e = 1; e <= count; e++) {
        const key = episodeKey(categoryId, lookupKey, sIdx, e);
        if (value) seenEpisodes[key] = true;
        else delete seenEpisodes[key];
      }
    });
  }

  function render() {
    buildSegmented();
    const cat = getCategory(currentCategoryId);

    if (cat.note) {
      categoryNote.textContent = cat.note;
      categoryNote.classList.remove("hidden");
    } else {
      categoryNote.classList.add("hidden");
    }

    let entries = cat.winners.slice();
    entries.sort((a, b) => (sortNewestFirst ? b.year - a.year : a.year - b.year));

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      entries = entries.filter(
        (e) => e.show.toLowerCase().includes(term) || String(e.year).includes(term)
      );
    }

    winnersList.innerHTML = "";
    const panelRenderedForShow = new Set();

    if (entries.length === 0) {
      const li = document.createElement("li");
      li.className = "empty-state";
      li.textContent = "No matches.";
      winnersList.appendChild(li);
    }

    entries.forEach((entry) => {
      const lookupKey = seasonLookupKey(entry);
      const seasons = getSeasons(lookupKey);
      const sKey = showKey(cat.id, lookupKey);
      const isExpanded = seasons && expandedShows.has(sKey);

      let isSeen, isPartial;
      let stats = null;
      if (seasons) {
        stats = episodeStats(cat.id, lookupKey);
        isSeen = stats.total > 0 && stats.seen === stats.total;
        isPartial = stats.seen > 0 && !isSeen;
      } else {
        const fKey = flatKey(cat.id, entry);
        isSeen = !!seenFlat[fKey];
        isPartial = false;
      }

      const row = document.createElement("li");
      row.className = "winner-row" + (isExpanded ? " expanded" : "");
      row.setAttribute("role", "checkbox");
      row.setAttribute("aria-checked", String(isSeen));

      const year = document.createElement("span");
      year.className = "winner-year";
      year.textContent = entry.year;

      const info = document.createElement("span");
      info.className = "winner-info";
      const showEl = document.createElement("div");
      showEl.className = "winner-show" + (isSeen ? " seen" : "");
      showEl.textContent = entry.show;
      info.appendChild(showEl);

      if (entry.wonSeason) {
        const metaEl = document.createElement("div");
        metaEl.className = "winner-meta";
        metaEl.textContent = "Won for S" + entry.wonSeason;
        info.appendChild(metaEl);
      }

      if (stats) {
        const prog = document.createElement("div");
        prog.className = "winner-episode-progress";
        prog.textContent = stats.total
          ? stats.seen + " of " + stats.total + " episodes seen"
          : "Episode data coming soon";
        info.appendChild(prog);
      }

      row.appendChild(year);
      row.appendChild(info);

      if (seasons) {
        const chevron = document.createElement("span");
        chevron.className = "winner-chevron";
        chevron.innerHTML = chevronSvg();
        row.appendChild(chevron);
      }

      const check = document.createElement("span");
      check.className =
        "winner-check" + (isSeen ? " checked" : isPartial ? " partial" : "");
      check.innerHTML = checkIconSvg();
      check.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (seasons) {
          setShowFullySeen(cat.id, lookupKey, !isSeen);
          saveEpisodes();
        } else {
          const fKey = flatKey(cat.id, entry);
          seenFlat[fKey] = !isSeen;
          if (!seenFlat[fKey]) delete seenFlat[fKey];
          saveFlat();
        }
        render();
      });
      row.appendChild(check);

      row.addEventListener("click", () => {
        if (!seasons) {
          check.click();
          return;
        }
        if (expandedShows.has(sKey)) expandedShows.delete(sKey);
        else expandedShows.add(sKey);
        saveExpanded();
        render();
      });

      winnersList.appendChild(row);

      if (isExpanded && seasons && !panelRenderedForShow.has(sKey)) {
        panelRenderedForShow.add(sKey);
        const panel = document.createElement("li");
        panel.className = "seasons-panel";

        seasons.forEach((count, sIdx) => {
          let seasonSeen = 0;
          for (let e = 1; e <= count; e++) {
            if (seenEpisodes[episodeKey(cat.id, lookupKey, sIdx, e)]) seasonSeen++;
          }

          const block = document.createElement("div");
          block.className = "season-block";

          const seasonAllSeen = seasonSeen === count && count > 0;
          const seasonPartial = seasonSeen > 0 && !seasonAllSeen;

          const header = document.createElement("div");
          header.className = "season-header";
          header.setAttribute("role", "checkbox");
          header.setAttribute("aria-checked", String(seasonAllSeen));

          const textWrap = document.createElement("span");
          textWrap.className = "season-header-text";
          const title = document.createElement("span");
          title.className = "season-header-title";
          title.textContent = "Season " + (sIdx + 1);
          const countEl = document.createElement("span");
          countEl.className = "season-header-count";
          countEl.textContent = seasonSeen + " / " + count;
          textWrap.appendChild(title);
          textWrap.appendChild(countEl);

          const seasonCheck = document.createElement("span");
          seasonCheck.className =
            "winner-check season-check" +
            (seasonAllSeen ? " checked" : seasonPartial ? " partial" : "");
          seasonCheck.title = seasonAllSeen ? "Mark season unseen" : "Mark whole season seen";
          seasonCheck.innerHTML = checkIconSvg();

          header.appendChild(textWrap);
          header.appendChild(seasonCheck);
          header.addEventListener("click", () => {
            for (let e = 1; e <= count; e++) {
              const key = episodeKey(cat.id, lookupKey, sIdx, e);
              if (seasonAllSeen) delete seenEpisodes[key];
              else seenEpisodes[key] = true;
            }
            saveEpisodes();
            render();
          });
          block.appendChild(header);

          const grid = document.createElement("div");
          grid.className = "episode-grid";
          for (let e = 1; e <= count; e++) {
            const key = episodeKey(cat.id, lookupKey, sIdx, e);
            const chip = document.createElement("span");
            chip.className = "episode-chip" + (seenEpisodes[key] ? " seen" : "");
            chip.textContent = e;
            chip.title = "S" + (sIdx + 1) + "E" + e;
            chip.addEventListener("click", () => {
              if (seenEpisodes[key]) delete seenEpisodes[key];
              else seenEpisodes[key] = true;
              saveEpisodes();
              render();
            });
            grid.appendChild(chip);
          }
          block.appendChild(grid);

          panel.appendChild(block);
        });

        const movies = getMovies(lookupKey);
        if (movies && movies.length) {
          const movieBlock = document.createElement("div");
          movieBlock.className = "season-block movies-block";

          const movieHeading = document.createElement("div");
          movieHeading.className = "season-header-title movies-heading";
          movieHeading.textContent = "Movies & Extras";
          movieBlock.appendChild(movieHeading);

          movies.forEach((movie, mIdx) => {
            const key = movieKey(cat.id, lookupKey, mIdx);
            const isMovieSeen = !!seenEpisodes[key];

            const movieItem = document.createElement("div");
            movieItem.className = "movie-item";

            const movieRow = document.createElement("div");
            movieRow.className = "movie-row";

            const movieTitle = document.createElement("span");
            movieTitle.className = "movie-title" + (isMovieSeen ? " seen" : "");
            movieTitle.textContent = movie.title + (movie.year ? " (" + movie.year + ")" : "");

            const movieCheck = document.createElement("span");
            movieCheck.className = "winner-check movie-check" + (isMovieSeen ? " checked" : "");
            movieCheck.innerHTML = checkIconSvg();

            movieRow.appendChild(movieTitle);
            movieRow.appendChild(movieCheck);
            movieRow.addEventListener("click", () => {
              if (seenEpisodes[key]) delete seenEpisodes[key];
              else seenEpisodes[key] = true;
              saveEpisodes();
              render();
            });
            movieItem.appendChild(movieRow);

            if (movie.note) {
              const noteEl = document.createElement("div");
              noteEl.className = "movie-note";
              noteEl.textContent = movie.note;
              movieItem.appendChild(noteEl);
            }

            movieBlock.appendChild(movieItem);
          });

          panel.appendChild(movieBlock);
        }

        winnersList.appendChild(panel);
      }
    });

    updateProgress(cat);
  }

  function updateProgress(cat) {
    const total = cat.winners.length;
    let seenCount = 0;
    cat.winners.forEach((e) => {
      const lookupKey = seasonLookupKey(e);
      const seasons = getSeasons(lookupKey);
      if (seasons) {
        const stats = episodeStats(cat.id, lookupKey);
        if (stats.total > 0 && stats.seen === stats.total) seenCount++;
      } else if (seenFlat[flatKey(cat.id, e)]) {
        seenCount++;
      }
    });
    const pct = total ? Math.round((seenCount / total) * 100) : 0;
    progressFill.style.width = pct + "%";
    progressLabel.textContent = seenCount + " of " + total + " seen";
  }

  searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
  });

  sortToggle.addEventListener("click", () => {
    sortNewestFirst = !sortNewestFirst;
    localStorage.setItem(STORAGE_SORT, sortNewestFirst ? "newest" : "oldest");
    sortToggle.textContent = sortNewestFirst ? "Newest First" : "Oldest First";
    render();
  });

  markAllBtn.addEventListener("click", () => {
    const cat = getCategory(currentCategoryId);
    cat.winners.forEach((e) => {
      const lookupKey = seasonLookupKey(e);
      const seasons = getSeasons(lookupKey);
      if (seasons) {
        setShowFullySeen(cat.id, lookupKey, true);
      } else {
        seenFlat[flatKey(cat.id, e)] = true;
      }
    });
    saveFlat();
    saveEpisodes();
    render();
  });

  clearAllBtn.addEventListener("click", () => {
    const cat = getCategory(currentCategoryId);
    cat.winners.forEach((e) => {
      const lookupKey = seasonLookupKey(e);
      const seasons = getSeasons(lookupKey);
      if (seasons) {
        setShowFullySeen(cat.id, lookupKey, false);
      } else {
        delete seenFlat[flatKey(cat.id, e)];
      }
    });
    saveFlat();
    saveEpisodes();
    render();
  });

  sortToggle.textContent = sortNewestFirst ? "Newest First" : "Oldest First";
  render();
})();
