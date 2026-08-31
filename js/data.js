// Emmy Checklist — winner data
//
// Sourced primarily from a year-by-year Emmy reference the user supplied
// (winner + winning season for Comedy/Drama/Limited/TV Movie, 1951-2025),
// cross-checked against general research.
//
// Scope:
// - Best Drama Series and Best Comedy Series are 2010-present, PLUS a
//   handful of named classics the user asked to include even though
//   they predate that cutoff (The Sopranos for Drama; Cheers, Seinfeld,
//   and Frasier for Comedy).
// - Best Limited Series is 2010-present.
// - Best TV Movie runs its full history back to 1966 (Ages of Man, the
//   earliest year the reference has a winner) — movies are a single
//   watch, not a series with episodes, so there's no season/episode
//   breakdown to worry about and no reason to trim it.
//
// Every Drama/Comedy/Limited entry carries a "show" key that indexes
// into SHOW_SEASONS (below) — the array of episode counts per season,
// covering that show's *entire* run, not just the season that won —
// which powers the season/episode checklist drill-down. Two entries for
// the same show (e.g. Modern Family's five wins) share one SHOW_SEASONS
// record. "wonSeason" notes which season actually won, where known.
//
// From 2011-2013 the Television Academy merged Limited Series and TV
// Movie into one "Miniseries or Movie" award. Each year's single winner
// is filed under whichever category actually fits it (Downton Abbey ->
// Limited Series for 2011; Game Change and Behind the Candelabra -> TV
// Movie for 2012 and 2013) — so the other category has no entry those
// years, rather than listing the same title twice.
//
// Corrections are just edits to the arrays/objects below.

const EMMY_CATEGORIES = [
  {
    id: "drama",
    name: "Best Drama Series",
    short: "Drama",
    note: "Scoped to 2010-present, plus The Sopranos (2004, 2007) by request.",
    winners: [
      { year: 2004, show: "The Sopranos", network: "HBO", wonSeason: 5 },
      { year: 2007, show: "The Sopranos", network: "HBO", wonSeason: 6 },
      { year: 2010, show: "Mad Men", network: "AMC", wonSeason: 3 },
      { year: 2011, show: "Mad Men", network: "AMC", wonSeason: 4 },
      { year: 2012, show: "Homeland", network: "Showtime", wonSeason: 1 },
      { year: 2013, show: "Breaking Bad", network: "AMC", wonSeason: 5 },
      { year: 2014, show: "Breaking Bad", network: "AMC", wonSeason: 5 },
      { year: 2015, show: "Game of Thrones", network: "HBO", wonSeason: 5 },
      { year: 2016, show: "Game of Thrones", network: "HBO", wonSeason: 6 },
      { year: 2017, show: "The Handmaid's Tale", network: "Hulu", wonSeason: 1 },
      { year: 2018, show: "Game of Thrones", network: "HBO", wonSeason: 7 },
      { year: 2019, show: "Game of Thrones", network: "HBO", wonSeason: 8 },
      { year: 2020, show: "Succession", network: "HBO", wonSeason: 2 },
      { year: 2021, show: "The Crown", network: "Netflix", wonSeason: 4 },
      { year: 2022, show: "Succession", network: "HBO", wonSeason: 3 },
      { year: 2023, show: "Succession", network: "HBO", wonSeason: 4 },
      { year: 2024, show: "Shōgun", network: "FX/Hulu", wonSeason: 1 },
      { year: 2025, show: "The Pitt", network: "Max", wonSeason: 1 },
    ],
  },
  {
    id: "comedy",
    name: "Best Comedy Series",
    short: "Comedy",
    note: "Scoped to 2010-present, plus Cheers (1983-91), Seinfeld (1993), and Frasier (1994-98) by request.",
    winners: [
      { year: 1983, show: "Cheers", network: "NBC", wonSeason: 1 },
      { year: 1984, show: "Cheers", network: "NBC", wonSeason: 2 },
      { year: 1989, show: "Cheers", network: "NBC", wonSeason: 7 },
      { year: 1991, show: "Cheers", network: "NBC", wonSeason: 9 },
      { year: 1993, show: "Seinfeld", network: "NBC", wonSeason: 4 },
      { year: 1994, show: "Frasier", network: "NBC", wonSeason: 1 },
      { year: 1995, show: "Frasier", network: "NBC", wonSeason: 2 },
      { year: 1996, show: "Frasier", network: "NBC", wonSeason: 3 },
      { year: 1997, show: "Frasier", network: "NBC", wonSeason: 4 },
      { year: 1998, show: "Frasier", network: "NBC", wonSeason: 5 },
      { year: 2010, show: "Modern Family", network: "ABC", wonSeason: 1 },
      { year: 2011, show: "Modern Family", network: "ABC", wonSeason: 2 },
      { year: 2012, show: "Modern Family", network: "ABC", wonSeason: 3 },
      { year: 2013, show: "Modern Family", network: "ABC", wonSeason: 4 },
      { year: 2014, show: "Modern Family", network: "ABC", wonSeason: 5 },
      { year: 2015, show: "Veep", network: "HBO", wonSeason: 4 },
      { year: 2016, show: "Veep", network: "HBO", wonSeason: 5 },
      { year: 2017, show: "Veep", network: "HBO", wonSeason: 6 },
      { year: 2018, show: "The Marvelous Mrs. Maisel", network: "Amazon", wonSeason: 1 },
      { year: 2019, show: "Fleabag", network: "Amazon", wonSeason: 2 },
      { year: 2020, show: "Schitt's Creek", network: "Pop TV", wonSeason: 6 },
      { year: 2021, show: "Ted Lasso", network: "Apple TV+", wonSeason: 1 },
      { year: 2022, show: "Ted Lasso", network: "Apple TV+", wonSeason: 2 },
      { year: 2023, show: "The Bear", network: "FX/Hulu", wonSeason: 1 },
      { year: 2024, show: "Hacks", network: "Max", wonSeason: 3 },
      { year: 2025, show: "The Studio", network: "Apple TV+", wonSeason: 1 },
    ],
  },
  {
    id: "limited",
    name: "Best Limited Series",
    short: "Limited",
    note: "Scoped to 2010-present. In 2012 and 2013 the Emmy for this category was combined with TV Movie and went to a film (Game Change, Behind the Candelabra) — see the TV Movie tab for those years.",
    winners: [
      { year: 2010, show: "The Pacific", network: "HBO" },
      { year: 2011, show: "Downton Abbey", network: "PBS", wonSeason: 1 },
      { year: 2014, show: "Fargo", network: "FX", wonSeason: 1 },
      { year: 2015, show: "Olive Kitteridge", network: "HBO" },
      { year: 2016, show: "The People v. O.J. Simpson: American Crime Story", network: "FX", seasonsKey: "American Crime Story", wonSeason: 1 },
      { year: 2017, show: "Big Little Lies", network: "HBO", wonSeason: 1 },
      { year: 2018, show: "The Assassination of Gianni Versace: American Crime Story", network: "FX", seasonsKey: "American Crime Story", wonSeason: 2 },
      { year: 2019, show: "Chernobyl", network: "HBO" },
      { year: 2020, show: "Watchmen", network: "HBO" },
      { year: 2021, show: "The Queen's Gambit", network: "Netflix" },
      { year: 2022, show: "The White Lotus", network: "HBO", wonSeason: 1 },
      { year: 2023, show: "Beef", network: "Netflix" },
      { year: 2024, show: "Baby Reindeer", network: "Netflix" },
      { year: 2025, show: "Adolescence", network: "Netflix" },
    ],
  },
  {
    id: "tvmovie",
    name: "Best TV Movie",
    short: "TV Movie",
    note: "Full history back to 1966 (the earliest year with a winner). TV movies are checked off as a single watch — no season/episode breakdown.",
    winners: [
      { year: 1966, show: "Ages of Man", network: "" },
      { year: 1967, show: "Death of a Salesman", network: "" },
      { year: 1968, show: "Elizabeth the Queen", network: "" },
      { year: 1969, show: "Teacher, Teacher", network: "" },
      { year: 1970, show: "A Storm in Summer", network: "" },
      { year: 1971, show: "The Andersonville Trial", network: "PBS" },
      { year: 1972, show: "Brian's Song", network: "ABC" },
      { year: 1973, show: "A War of Children", network: "CBS" },
      { year: 1974, show: "The Autobiography of Miss Jane Pittman", network: "CBS" },
      { year: 1975, show: "The Law", network: "NBC" },
      { year: 1976, show: "Eleanor and Franklin", network: "ABC" },
      { year: 1977, show: "Eleanor and Franklin: The White House Years", network: "ABC" },
      { year: 1977, show: "Sybil", network: "NBC" },
      { year: 1978, show: "The Gathering", network: "ABC" },
      { year: 1979, show: "Friendly Fire", network: "ABC" },
      { year: 1980, show: "The Miracle Worker", network: "NBC" },
      { year: 1981, show: "Playing for Time", network: "CBS" },
      { year: 1982, show: "A Woman Called Golda", network: "" },
      { year: 1983, show: "Special Bulletin", network: "NBC" },
      { year: 1984, show: "Something About Amelia", network: "ABC" },
      { year: 1985, show: "Do You Remember Love", network: "CBS" },
      { year: 1986, show: "Love Is Never Silent", network: "NBC" },
      { year: 1987, show: "Promise", network: "CBS" },
      { year: 1988, show: "Inherit the Wind", network: "NBC" },
      { year: 1989, show: "Day One", network: "CBS" },
      { year: 1989, show: "Roe vs. Wade", network: "NBC" },
      { year: 1990, show: "Caroline?", network: "CBS" },
      { year: 1990, show: "The Incident", network: "CBS" },
      { year: 1992, show: "Miss Rose White", network: "NBC" },
      { year: 1993, show: "Barbarians at the Gate", network: "HBO" },
      { year: 1993, show: "Stalin", network: "HBO" },
      { year: 1994, show: "And the Band Played On", network: "HBO" },
      { year: 1995, show: "Indictment: The McMartin Trial", network: "HBO" },
      { year: 1996, show: "Truman", network: "HBO" },
      { year: 1997, show: "Miss Evers' Boys", network: "HBO" },
      { year: 1998, show: "Don King: Only in America", network: "HBO" },
      { year: 1999, show: "A Lesson Before Dying", network: "HBO" },
      { year: 2000, show: "Tuesdays with Morrie", network: "ABC" },
      { year: 2001, show: "Wit", network: "HBO" },
      { year: 2002, show: "The Gathering Storm", network: "HBO" },
      { year: 2003, show: "Door to Door", network: "TNT" },
      { year: 2004, show: "Something the Lord Made", network: "HBO" },
      { year: 2005, show: "Warm Springs", network: "HBO" },
      { year: 2006, show: "The Girl in the Café", network: "HBO" },
      { year: 2007, show: "Bury My Heart at Wounded Knee", network: "HBO" },
      { year: 2008, show: "Recount", network: "HBO" },
      { year: 2009, show: "Grey Gardens", network: "HBO" },
      { year: 2010, show: "Temple Grandin", network: "HBO" },
      { year: 2012, show: "Game Change", network: "HBO" },
      { year: 2013, show: "Behind the Candelabra", network: "HBO" },
      { year: 2014, show: "The Normal Heart", network: "HBO" },
      { year: 2015, show: "Bessie", network: "HBO" },
      { year: 2016, show: "Sherlock: The Abominable Bride", network: "PBS", seasonsKey: "Sherlock" },
      { year: 2017, show: "Black Mirror: San Junipero", network: "Netflix", seasonsKey: "Black Mirror", wonSeason: 3 },
      { year: 2018, show: "Black Mirror: USS Callister", network: "Netflix", seasonsKey: "Black Mirror", wonSeason: 4 },
      { year: 2019, show: "Black Mirror: Bandersnatch", network: "Netflix", seasonsKey: "Black Mirror" },
      { year: 2020, show: "Bad Education", network: "HBO" },
      { year: 2021, show: "Dolly Parton's Christmas on the Square", network: "Netflix" },
      { year: 2022, show: "Chip 'n Dale: Rescue Rangers", network: "Disney+" },
      { year: 2023, show: "Weird: The Al Yankovic Story", network: "Roku" },
      { year: 2024, show: "Quiz Lady", network: "Hulu" },
      { year: 2025, show: "Rebel Ridge", network: "Netflix" },
    ],
  },
];

// SHOW_SEASONS: per-show episode counts, one array entry per season, in
// order, covering the show's ENTIRE run (not just the winning season),
// through whatever has aired as of this writing. Keyed by the exact
// "show" string used above. See README for confidence notes.
const SHOW_SEASONS = {
  "The Sopranos": [13, 13, 13, 13, 13, 21],
  "Mad Men": [13, 13, 13, 13, 13, 13, 14],
  "Homeland": [12, 12, 12, 12, 12, 12, 12, 12],
  "Breaking Bad": [7, 13, 13, 13, 16],
  "Game of Thrones": [10, 10, 10, 10, 10, 10, 7, 6],
  "The Handmaid's Tale": [10, 13, 13, 10, 10, 10],
  "Succession": [10, 10, 9, 10],
  "The Crown": [10, 10, 10, 10, 10, 10],
  "Shōgun": [10],
  "The Pitt": [15, 15],

  "Cheers": [22, 22, 25, 26, 26, 25, 22, 26, 26, 25, 28],
  "Seinfeld": [5, 12, 13, 24, 22, 24, 24, 22, 24],
  "Frasier": [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
  "Modern Family": [24, 24, 24, 24, 24, 24, 22, 22, 22, 22, 18],
  "Veep": [8, 10, 10, 10, 10, 10, 7],
  "The Marvelous Mrs. Maisel": [8, 10, 8, 8, 9],
  "Fleabag": [6, 6],
  "Schitt's Creek": [13, 13, 13, 12, 14, 14],
  "Ted Lasso": [10, 12, 12, 10], // S4 premiered Aug 2026, weekly through Oct 2026
  "The Bear": [8, 10, 10, 10],
  "Hacks": [10, 8, 9, 10, 10],
  "The Studio": [10],

  "Downton Abbey": [7, 8, 7, 8, 8, 8],
  "Fargo": [10, 10, 10, 11, 10],
  "Big Little Lies": [7, 7],
  "The White Lotus": [6, 7, 8],
  // Shared by both American Crime Story winning entries (2016, 2018) via
  // their "seasonsKey" — S1 The People v. O.J. Simpson, S2 The
  // Assassination of Gianni Versace, S3 Impeachment (2021, did not win
  // an Emmy but is included so the franchise's full run is trackable).
  "American Crime Story": [10, 9, 10],
  "The Pacific": [10],
  "Olive Kitteridge": [4],
  "Chernobyl": [5],
  "The Queen's Gambit": [7],
  "Beef": [10, 8],
  "Baby Reindeer": [7],
  "Adolescence": [4],
  "Watchmen": [9],

  // Shown under Best TV Movie even though these are full returning
  // series — the winning entry was a movie-length special/episode, but
  // "if a show won, show all seasons" applies just as much here.
  "Sherlock": [3, 3, 3, 3], // 4 series of 3 feature-length episodes each
  // "San Junipero" is S3E4, "USS Callister" is S4E1 — both regular
  // episodes, so they live inside the season grid below rather than
  // Movies & Extras.
  "Black Mirror": [3, 3, 6, 6, 3, 5, 6],
};

// SHOW_MOVIES: tie-in feature films and standalone bonus episodes
// connected to a show (prequels, sequels, revivals, surprise specials)
// — checked separately from episodes, since they don't belong to any
// numbered season. Only real, released titles go here; every other show
// in the checklist was checked and has none. Keyed by the same "show"
// string used above. "note" (optional) surfaces viewing-order guidance
// in the UI.
const SHOW_MOVIES = {
  "The Sopranos": [{ title: "The Many Saints of Newark", year: 2021 }],
  "Breaking Bad": [{ title: "El Camino: A Breaking Bad Movie", year: 2019 }],
  "Downton Abbey": [
    { title: "Downton Abbey", year: 2019 },
    { title: "Downton Abbey: A New Era", year: 2022 },
    { title: "Downton Abbey: The Grand Finale", year: 2025 },
  ],
  "The Bear": [
    {
      title: "Gary",
      year: 2026,
      note: "Standalone bonus episode (Hulu/FX), not a numbered season episode. Story-wise it follows S2's \"Fishes\" flashback; watch anytime after Season 2 — it's skippable and has little bearing on Season 5.",
    },
  ],
  "Sherlock": [
    {
      title: "Sherlock: The Abominable Bride",
      year: 2016,
      note: "The actual Emmy-winning TV movie — a 90-minute standalone special, not part of the numbered series. Aired between Series 3 and Series 4; watch it after Series 3.",
    },
  ],
  "Black Mirror": [
    {
      title: "Black Mirror: Bandersnatch",
      year: 2018,
      note: "The Emmy-winning TV movie — a standalone interactive film, not part of the numbered series (it was meant for Series 5 before being split off and released first). Pulled from Netflix in May 2025 when its interactive format was discontinued, so it isn't currently streamable anywhere.",
    },
  ],
};
