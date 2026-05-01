import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { fetchFeed, latestPosts } from "./feed.mjs";
import { fetchRecentListens, fetchTopArtist } from "./lastfm.mjs";
import { renderNowWritingSvg, renderNowListeningSvg } from "./render-now.mjs";

const FEED_URL = "https://doyled-it.com/feed.xml";

async function main() {
  const apiKey = process.env.LASTFM_API_KEY;
  const user   = process.env.LASTFM_USER;
  if (!apiKey || !user) {
    console.error("LASTFM_API_KEY and LASTFM_USER are required");
    process.exit(1);
  }

  const here          = path.dirname(fileURLToPath(import.meta.url));
  const writingPath   = path.resolve(here, "..", "assets", "now-writing.svg");
  const listeningPath = path.resolve(here, "..", "assets", "now-listening.svg");
  const dataPath      = path.resolve(here, "..", "data", "now.json");

  // Fetch all sources in parallel; tolerate individual failures.
  const settled = await Promise.allSettled([
    fetchFeed(FEED_URL),
    fetchRecentListens({ user, apiKey }),
    fetchTopArtist({ user, apiKey }),
  ]);

  const [feedResult, listenResult, topResult] = settled;

  // Hard-fail (exit 0, no commit) only if EVERY source failed.
  if (settled.every((s) => s.status === "rejected")) {
    console.error("all data sources failed:", settled.map((s) => s.reason).join("; "));
    process.exit(0);
  }

  const posts = feedResult.status === "fulfilled"
    ? latestPosts(feedResult.value, 2)
    : [];
  const listen    = listenResult.status === "fulfilled" ? listenResult.value : null;
  const topArtist = topResult.status === "fulfilled" ? topResult.value : null;

  const now = new Date();
  const writingSvg   = renderNowWritingSvg({ posts, now });
  const listeningSvg = renderNowListeningSvg({ listen, topArtist, now });

  writeFileSync(writingPath,   writingSvg + "\n", "utf8");
  writeFileSync(listeningPath, listeningSvg + "\n", "utf8");

  // Make sure data/ exists (gitkeeped already, but defensive).
  mkdirSync(path.dirname(dataPath), { recursive: true });
  writeFileSync(
    dataPath,
    JSON.stringify({
      posts,
      listen,
      topArtist,
      updatedAt: now.toISOString(),
    }, null, 2) + "\n",
    "utf8",
  );

  console.log("now block updated");
}

main().catch((err) => { console.error(err); process.exit(1); });
