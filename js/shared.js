// Shared helpers for reading Emmy Checklist data and localStorage state.
// Used by both the main checklist (js/app.js) and the "Still To Watch"
// overview (js/unwatched.js) — load this after data.js and before
// either of those.

const STORAGE_SEEN = "emmy-checklist:seen"; // flat per-entry seen (no season data)
const STORAGE_EPISODES = "emmy-checklist:episodes"; // per-episode seen

function loadJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v == null ? fallback : v;
  } catch (e) {
    return fallback;
  }
}

function flatKey(categoryId, entry) {
  return categoryId + ":" + entry.year;
}

// Most entries look up their season/movie/spin-off data by their own
// display title. A few (e.g. American Crime Story's per-installment
// titles) share one underlying record via an explicit "seasonsKey" so
// the franchise's data isn't duplicated per winning entry.
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

function spinoffEpisodeKey(categoryId, lookupKey, spinoffIdx, seasonIdx, epIdx) {
  return categoryId + ":" + lookupKey + ":spinoff:" + spinoffIdx + ":s" + seasonIdx + ":e" + epIdx;
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

function getSpinoffs(lookupKey) {
  return typeof SHOW_SPINOFFS !== "undefined" ? SHOW_SPINOFFS[lookupKey] : undefined;
}

// How many of a show's main-season episodes are total / seen, given a
// seenEpisodes map. Returns null if the show has no season data.
function episodeStats(categoryId, lookupKey, seenEpisodes) {
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
