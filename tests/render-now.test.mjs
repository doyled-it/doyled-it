import { test } from "node:test";
import assert from "node:assert/strict";
import { renderNowWritingSvg, renderNowListeningSvg } from "../scripts/render-now.mjs";

const NOW = new Date("2026-05-01T12:00:00Z");

test("renderNowWritingSvg renders posts with title and date", () => {
  const svg = renderNowWritingSvg({
    posts: [
      { title: "First", link: "https://doyled-it.com/words/first/", isoDate: "2026-04-22T00:00:00Z" },
      { title: "Second", link: "https://doyled-it.com/words/second/", isoDate: "2026-03-30T00:00:00Z" },
    ],
    now: NOW,
  });
  assert.match(svg, /<svg[^>]+viewBox="0 0 430 180"/, "uses standard 430x180 canvas");
  assert.match(svg, /▸ now writing/, "titlebar present");
  assert.match(svg, /refreshed 2026-05-01/, "refresh date in titlebar");
  assert.match(svg, /First/, "first post title");
  assert.match(svg, /2026-04-22/, "first post date");
  assert.match(svg, /Second/, "second post title");
  assert.match(svg, /2026-03-30/, "second post date");
  assert.match(svg, /↗ \/words/, "footer link hint");
});

test("renderNowWritingSvg empty state", () => {
  const svg = renderNowWritingSvg({ posts: [], now: NOW });
  assert.match(svg, /no posts yet/i);
  assert.match(svg, /↗ \/words/);
});

test("renderNowListeningSvg renders current listen + top artist", () => {
  const svg = renderNowListeningSvg({
    listen: { artist: "Phoebe Bridgers", track: "Punisher", playedAtUts: 1730000000 },
    topArtist: { name: "boygenius", playcount: 37 },
    now: NOW,
  });
  assert.match(svg, /▸ now listening/);
  assert.match(svg, /refreshed 2026-05-01/);
  assert.match(svg, /Phoebe Bridgers/);
  assert.match(svg, /Punisher/);
  assert.match(svg, /boygenius/);
  assert.match(svg, /37 plays/);
  assert.match(svg, /↗ \/music/);
});

test("renderNowListeningSvg empty state", () => {
  const svg = renderNowListeningSvg({ listen: null, topArtist: null, now: NOW });
  assert.match(svg, /no recent listens/i);
  assert.match(svg, /↗ \/music/);
});
