# Emmy Checklist

A small, dependency-free web app for tracking Primetime Emmy Award
winners in four categories — **Best Drama Series**, **Best Comedy
Series**, **Best Limited Series**, and **Best TV Movie** — and checking
off individual episodes (and tie-in movies) as you watch them.

## Running it

No build step, no install. Just open `index.html` in a browser, or serve
the folder statically:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

It also works as-is on GitHub Pages (Settings → Pages → deploy from the
`main` branch, root folder).

## Using it

1. Switch between categories with the segmented control at the top.
2. **Drama / Comedy / Limited Series**: tap a row to expand it into that
   show's full season/episode breakdown (its entire run, not just the
   season that won). Tap an episode number to check it off; tap a
   season header to check off (or clear) the whole season at once. The
   circle on the row itself fills solid once every episode is seen, or
   shows a dash if you're partway through. A few shows also have tie-in
   movies (prequels, sequels, revivals) listed under "Movies" inside
   the expanded panel, checked off separately.
3. **TV Movie**: each entry is a single watch, so it's just a plain
   checkbox — no season/episode breakdown.
4. **Search** filters by show or year.
5. **Newest First / Oldest First** flips the sort order.
6. **Mark All Seen** / **Clear All** apply to every episode (and, for
   TV Movie, every entry) in the currently selected category.

Nothing is synced anywhere — checkmarks live only in the browser you
made them in (`localStorage`).

## Scope

- **Best Drama Series** and **Best Comedy Series** are scoped to
  2010–present, plus a few classics added by request: *The Sopranos*
  for Drama; *Cheers*, *Seinfeld*, and *Frasier* for Comedy.
- **Best Limited Series** is scoped to 2010–present.
- **Best TV Movie** runs its full history back to 1966 (*Ages of Man*,
  the earliest year with a winner) — TV movies don't need episode
  tracking, so there's no reason to trim that list.
- From **2011–2013** the Television Academy merged Limited Series and
  TV Movie into one "Miniseries or Movie" award. Each year's single
  winner is filed under whichever category actually fits it (*Downton
  Abbey* → Limited Series for 2011; *Game Change* and *Behind the
  Candelabra* → TV Movie for 2012 and 2013) instead of being listed
  twice.

## Data and its confidence

`js/data.js` has four pieces:

- `EMMY_CATEGORIES` — the winner lists themselves: `{ year, show,
  wonSeason }` per entry. Sourced primarily from a year-by-year
  reference the user supplied, cross-checked against general research.
- `SHOW_SEASONS` — per-show episode counts, one array entry per season,
  covering each show's entire run (not just the season that won).
  Verified via multiple searches per show; long-running shows with
  irregular season lengths (`Cheers`, `Frasier`, `Modern Family`, etc.)
  are the likeliest spot for a stray off-by-one.
- `SHOW_MOVIES` — tie-in feature films and standalone bonus episodes
  connected to a show. Only real, released titles are listed; every
  show in the checklist was checked for one and most have none. Not
  every "related movie" qualifies — e.g. the 2009 *Watchmen* film is a
  separate, unconnected adaptation of the same source material as the
  2019 HBO series, not an actual tie-in, so it's deliberately excluded.
- `SHOW_SPINOFFS` — full separate series in the same continuity as a
  winning show (e.g. *Better Call Saul* under *Breaking Bad*, *House of
  the Dragon* and *A Knight of the Seven Kingdoms* under *Game of
  Thrones*). Unlike `SHOW_MOVIES`, each spin-off carries its own
  `seasons` array and gets its own nested season/episode checklist. Only
  real, released seasons are listed — an unreleased next season is
  mentioned in the spin-off's `note` but isn't a checkable item yet.

Corrections are just edits to the arrays/objects in `js/data.js`.

---

Fan-made, unofficial tracker. Not affiliated with the Television
Academy or the Emmy Awards.
