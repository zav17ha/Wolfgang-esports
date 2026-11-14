/**
 * Wolfgang e-Sports — achievements.
 * Every result here was won by a former Wolfgang roster or player.
 * Edit this list to add or correct results; counters and pages update automatically.
 *
 *   place:  1 | 2 | 3 | 4 | 8 ... | "F" finalist | "Q" notable run | "H" honour
 *   source: "news" (reported by Gamer.LK / Daily FT) or "org" (Wolfgang's own posts)
 *   featured: shown in the home page trophy cabinet (first six)
 */

export type GameKey = "pubgm" | "valorant" | "codm" | "dota2" | "mlbb" | "freefire" | "r6" | "fgc" | "aov" | "other";
export type Place = number | "F" | "Q" | "H";

export interface Achievement {
  event: string;
  game: GameKey;
  place: Place;
  team: string;
  year: number | null;
  note?: string;
  source: "news" | "org";
  featured?: boolean;
}

export const GAMES: Record<GameKey, string> = {
  pubgm: "PUBG Mobile",
  valorant: "Valorant",
  codm: "COD Mobile",
  dota2: "Dota 2",
  mlbb: "Mobile Legends",
  freefire: "Free Fire",
  r6: "Rainbow Six Siege",
  fgc: "Fighting Games",
  aov: "Arena of Valor",
  other: "Other",
};

export const ACHIEVEMENTS: Achievement[] = [
  /* ---------- PUBG Mobile ---------- */
  { event: "Red Bull M.E.O Season 3 — Sri Lanka Finals", game: "pubgm", place: 1, team: "WG Born 2 Rush (B2R)", year: 2020, note: "Won against 24 of the best teams in the country to qualify for the World Finals.", source: "news", featured: true },
  { event: "Red Bull M.E.O Season 3 — World Finals East", game: "pubgm", place: 8, team: "WG Born 2 Rush (B2R)", year: 2021, note: "Represented Sri Lanka. Rs. 175,000 prize money. Roster: Gudda, Pixie, Cupid, GUCCI, The PRESIDENT.", source: "news" },
  { event: "Red Bull M.E.O Season 4 — Sri Lanka", game: "pubgm", place: 1, team: "WG NRC Esports", year: 2021, note: "2 chicken dinners and 30 kills in the Grand Finals; qualified for the Red Bull Asian Finals.", source: "org", featured: true },
  { event: "Dialog Axita Game Hero Season 3", game: "pubgm", place: 1, team: "NRC Esports", year: null, note: "National champions. US$65,000 prize pool.", source: "org", featured: true },
  { event: "National Esports Championship — PUBG Mobile", game: "pubgm", place: 1, team: "NRC Esports", year: null, note: "Moved from 2nd on day one to 1st on the final day (89 pts after day two).", source: "org" },
  { event: "Sri Lanka Pro League — Grand Finals", game: "pubgm", place: 1, team: "bd×NRC", year: null, note: "", source: "org" },
  { event: "P&S PUBG Mobile Series — Grand Finals", game: "pubgm", place: 1, team: "WG NRC", year: null, note: "Perera & Sons series. WG Infinity Club finished 3rd in the same final.", source: "org" },
  { event: "P&S PUBG Mobile Series — Grand Finals", game: "pubgm", place: 3, team: "WG Infinity Club", year: null, note: "", source: "org" },
  { event: "P&S PUBG Mobile Series (2nd edition)", game: "pubgm", place: 3, team: "Wolfgang Esports Bullet Track", year: 2022, note: "Co-hosted by Gamer.LK.", source: "news" },
  { event: "Codashop Global Series — Sri Lanka", game: "pubgm", place: 1, team: "WG NRC Esports", year: null, note: "LKR 70,000 prize winnings.", source: "org", featured: true },
  { event: "Codashop Global Series — Sri Lanka", game: "pubgm", place: 1, team: "WG Bullet Track", year: null, note: "LKR 100,000 prize pool. Back-to-back tournament wins.", source: "org" },
  { event: "Codashop Global Series — Sri Lanka", game: "pubgm", place: 2, team: "WG NRC Infinity Club", year: null, note: "WG NRC Esports finished 3rd in the same edition.", source: "org" },
  { event: "Codashop Global Series — Sri Lanka", game: "pubgm", place: 3, team: "WG NRC Esports", year: null, note: "", source: "org" },
  { event: "Pro Championship Sri Lanka 2022", game: "pubgm", place: 2, team: "Wolfgang PUBG Mobile", year: 2022, note: "LKR 1,000,000 prize pool.", source: "org" },
  { event: "TBS PUBG Mobile Series '21", game: "pubgm", place: 1, team: "NRC Esports", year: 2021, note: "57 kills and 2 chicken dinners across 6 matches.", source: "org" },
  { event: "TEPA Invitational Championship", game: "pubgm", place: 1, team: "Team NRC", year: null, note: "", source: "org" },
  { event: "PMDS Series Season 4", game: "pubgm", place: 1, team: "NRC Esports", year: null, note: "LKR 20,000 prize pool.", source: "org" },
  { event: "Ultimate PUBG Tournament (BAE Squad)", game: "pubgm", place: 1, team: "NRC Esports", year: null, note: "WG FT Esports finished 3rd.", source: "org" },
  { event: "BAE Squad Tournament", game: "pubgm", place: 1, team: "WG Bullet Track", year: null, note: "", source: "org" },
  { event: "Dynami Raid 2021", game: "pubgm", place: 1, team: "WG Born 2 Rush (B2R)", year: 2021, note: "Hosted by Iron Side Gaming. Most kills and most placement points.", source: "org" },
  { event: "Grand Slam 2020", game: "pubgm", place: 1, team: "WG Team X9", year: 2020, note: "Hosted by Rusiya Streaming. WG Born 2 Rush finished 2nd.", source: "org" },
  { event: "Grand Slam 2020", game: "pubgm", place: 2, team: "WG Born 2 Rush (B2R)", year: 2020, note: "", source: "org" },
  { event: "Agent 47 Knockout Championship", game: "pubgm", place: 1, team: "WG Raven Force", year: null, note: "Organised by Alpha eSports. 100 teams, 400 players. LKR 20,000.", source: "org" },
  { event: "Agent 47 Knockout Championship", game: "pubgm", place: 2, team: "WG Born to Rush", year: null, note: "LKR 10,000. WG No Rules finished 4th.", source: "org" },
  { event: "Agent 47 Knockout Championship", game: "pubgm", place: 4, team: "WG No Rules", year: null, note: "", source: "org" },
  { event: "Maximum Ladders 2020", game: "pubgm", place: 1, team: "WG No Rules", year: 2020, note: "", source: "org" },
  { event: "Xplicit Mobile Tournament 2020", game: "pubgm", place: 1, team: "Team Bravo (WG | D-Cent Gaming)", year: 2020, note: "Organised by the Prefects' Guild of Alethea Group of Schools.", source: "org" },
  { event: "Rotaract Club of IIT PUBG Tournament", game: "pubgm", place: 1, team: "WG Team ONYX", year: null, note: "", source: "org" },
  { event: "Luxury Esports Odyssey 2022", game: "pubgm", place: 1, team: "M1 Esports", year: 2022, note: "LKR 50,000 prize pool. One Man Army finished 2nd.", source: "org" },
  { event: "Luxury Esports Odyssey 2022", game: "pubgm", place: 2, team: "One Man Army", year: 2022, note: "", source: "org" },
  { event: "Battle of Lions", game: "pubgm", place: "F", team: "M1, One Man Army, NRC, Bullet Track, DaxTGR", year: null, note: "LKR 1,000,000 prize pool.", source: "org" },
  { event: "Red Bull Fight or Flight", game: "pubgm", place: 2, team: "WG X-HOUSE", year: null, note: "Organised by Gamer.LK and Red Bull. WG 24K GOLD finished 3rd.", source: "org" },
  { event: "Red Bull Fight or Flight", game: "pubgm", place: 3, team: "WG 24K GOLD", year: null, note: "", source: "org" },
  { event: "Red Bull Fight or Flight 2021", game: "pubgm", place: 3, team: "WG NRC Esports", year: 2021, note: "", source: "org" },
  { event: "BattleGrounds PUBG Mobile Tournament", game: "pubgm", place: 2, team: "WG No Rules", year: null, note: "Organised by Phoenix Gaming. WG No Rules Infinity Club finished 3rd.", source: "org" },
  { event: "BattleGrounds PUBG Mobile Tournament", game: "pubgm", place: 3, team: "WG No Rules Infinity Club", year: null, note: "", source: "org" },
  { event: "Infinity Premier League 2021", game: "pubgm", place: 2, team: "WG NRC Infinity Club", year: 2021, note: "", source: "org" },
  { event: "SLCC Grand Finals", game: "pubgm", place: 2, team: "bd NRC", year: null, note: "", source: "org" },
  { event: "Champions League", game: "pubgm", place: 2, team: "BD NRC", year: null, note: "", source: "org" },
  { event: "RGC Crew Challenge 2021", game: "pubgm", place: 3, team: "WG FearNoOne", year: 2021, note: "", source: "org" },
  { event: "Fantastic Elite League", game: "pubgm", place: 3, team: "WG Bullet Track", year: null, note: "Top fragger: BTXSCOUT, 28 kills.", source: "org" },
  { event: "Dell Singer Online Esports Showdown 2021 — PUBG Mobile Squad", game: "pubgm", place: 3, team: "WG NRC Esports", year: 2021, note: "", source: "news" },
  { event: "PMCO South Asia Wildcard", game: "pubgm", place: "Q", team: "Wolfgang NRC Esports", year: 2021, note: "6th in the group stage (112 pts) to reach the Grand Finals.", source: "news" },
  { event: "PMPL South Asia Qualifiers 2022", game: "pubgm", place: "Q", team: "Wolfgang PUBG Mobile", year: 2022, note: "Invited.", source: "org" },
  { event: "PMFL", game: "pubgm", place: "F", team: "WG Team X9", year: null, note: "US$2,500 prize pool.", source: "org" },
  { event: "Unix Tournament Series", game: "pubgm", place: "F", team: "WG Bullet Track & WG NRC Esports", year: null, note: "LKR 50,000 prize pool.", source: "org" },
  { event: "#01 PUBG Mobile Team in Sri Lanka 2020/21", game: "pubgm", place: "H", team: "WG NRC Esports", year: 2021, note: "12 titles, 2 runner-up and 3 third-place finishes in the season.", source: "org" },
  { event: "Women's PUBG Mobile Solo", game: "pubgm", place: 2, team: "WG ThaNu", year: 2020, note: "", source: "news" },

  /* ---------- Valorant ---------- */
  { event: "Logitech G Valorant Pro League 2021", game: "valorant", place: 1, team: "Team Wolfgang", year: 2022, note: "First-ever champions; beat Noob Alliance in the semi-final and Union Gaming in the final. LiNo, SCR1M, 1KAPUMBA, Chromnz, Gensh1, Dopie.", source: "news", featured: true },
  { event: "Logitech G Play 2 Win Series S3 — Division B", game: "valorant", place: 1, team: "Wolfgang Mist'Walkers", year: null, note: "87 teams. Unbeaten 7–0 bracket run.", source: "org" },
  { event: "Logitech G Play 2 Win Series S3 — Division A", game: "valorant", place: 3, team: "Wolfgang Mist'Walkers", year: null, note: "", source: "org" },
  { event: "Logitech G Play to Win Valorant Series", game: "valorant", place: 3, team: "Wolfgang Gunslingers", year: null, note: "Won the 3rd-place match 13–5 on Bind.", source: "org" },
  { event: "Dell Singer Online Esports Showdown 2021 — Valorant", game: "valorant", place: 1, team: "WG GunSlingerS", year: 2021, note: "", source: "news" },
  { event: "SLESA Invitational (World Connected Series)", game: "valorant", place: 3, team: "Wolfgang", year: 2020, note: "Lost the semi 15–13 in overtime, then beat Union Gaming.", source: "news" },
  { event: "DOD Valorant Championship", game: "valorant", place: 3, team: "Wolfgang Mist Walkers", year: null, note: "", source: "org" },
  { event: "MSI Dome of Dragons", game: "valorant", place: "F", team: "Wolfgang Mist Walkers", year: null, note: "", source: "org" },
  { event: "Samsung Members Challenge S3 Part 2", game: "valorant", place: "F", team: "Wolfgang Gunslingers", year: null, note: "Grand Final vs Union Gaming. Wolfgang Lightning Pandas reached the 3rd-place match.", source: "org" },
  { event: "Ewar Valorant Series 2021", game: "valorant", place: "Q", team: "Wolfgang Mist'Walkers + 1 team", year: 2021, note: "Two Wolfgang teams reached the semi-finals. Hosted by MoraSpirit.", source: "org" },

  /* ---------- COD Mobile ---------- */
  { event: "SLESA Invitational (World Connected Series)", game: "codm", place: 2, team: "Wolfgang", year: 2020, note: "Lost the best-of-3 final to Noob Alliance.", source: "news" },
  { event: "Dell Singer Online Esports Showdown 2021 — COD Mobile 5v5", game: "codm", place: 3, team: "WG YounAmeUs", year: 2021, note: "", source: "news" },

  /* ---------- Dota 2 ---------- */
  { event: "Recalled Dota 2 Community Cup Season 1", game: "dota2", place: 1, team: "WG Aathal Gaming", year: null, note: "6–1 record; came back through the lower bracket and won the grand final 2–0.", source: "org", featured: true },
  { event: "Dell Singer Online Esports Showdown 2021 — Dota 2", game: "dota2", place: 3, team: "WG Aathal Gaming", year: 2021, note: "", source: "news" },

  /* ---------- Mobile Legends ---------- */
  { event: "Samsung Members Challenge — Mobile Legends", game: "mlbb", place: 2, team: "WG IDK Gaming", year: null, note: "Best-of-3 Grand Final.", source: "org" },
  { event: "Dell Singer Online Esports Showdown 2021 — Mobile Legends", game: "mlbb", place: 2, team: "WG IDK GAMING", year: 2021, note: "", source: "news" },

  /* ---------- Free Fire ---------- */
  { event: "Dialog All Island Free Fire Championship", game: "freefire", place: 2, team: "Wolfgang Free Fire", year: null, note: "", source: "org" },
  { event: "P&S Free Fire Series", game: "freefire", place: 2, team: "The Infinity Fam", year: null, note: "LKR 50,000 prize pool.", source: "org" },

  /* ---------- Fighting games / National Esports ---------- */
  { event: "National Esports — Tekken 7", game: "fgc", place: 1, team: "WG Veko Stam", year: null, note: "Clean sweep: WG Cetro25 2nd, WG War Pemguin 3rd.", source: "org", featured: true },
  { event: "National Esports — Street Fighter V", game: "fgc", place: 1, team: "Raging Chicky", year: null, note: "Clean sweep: Vekostan 2nd, Lunatic 3rd.", source: "org" },
  { event: "ICBT Game Fest '17 — Mortal Kombat X", game: "fgc", place: 1, team: "Isura", year: 2017, note: "The runner-up was also from Wolfgang.", source: "org" },
  { event: "National Esports — Arena of Valor", game: "aov", place: 1, team: "Wrecking Wolves", year: null, note: "Clean sweep: Republic 2nd, Raptor 3rd.", source: "org" },

  /* ---------- Rainbow Six ---------- */
  { event: "Logitech Play to Win — Rainbow Six Siege", game: "r6", place: 4, team: "Team Nexus", year: null, note: "Hosted by Gamer.LK. WoFy, RECO, Maaraya, HypEr, L4ZeR.", source: "org" },

  /* ---------- Other ---------- */
  { event: "Hunting Grounds 2019", game: "other", place: 1, team: "Team Matto", year: 2019, note: "", source: "org" },
  { event: "Women's Cyber Games Online 2021 — Mario Kart", game: "other", place: 3, team: "Natasha Savi", year: 2021, note: "Hosted by Gamer.LK.", source: "org" },
  { event: "Dell Singer Online Esports Showdown 2021 — Clan Performance (PC/Console)", game: "other", place: 3, team: "Wolfgang e-Sports", year: 2021, note: "Also 3rd for clan participation.", source: "news" }
];

export function placeLabel(p: Place): string {
  const map: Record<string, string> = { "1": "Champions", "2": "2nd Place", "3": "3rd Place", "4": "4th Place", F: "Finalist", Q: "Notable run", H: "Honour" };
  return map[String(p)] ?? (typeof p === "number" ? `${p}th Place` : String(p));
}

export function placeRank(p: Place): number {
  if (typeof p === "number") return p;
  return ({ H: 3.5, F: 4.5, Q: 9 } as Record<string, number>)[p] ?? 10;
}

export const isTitle = (a: Achievement) => a.place === 1;
export const isPodium = (a: Achievement) => a.place === 1 || a.place === 2 || a.place === 3;

export function stats() {
  const games = new Set(ACHIEVEMENTS.filter((a) => a.game !== "other").map((a) => a.game));
  return {
    titles: ACHIEVEMENTS.filter(isTitle).length,
    second: ACHIEVEMENTS.filter((a) => a.place === 2).length,
    third: ACHIEVEMENTS.filter((a) => a.place === 3).length,
    podiums: ACHIEVEMENTS.filter(isPodium).length,
    games: games.size,
  };
}

export function gameStats(game: GameKey) {
  const list = ACHIEVEMENTS.filter((a) => a.game === game);
  return { titles: list.filter(isTitle).length, podiums: list.filter(isPodium).length };
}
