import Parser from "rss-parser";

export function latestPosts(parsedFeed, n) {
  const items = parsedFeed?.items ?? [];
  return items.slice(0, n).map((it) => ({
    title: it.title,
    link: it.link,
    isoDate: it.isoDate,
  }));
}

export async function fetchFeed(url, { fetcher = fetch } = {}) {
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`feed fetch: ${res.status}`);
  const xml = await res.text();
  const parser = new Parser();
  return parser.parseString(xml);
}
