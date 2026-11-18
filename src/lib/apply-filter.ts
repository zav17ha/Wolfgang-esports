import { type Application, gamesOf } from "./apply";

/** Filters used by both the admin list and the CSV export, so the download matches what's on screen. */
export function filterApplications(apps: Application[], { type, game }: { type?: string; game?: string }) {
  return apps.filter((a) => (!type || a.type === type) && (!game || gamesOf(a).some((g) => g.game === game)));
}
