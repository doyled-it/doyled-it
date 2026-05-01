const ENDPOINT = "https://ws.audioscrobbler.com/2.0/";

export function parseRecentListens(payload) {
  const tracks = payload?.recenttracks?.track ?? [];
  const completed = tracks.find((t) => !t["@attr"]?.nowplaying);
  if (!completed) return null;
  return {
    artist: completed.artist?.["#text"] ?? completed.artist?.name ?? "unknown",
    track: completed.name,
    playedAtUts: Number(completed.date?.uts ?? 0),
  };
}

export function parseTopArtist(payload) {
  const artists = payload?.topartists?.artist ?? [];
  const top = artists[0];
  if (!top) return null;
  return {
    name: top.name,
    playcount: Number(top.playcount ?? 0),
  };
}

export async function fetchRecentListens({ user, apiKey, fetcher = fetch }) {
  const url = `${ENDPOINT}?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${apiKey}&format=json&limit=5`;
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`lastfm recent: ${res.status}`);
  return parseRecentListens(await res.json());
}

export async function fetchTopArtist({ user, apiKey, fetcher = fetch }) {
  const url = `${ENDPOINT}?method=user.gettopartists&user=${encodeURIComponent(user)}&period=7day&api_key=${apiKey}&format=json&limit=1`;
  const res = await fetcher(url);
  if (!res.ok) throw new Error(`lastfm top: ${res.status}`);
  return parseTopArtist(await res.json());
}
