import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRecentListens, parseTopArtist } from "../scripts/lastfm.mjs";

test("parseRecentListens returns the most recent non-now-playing track", () => {
  const fixture = {
    recenttracks: {
      track: [
        { artist: { "#text": "Boygenius" }, name: "Not Strong Enough", date: { uts: "1730000000" }, "@attr": { nowplaying: "true" } },
        { artist: { "#text": "Phoebe Bridgers" }, name: "Punisher", date: { uts: "1729990000" } },
      ],
    },
  };
  const result = parseRecentListens(fixture);
  assert.equal(result.artist, "Phoebe Bridgers");
  assert.equal(result.track, "Punisher");
  assert.equal(result.playedAtUts, 1729990000);
});

test("parseRecentListens returns null on empty payload", () => {
  assert.equal(parseRecentListens({ recenttracks: { track: [] } }), null);
  assert.equal(parseRecentListens({}), null);
});

test("parseTopArtist returns name + playcount", () => {
  const fixture = {
    topartists: {
      artist: [
        { name: "boygenius", playcount: "37" },
        { name: "Phoebe Bridgers", playcount: "12" },
      ],
    },
  };
  const result = parseTopArtist(fixture);
  assert.equal(result.name, "boygenius");
  assert.equal(result.playcount, 37);
});

test("parseTopArtist returns null on empty payload", () => {
  assert.equal(parseTopArtist({ topartists: { artist: [] } }), null);
});
