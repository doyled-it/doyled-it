// Pure SVG renderers for the "now writing" and "now listening" cards.
// Both use the same 430×180 card chrome as the placeholder SVGs.

const FONT = `font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace"`;

/** Escape a string for safe interpolation into SVG text content/attribute values. */
function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Format a Date as YYYY-MM-DD (UTC). */
function isoDay(date) {
  return date instanceof Date
    ? date.toISOString().slice(0, 10)
    : new Date(date).toISOString().slice(0, 10);
}

/** Standard 430×180 card chrome. Returns opening SVG + chrome elements, content injected between. */
function cardChrome({ title, refreshDate, body, footer }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 180" width="430" height="180" ${FONT}>
  <rect x="6" y="6" width="418" height="170" fill="#2b1d12"/>
  <rect width="418" height="170" fill="#fbe9d7" stroke="#2b1d12" stroke-width="3"/>
  <rect width="418" height="26" fill="#2b1d12"/>
  <text x="14" y="19" font-size="12" fill="#fbe9d7" letter-spacing="1">▸ ${escape(title)}</text>
  <text x="408" y="19" font-size="9" fill="#fbe9d7" text-anchor="end" letter-spacing="0.5">refreshed ${escape(refreshDate)}</text>
${body}
  <text x="20" y="158" font-size="10" fill="#6b5840" letter-spacing="1">${escape(footer)}</text>
</svg>`;
}

/**
 * Render the "now writing" card SVG.
 *
 * Arguments:
 *   posts: Array of { title, link, isoDate } objects (most-recent first).
 *   now: Date representing the current moment (used for the refresh timestamp).
 *
 * Returns:
 *   Complete SVG string (no XML prolog).
 */
export function renderNowWritingSvg({ posts, now }) {
  const refreshDate = isoDay(now);

  let bodyLines = "";
  if (!posts || posts.length === 0) {
    bodyLines = `  <text x="20" y="62" font-size="13" fill="#6b5840" font-style="italic">(no posts yet)</text>`;
  } else {
    let y = 58;
    for (const post of posts) {
      const dateStr = isoDay(post.isoDate);
      bodyLines += `  <text x="20" y="${y}" font-size="13">`;
      bodyLines += `<tspan font-weight="700" fill="#1a4f8a">${escape(post.title)}</tspan>`;
      bodyLines += `<tspan fill="#2b1d12"> — </tspan>`;
      bodyLines += `<tspan fill="#6b5840" font-style="italic">${escape(dateStr)}</tspan>`;
      bodyLines += `</text>\n`;
      y += 22;
    }
  }

  return cardChrome({
    title: "now writing",
    refreshDate,
    body: bodyLines,
    footer: "↗ /words",
  });
}

/**
 * Format a "played N unit(s) ago" string given two timestamps in milliseconds.
 *
 * Arguments:
 *   nowMs: Current time in milliseconds.
 *   playedMs: Play time in milliseconds.
 *
 * Returns:
 *   Human-readable relative time string.
 */
function playedAgo(nowMs, playedMs) {
  const mins = Math.floor((nowMs - playedMs) / 60_000);
  if (mins < 60) {
    return `played ${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return `played ${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }
  const days = Math.floor(hours / 24);
  return `played ${days} ${days === 1 ? "day" : "days"} ago`;
}

/**
 * Render the "now listening" card SVG.
 *
 * Arguments:
 *   listen: Most recent listen { artist, track, playedAtUts } or null.
 *   topArtist: Top artist of the week { name, playcount } or null.
 *   now: Date representing the current moment.
 *
 * Returns:
 *   Complete SVG string (no XML prolog).
 */
export function renderNowListeningSvg({ listen, topArtist, now }) {
  const refreshDate = isoDay(now);
  const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();

  let bodyLines = "";

  if (!listen && !topArtist) {
    bodyLines = `  <text x="20" y="62" font-size="13" fill="#6b5840" font-style="italic">(no recent listens)</text>`;
  } else {
    if (listen) {
      const ago = playedAgo(nowMs, listen.playedAtUts * 1000);
      bodyLines += `  <text x="20" y="62" font-size="13">`;
      bodyLines += `<tspan font-weight="700" fill="#2b1d12">${escape(listen.artist)}</tspan>`;
      bodyLines += `<tspan fill="#2b1d12"> — </tspan>`;
      bodyLines += `<tspan fill="#2b1d12" font-style="italic">${escape(listen.track)}</tspan>`;
      bodyLines += `<tspan fill="#6b5840"> · ${escape(ago)}</tspan>`;
      bodyLines += `</text>\n`;
    }

    if (topArtist) {
      bodyLines += `  <text x="20" y="92" font-size="13">`;
      bodyLines += `<tspan fill="#6b5840" font-style="italic">top of the week: </tspan>`;
      bodyLines += `<tspan font-weight="700" fill="#2b1d12">${escape(topArtist.name)}</tspan>`;
      bodyLines += `<tspan fill="#6b5840"> (${escape(topArtist.playcount)} plays)</tspan>`;
      bodyLines += `</text>\n`;
    }
  }

  return cardChrome({
    title: "now listening",
    refreshDate,
    body: bodyLines,
    footer: "↗ /music",
  });
}
