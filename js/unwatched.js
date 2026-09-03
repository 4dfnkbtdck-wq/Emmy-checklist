(function () {
  "use strict";

  const seenFlat = loadJson(STORAGE_SEEN, {});
  const seenEpisodes = loadJson(STORAGE_EPISODES, {});

  const summaryEl = document.getElementById("unwatched-summary");
  const groupsEl = document.getElementById("unwatched-groups");

  // Every row this category can produce: the main show/movie entries,
  // plus — separately — each show's spin-offs and tie-in movies/extras.
  // A spin-off or extra is listed even when its parent show is fully
  // watched (e.g. Band of Brothers under an already-finished Pacific),
  // since it's still its own thing to watch.
  //
  // Shows with season data can appear more than once (e.g. Modern
  // Family's five wins) — collapse those to one row, and only look at
  // their spin-offs/extras once. Flat entries (most TV movies) are
  // already one row per year.
  function buildRows(cat) {
    const bySeasonKey = new Map();
    const flatRows = [];
    const extraRows = [];
    const processedForExtras = new Set();

    cat.winners.forEach((entry) => {
      const lookupKey = seasonLookupKey(entry);
      const seasons = getSeasons(lookupKey);
      if (seasons) {
        if (bySeasonKey.has(lookupKey)) {
          bySeasonKey.get(lookupKey).years.push(entry.year);
        } else {
          bySeasonKey.set(lookupKey, {
            title: entry.show,
            years: [entry.year],
            stats: episodeStats(cat.id, lookupKey, seenEpisodes),
            next: findNextEpisode(seasons, seenEpisodes, (sIdx, e) =>
              episodeKey(cat.id, lookupKey, sIdx, e)
            ),
          });
        }
      } else {
        flatRows.push({
          title: entry.show,
          years: [entry.year],
          stats: null,
          isSeen: !!seenFlat[flatKey(cat.id, entry)],
        });
      }

      if (!processedForExtras.has(lookupKey)) {
        processedForExtras.add(lookupKey);

        const spinoffs = getSpinoffs(lookupKey);
        if (spinoffs) {
          spinoffs.forEach((spinoff, spIdx) => {
            let total = 0;
            let seenCount = 0;
            spinoff.seasons.forEach((count, sIdx) => {
              for (let e = 1; e <= count; e++) {
                total++;
                if (seenEpisodes[spinoffEpisodeKey(cat.id, lookupKey, spIdx, sIdx, e)]) seenCount++;
              }
            });
            extraRows.push({
              title: spinoff.title,
              parentTitle: entry.show,
              tag: "Spin-off",
              years: [entry.year],
              stats: { total, seen: seenCount },
              next: findNextEpisode(spinoff.seasons, seenEpisodes, (sIdx, e) =>
                spinoffEpisodeKey(cat.id, lookupKey, spIdx, sIdx, e)
              ),
              isSeen: total > 0 && seenCount === total,
            });
          });
        }

        const movies = getMovies(lookupKey);
        if (movies) {
          movies.forEach((movie, mIdx) => {
            const key = movieKey(cat.id, lookupKey, mIdx);
            extraRows.push({
              title: movie.title,
              parentTitle: entry.show,
              tag: "Extra",
              years: [entry.year],
              stats: null,
              isSeen: !!seenEpisodes[key],
            });
          });
        }
      }
    });

    const seasonRows = Array.from(bySeasonKey.values()).map((row) => ({
      ...row,
      isSeen: row.stats.total > 0 && row.stats.seen === row.stats.total,
    }));

    return seasonRows.concat(flatRows).concat(extraRows);
  }

  function render() {
    groupsEl.innerHTML = "";
    let totalCount = 0;
    let unwatchedCount = 0;

    EMMY_CATEGORIES.forEach((cat) => {
      const rows = buildRows(cat);
      const unwatched = rows
        .filter((r) => !r.isSeen)
        .sort((a, b) => Math.max(...b.years) - Math.max(...a.years));

      totalCount += rows.length;
      unwatchedCount += unwatched.length;

      const section = document.createElement("section");
      section.className = "ios-group";

      const header = document.createElement("div");
      header.className = "unwatched-group-header";
      header.textContent = cat.name + " — " + unwatched.length + " left";
      section.appendChild(header);

      if (unwatched.length === 0) {
        const doneMsg = document.createElement("p");
        doneMsg.className = "unwatched-done";
        doneMsg.textContent = "All caught up.";
        section.appendChild(doneMsg);
      } else {
        const list = document.createElement("ul");
        list.className = "ios-list";
        unwatched.forEach((row) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.className = "unwatched-row";
          const searchTitle = row.parentTitle || row.title;
          a.href =
            "index.html?cat=" + encodeURIComponent(cat.id) + "&search=" + encodeURIComponent(searchTitle);

          const info = document.createElement("span");
          info.className = "unwatched-info";

          const titleEl = document.createElement("div");
          titleEl.className = "unwatched-title";
          titleEl.textContent = row.title;
          if (row.tag) {
            const tagEl = document.createElement("span");
            tagEl.className = "unwatched-tag";
            tagEl.textContent = row.tag;
            titleEl.appendChild(tagEl);
          }
          info.appendChild(titleEl);

          const metaEl = document.createElement("div");
          metaEl.className = "unwatched-meta";
          if (row.parentTitle) {
            const fromText = "From " + row.parentTitle;
            metaEl.textContent = row.stats
              ? fromText + " · " + row.stats.seen + " of " + row.stats.total + " episodes seen"
              : fromText + " · Not seen";
          } else {
            const years = row.years.slice().sort((x, y) => x - y);
            const wonText = "Won " + years.join(", ");
            metaEl.textContent = row.stats
              ? wonText + " · " + row.stats.seen + " of " + row.stats.total + " episodes seen"
              : wonText + " · Not seen";
          }
          info.appendChild(metaEl);

          if (row.next) {
            const nextEl = document.createElement("div");
            nextEl.className = "unwatched-next";
            nextEl.textContent = "Next up: Season " + row.next.season + ", Episode " + row.next.episode;
            info.appendChild(nextEl);
          }

          const chevron = document.createElement("span");
          chevron.className = "winner-chevron unwatched-chevron";
          chevron.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

          a.appendChild(info);
          a.appendChild(chevron);
          li.appendChild(a);
          list.appendChild(li);
        });
        section.appendChild(list);
      }

      groupsEl.appendChild(section);
    });

    summaryEl.textContent =
      unwatchedCount === 0
        ? "Nothing left — you're all caught up!"
        : unwatchedCount + " of " + totalCount + " still to watch";
  }

  render();
})();
