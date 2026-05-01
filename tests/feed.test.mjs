import { test } from "node:test";
import assert from "node:assert/strict";
import { latestPosts } from "../scripts/feed.mjs";

const fixture = {
  items: [
    { title: "First Post",  link: "https://doyled-it.com/words/first/",  isoDate: "2026-04-22T00:00:00Z" },
    { title: "Second Post", link: "https://doyled-it.com/words/second/", isoDate: "2026-03-30T00:00:00Z" },
    { title: "Third Post",  link: "https://doyled-it.com/words/third/",  isoDate: "2026-02-10T00:00:00Z" },
  ],
};

test("latestPosts returns the first n items in the parsed feed", () => {
  const out = latestPosts(fixture, 2);
  assert.equal(out.length, 2);
  assert.equal(out[0].title, "First Post");
  assert.equal(out[1].title, "Second Post");
  assert.equal(out[0].link, "https://doyled-it.com/words/first/");
  assert.equal(out[0].isoDate, "2026-04-22T00:00:00Z");
});

test("latestPosts handles fewer items than requested", () => {
  const out = latestPosts({ items: fixture.items.slice(0, 1) }, 5);
  assert.equal(out.length, 1);
});

test("latestPosts handles empty feed", () => {
  assert.deepEqual(latestPosts({ items: [] }, 2), []);
  assert.deepEqual(latestPosts({}, 2), []);
});
