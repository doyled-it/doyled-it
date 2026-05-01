// Builds five self-contained card SVGs by inlining the PNG sprites as base64.
// Run via `npm run build:cards`. Output goes to assets/.

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
  pencil:      dataUri("pencil.png"),
  python:      dataUri("logo-python.png"),
  typescript:  dataUri("logo-typescript.png"),
  claude:      dataUri("logo-claude.png"),
  langgraph:   dataUri("logo-langgraph.png"),
  cloudflare:  dataUri("logo-cloudflare.png"),
  agentView:   dataUri("icon-agent-view.png"),
  vault:       dataUri("icon-vault.png"),
  leftovers:   dataUri("icon-leftovers.png"),
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
    ${chip(196, 156, "words",    png.pencil)}
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

const nowShipping = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 200" width="880" height="200" ${FONT}>
  <rect x="12" y="14" width="864" height="180" fill="#2b1d12"/>
  <rect x="4" y="6" width="864" height="180" fill="#fbe9d7" stroke="#2b1d12" stroke-width="6"/>
  <rect x="4" y="6" width="864" height="34" fill="#2b1d12"/>
  <text x="20" y="28" font-size="14" fill="#fbe9d7" letter-spacing="1.5">▸ now / shipping</text>
  <g font-size="14" fill="#2b1d12">
    <text x="32" y="76"><tspan font-weight="700">complicit.work</tspan> v1.0.0 — quietly out</text>
    <text x="32" y="106"><tspan font-weight="700">doyled-it.com</tspan> — pastel HyperCard refresh ongoing</text>
    <text x="32" y="136"><tspan font-weight="700">agent-view</tspan> — terminal UI for Claude Code agent sessions</text>
  </g>
</svg>
`;

function workRow(yOffset, icon, name, desc, italic) {
  const tail = italic
    ? `${desc} <tspan font-style="italic" fill="#6b5840">${italic}</tspan>`
    : desc;
  return `
  <g transform="translate(32, ${yOffset})">
    <image href="${icon}" width="48" height="48" ${PIX}/>
    <text x="64" y="22" font-size="15" font-weight="700" fill="#1a4f8a">${name}</text>
    <text x="64" y="44" font-size="13" fill="#2b1d12">${tail}</text>
  </g>`;
}

const selectedWork = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 280" width="880" height="280" ${FONT}>
  <rect x="12" y="14" width="864" height="260" fill="#2b1d12"/>
  <rect x="4" y="6" width="864" height="260" fill="#fbe9d7" stroke="#2b1d12" stroke-width="6"/>
  <rect x="4" y="6" width="864" height="34" fill="#2b1d12"/>
  <text x="20" y="28" font-size="14" fill="#fbe9d7" letter-spacing="1.5">▸ selected work</text>
  ${workRow(56,  png.agentView, "agent-view",          "OpenTUI-based terminal interface for managing AI coding agent sessions", "")}
  ${workRow(124, png.vault,     "claude-vault-skills", "Claude Code skill suite for an Obsidian vault productivity system", "")}
  ${workRow(192, png.leftovers, "leftovers",           "on-device inspector for what Google still has on you after opting out", "(v0.1 / wip)")}
</svg>
`;

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

const elsewhere = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 220" width="880" height="220" ${FONT}>
  <rect x="12" y="14" width="864" height="200" fill="#2b1d12"/>
  <rect x="4" y="6" width="864" height="200" fill="#fbe9d7" stroke="#2b1d12" stroke-width="6"/>
  <rect x="4" y="6" width="864" height="34" fill="#2b1d12"/>
  <text x="20" y="28" font-size="14" fill="#fbe9d7" letter-spacing="1.5">▸ elsewhere</text>
  <g font-size="14" fill="#2b1d12">
    <text x="32" y="72"><tspan font-weight="700" fill="#1a4f8a">doyled-it.com</tspan> — personal site</text>
    <text x="32" y="102"><tspan font-weight="700" fill="#1a4f8a">music</tspan> — chart, recent, top</text>
    <text x="32" y="132"><tspan font-weight="700" fill="#1a4f8a">card</tspan> — chat with my bio</text>
    <text x="32" y="162"><tspan font-weight="700" fill="#1a4f8a">contact</tspan></text>
  </g>
</svg>
`;

const written = [
  ["hero.svg",          hero],
  ["now-shipping.svg",  nowShipping],
  ["selected-work.svg", selectedWork],
  ["stack.svg",         stack],
  ["elsewhere.svg",     elsewhere],
];
for (const [name, body] of written) {
  writeFileSync(path.join(out, name), body, "utf8");
  console.log(`wrote assets/${name}`);
}
