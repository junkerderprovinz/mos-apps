/**
 * The feed banner, in the layout of the GitHub style guide: the MOS mark on the
 * left (largest ink 400px, ink-left x=165, centred on y=250), the name to its
 * right in Bree Serif at a cap height of 110, since MOS has no logotype of its
 * own, and one Lato claim below it. Light and dark variants for the README's
 * <picture>; the single-colour mark takes the text colour of each.
 *
 * Text is rendered at the origin and placed with a transform, because
 * opentype.js emits NaN control points for some Lato glyphs at large offsets.
 * Deps (global): opentype.js, @resvg/resvg-js.
 * Run: node .github/assets/gen-banner.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
const groot = execSync("npm root -g").toString().trim();
const opentype = require(`${groot}/opentype.js`);
const { Resvg } = require(`${groot}/@resvg/resvg-js`);
const DIR = dirname(fileURLToPath(import.meta.url));

const NAME = "MOS";
const CLAIM = "One hub to rule them all.";

const MARK = {
  vb: "0 0 569 290",
  content: `<g transform="translate(0,290) scale(0.1,-0.1)" fill="COLOR"><path d="M3957 2674 c-478 -61 -816 -294 -1021 -702 -26 -51 -56 -116 -67 -144 l-20 -51 28 6 c15 4 62 14 103 23 108 25 321 25 424 1 184 -44 322 -121 456 -256 194 -196 291 -435 290 -720 -1 -132 -18 -228 -64 -356 -20 -55 -36 -106 -36 -112 0 -10 143 -13 680 -13 374 0 680 2 680 5 0 7 -120 224 -342 620 -102 182 -340 609 -528 950 -421 761 -418 755 -435 755 -7 0 -19 2 -27 4 -7 2 -62 -3 -121 -10z"/><path d="M1568 2644 c-30 -48 -132 -230 -358 -644 -259 -472 -659 -1191 -776 -1396 -57 -99 -110 -196 -118 -216 l-15 -35 467 -5 c257 -4 563 -4 680 -1 190 5 213 8 208 22 -3 9 -21 60 -40 114 -55 151 -69 246 -63 417 6 165 23 241 87 378 53 113 112 193 213 288 134 126 281 203 458 239 101 21 342 16 453 -9 38 -9 71 -14 73 -13 4 5 -44 121 -84 202 -120 241 -316 440 -548 557 -170 86 -311 124 -496 135 l-117 6 -24 -39z"/><path d="M2600 1343 c-402 -707 -526 -926 -544 -960 l-17 -33 807 0 806 0 -60 113 c-32 61 -106 193 -164 292 -57 99 -205 360 -327 580 -123 220 -231 408 -240 418 -17 17 -29 -1 -261 -410z"/></g>`,
};

const W = 1600, H = 500, LOGO_INK = 400, LOGO_X = 165, GAP_LOGO_TEXT = 70, GAP_NAME_CLAIM = 16, CLAIM_SIZE = 44;
const TARGET_CAP = 110;
const THEMES = [
  { suf: "", bg: "#ffffff", name: "#1f2328", claim: "#5a5d5e" },
  { suf: "-dark", bg: "#0d1117", name: "#e6edf3", claim: "#9aa4ad" },
];

async function font(file, url) {
  const p = join(tmpdir(), file);
  if (!existsSync(p)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${file} ${r.status}`);
    writeFileSync(p, Buffer.from(await r.arrayBuffer()));
  }
  const b = readFileSync(p);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}
const bree = await font("jdp-BreeSerif-Regular.ttf", "https://github.com/google/fonts/raw/main/ofl/breeserif/BreeSerif-Regular.ttf");
const lato = await font("jdp-Lato-Regular.ttf", "https://github.com/google/fonts/raw/main/ofl/lato/Lato-Regular.ttf");
const bbox = (vb, content) =>
  new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${content}</svg>`, { fitTo: { mode: "original" } }).getBBox();

const mb = bbox(MARK.vb, MARK.content.replace(/COLOR/g, "#000"));
const sM = LOGO_INK / Math.max(mb.width, mb.height);
const markTX = LOGO_X - mb.x * sM, markTY = H / 2 - (mb.height * sM) / 2 - mb.y * sM;
const textX = LOGO_X + mb.width * sM + GAP_LOGO_TEXT;

const capRatio = bbox("0 0 600 400", `<path d="${bree.getPath("H", 0, 300, 200).toPathData(2)}"/>`).height / 200;
const nameSize = TARGET_CAP / capRatio;
const nb = bbox("0 0 2000 800", `<path d="${bree.getPath(NAME, 0, 500, nameSize).toPathData(2)}"/>`);
const nameH = nb.height;
const nameD = bree.getPath(NAME, 0, 0, nameSize).toPathData(2);

const claimScale = CLAIM_SIZE / lato.unitsPerEm;
const claimAsc = lato.ascender * claimScale, claimDesc = -lato.descender * claimScale;
const top = H / 2 - (nameH + GAP_NAME_CLAIM + claimAsc + claimDesc) / 2;
const claimBaseline = Math.round(top + nameH + GAP_NAME_CLAIM + claimAsc);
const claimD = lato.getPath(CLAIM, 0, 0, CLAIM_SIZE, { kerning: false }).toPathData(2);
if (claimD.includes("NaN")) throw new Error("claim path has NaN points");

for (const t of THEMES) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${NAME}: ${CLAIM}">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  <g transform="translate(${markTX.toFixed(2)},${markTY.toFixed(2)}) scale(${sM.toFixed(5)})">${MARK.content.replace(/COLOR/g, t.name)}</g>
  <g transform="translate(${textX.toFixed(2)},${(top - (nb.y - 500)).toFixed(2)})"><path d="${nameD}" fill="${t.name}"/></g>
  <g transform="translate(${textX.toFixed(2)},${claimBaseline})"><path d="${claimD}" fill="${t.claim}"/></g>
</svg>
`;
  writeFileSync(join(DIR, `banner${t.suf}.svg`), svg);
  writeFileSync(join(DIR, `banner${t.suf}.png`), new Resvg(svg, { background: t.bg, fitTo: { mode: "original" } }).render().asPng());
}
console.log(`mos-apps banner: name at x ${textX.toFixed(0)}, right margin ${(W - textX - nb.width).toFixed(0)}`);
