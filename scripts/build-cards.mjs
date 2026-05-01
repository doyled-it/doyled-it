// Builds card SVGs for the GitHub profile README.
// Each section's link-bearing items become per-item mini cards (one SVG file each)
// that the README wraps in markdown links so every card is one click target.
//
// Output: assets/<name>.svg (one per card).
// Run via `npm run build:cards`.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const sprites = path.join(root, "assets", "sprites");
const out = path.join(root, "assets");

function dataUri(file) {
  const bytes = readFileSync(path.join(sprites, file));
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

const png = {
  baseball:    dataUri("baseball.png"),
  golfBag:     dataUri("golf-bag.png"),
  vinyl:       dataUri("vinyl.png"),
  archery:     dataUri("icon-archery.png"),
  python:      dataUri("logo-python.png"),
  typescript:  dataUri("logo-typescript.png"),
  claude:      dataUri("logo-claude.png"),
  langgraph:   dataUri("logo-langgraph.png"),
  cloudflare:  dataUri("logo-cloudflare.png"),
  agentView:   dataUri("icon-agent-view.png"),
  vault:       dataUri("icon-vault.png"),
  leftovers:   dataUri("icon-leftovers.png"),
  janus:       dataUri("icon-janus.png"),
  simfire:     dataUri("icon-simfire.png"),
  mac:         dataUri("icon-mac.png"),
  bubble:      dataUri("icon-bubble.png"),
  linkedin:    dataUri("icon-linkedin.png"),
  envelope:    dataUri("icon-envelope.png"),
};

const FONT = `font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace"`;
const PIX = `style="image-rendering:pixelated"`;

function chip(x, y, label, sprite) {
  return `
    <g transform="translate(${x},${y})">
      <rect x="3" y="3" width="180" height="140" fill="#2b1d12"/>
      <rect width="180" height="140" fill="#fff" stroke="#2b1d12" stroke-width="3"/>
      <image href="${sprite}" x="58" y="14" width="64" height="64" ${PIX}/>
      <text x="90" y="116" font-size="13" text-anchor="middle" fill="#2b1d12">${label}</text>
    </g>`;
}

const today = new Date().toISOString().slice(0, 10);

// === Hero (one big card, no per-chip linking) ===
const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 380" width="880" height="380" ${FONT}>
  <rect x="12" y="14" width="864" height="360" fill="#2b1d12"/>
  <rect x="4" y="6" width="864" height="360" fill="#fbe9d7" stroke="#2b1d12" stroke-width="6"/>
  <rect x="4" y="6" width="864" height="34" fill="#2b1d12"/>
  <text x="20" y="28" font-size="14" fill="#fbe9d7" letter-spacing="1.5">▸ doyled-it.card</text>
  <text x="852" y="28" font-size="14" fill="#fbe9d7" text-anchor="end" letter-spacing="1.5">v1.0</text>
  <g transform="translate(32, 60)">
    ${chip(0, 0,     "baseball", png.baseball)}
    ${chip(196, 0,   "golf",     png.golfBag)}
    ${chip(0, 156,   "music",    png.vinyl)}
    ${chip(196, 156, "archery",  png.archery)}
  </g>
  <text x="430" y="146" font-size="48" font-weight="800" fill="#2b1d12" letter-spacing="-0.5">Michael</text>
  <text x="430" y="200" font-size="48" font-weight="800" fill="#2b1d12" letter-spacing="-0.5">Doyle</text>
  <text x="430" y="232" font-size="13" fill="#2b1d12">lead ai research engineer</text>
  <text x="430" y="252" font-size="13" fill="#6b5840">rec-league ballplayer · weekend golfer</text>
  <line x1="430" y1="278" x2="780" y2="278" stroke="#2b1d12" stroke-width="2"/>
  <text x="430" y="304" font-size="11" fill="#6b5840" letter-spacing="2">▸ FILE: about-me.card</text>
  <text x="430" y="324" font-size="11" fill="#6b5840" letter-spacing="2">▸ TYPE: hypercard 1.0</text>
  <text x="430" y="344" font-size="11" fill="#6b5840" letter-spacing="2">▸ MODIFIED: ${today}</text>
</svg>
`;

// === Per-project mini cards for "selected work" (3 across) ===
// Each card 260x180 with icon at top, name and short blurb below.
function workCard(icon, name, blurb) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 200" width="260" height="200" ${FONT}>
  <rect x="6" y="6" width="252" height="190" fill="#2b1d12"/>
  <rect width="252" height="190" fill="#fbe9d7" stroke="#2b1d12" stroke-width="3"/>
  <rect width="252" height="26" fill="#2b1d12"/>
  <text x="14" y="19" font-size="12" fill="#fbe9d7" letter-spacing="1">▸ ${name}</text>
  <image href="${icon}" x="106" y="42" width="48" height="48" ${PIX}/>
  <text x="126" y="116" font-size="14" font-weight="700" text-anchor="middle" fill="#1a4f8a">${name}</text>
  <foreignObject x="14" y="124" width="232" height="64">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font: 11px ui-monospace,'SFMono-Regular',Menlo,monospace; color:#2b1d12; text-align:center; line-height:1.4;">${blurb}</div>
  </foreignObject>
</svg>
`;
}

const workAgentView = workCard(png.agentView, "agent-view", "OpenTUI terminal interface for Claude Code agent sessions");
const workVault     = workCard(png.vault,     "claude-vault-skills", "Claude Code skill suite for an Obsidian vault productivity system");
const workJanus     = workCard(png.janus,     "janus-llm", "LLM-powered code modernization via chunking, iterative prompting, and RAG");
const workSimfire   = workCard(png.simfire,   "simfire", "open-source wildfire simulator for training reinforcement learning agents");
const workLeftovers = workCard(png.leftovers, "leftovers", "on-device inspector for what Google still has on you (v0.1 / wip)");

// === Per-link mini cards for "elsewhere" (5 across) ===
// Each 170x140 with icon centered + label.
function elsewhereCard(icon, label, sublabel = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 140" width="170" height="140" ${FONT}>
  <rect x="6" y="6" width="162" height="130" fill="#2b1d12"/>
  <rect width="162" height="130" fill="#fbe9d7" stroke="#2b1d12" stroke-width="3"/>
  <rect width="162" height="22" fill="#2b1d12"/>
  <text x="11" y="16" font-size="10" fill="#fbe9d7" letter-spacing="1">▸ ${label}</text>
  <image href="${icon}" x="61" y="34" width="48" height="48" ${PIX}/>
  <text x="85" y="100" font-size="13" font-weight="700" text-anchor="middle" fill="#1a4f8a">${label}</text>
  ${sublabel ? `<text x="85" y="118" font-size="9" text-anchor="middle" fill="#6b5840" letter-spacing="0.5">${sublabel}</text>` : ""}
</svg>
`;
}

const elseSite     = elsewhereCard(png.mac,      "doyled-it.com", "personal site");
const elseMusic    = elsewhereCard(png.vinyl,    "music",         "chart · recent");
const elseCard     = elsewhereCard(png.bubble,   "card",          "chat with bio");
const elseLinkedIn = elsewhereCard(png.linkedin, "linkedin",      "michaeldoyleml");
const elseEmail    = elsewhereCard(png.envelope, "email",         "say hi");

// === Stack (one big card, no per-badge linking) ===
function stackTile(x, label, sprite) {
  return `
    <g transform="translate(${x},0)">
      <rect width="160" height="60" fill="#fff" stroke="#2b1d12" stroke-width="3"/>
      <image href="${sprite}" x="8" y="6" width="48" height="48" ${PIX}/>
      <text x="105" y="36" font-size="14" text-anchor="middle" fill="#2b1d12">${label}</text>
    </g>`;
}

const stack = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 130" width="880" height="130" ${FONT}>
  <rect x="12" y="14" width="864" height="110" fill="#2b1d12"/>
  <rect x="4" y="6" width="864" height="110" fill="#fbe9d7" stroke="#2b1d12" stroke-width="6"/>
  <rect x="4" y="6" width="864" height="34" fill="#2b1d12"/>
  <text x="20" y="28" font-size="14" fill="#fbe9d7" letter-spacing="1.5">▸ stack</text>
  <g transform="translate(20, 50)">
    ${stackTile(0,   "python",     png.python)}
    ${stackTile(168, "typescript", png.typescript)}
    ${stackTile(336, "claude",     png.claude)}
    ${stackTile(504, "langgraph",  png.langgraph)}
    ${stackTile(672, "cloudflare", png.cloudflare)}
  </g>
</svg>
`;

const written = [
  ["hero.svg",                     hero],
  ["work-agent-view.svg",          workAgentView],
  ["work-claude-vault-skills.svg", workVault],
  ["work-janus-llm.svg",           workJanus],
  ["work-simfire.svg",             workSimfire],
  ["work-leftovers.svg",           workLeftovers],
  ["else-doyled-it.svg",           elseSite],
  ["else-music.svg",               elseMusic],
  ["else-card.svg",                elseCard],
  ["else-linkedin.svg",            elseLinkedIn],
  ["else-email.svg",               elseEmail],
  ["stack.svg",                    stack],
];
for (const [name, body] of written) {
  writeFileSync(path.join(out, name), body, "utf8");
  console.log(`wrote assets/${name}`);
}
