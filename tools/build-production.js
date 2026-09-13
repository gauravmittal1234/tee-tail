#!/usr/bin/env node
/* Tee & Tail — production kit builder.
   Reads the site's catalogue (data.js) and artwork (art.js) and writes:
     production/prints/     print-ready SVG artwork per design, garment side and garment tone
     production/patterns/   seamless repeat tiles for the all-over bandana prints
     production/mockups/    one SVG per style, colourway and view
     production/sku-list.csv
     production/tech-pack.html
   Run from the repo root:  node tools/build-production.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "production");
const ctx = {};
ctx.window = ctx;
vm.createContext(ctx);
["data.js", "art.js"].forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), ctx, { filename: f }));
const TT = ctx.TT, A = TT.ART;

["prints", "patterns", "mockups"].forEach((d) => fs.mkdirSync(path.join(OUT, d), { recursive: true }));
const write = (rel, s) => fs.writeFileSync(path.join(OUT, rel), s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const inr = (n) => "₹" + n.toLocaleString("en-IN");
const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(", "); };
const tone = (key) => (A.ink(A.hex(key)) === A.INKS.light.ink ? "light" : "dark");
const max = (range) => +String(range).split("–").pop();
const TODAY = "13 September 2026";
const DIWALI = "8 November 2026";

/* ---------- Garments, print sizes and placement ---------- */
const sidesOf = (p) => (p.cat === "bandana" ? [] : p.kind === "twin" ? ["human", "pet"] : [p.kind]);
const garmentOf = (p, side) => side === "human" ? (p.cat === "hoodie" ? "human-hoodie" : "human-tee")
  : p.cat === "hoodie" ? "pet-hoodie" : p.species.length === 1 && p.species[0] === "cat" ? "cat-tee" : "pet-tee";
const PRINT = {
  "human-tee":    { label: "Human tee", where: "Front chest, centred", from: "7 cm below front neck seam", width: { XS: 24, S: 24, M: 24, L: 27, XL: 27, XXL: 27 } },
  "human-hoodie": { label: "Human hoodie", where: "Front chest, centred above pocket", from: "9 cm below front neck seam", width: { XS: 22, S: 22, M: 22, L: 22, XL: 22, XXL: 22 } },
  "pet-tee":      { label: "Dog tee", where: "Centre back", from: "4 cm (XS–S), 5 cm (M–L), 6 cm (XL–XXL) below collar rib", width: { XS: 9, S: 11, M: 14, L: 17, XL: 20, XXL: 23 } },
  "cat-tee":      { label: "Cat tee", where: "Centre back", from: "3 cm below collar rib", width: { XS: 8, S: 10, M: 12 } },
  "pet-hoodie":   { label: "Pet hoodie", where: "Centre back, below the hood", from: "2 cm below hood seam", width: { XS: 7, S: 9, M: 11, L: 14, XL: 16, XXL: 18 } }
};
const typeLabel = (p) => p.kind === "twin" ? `Twinning set (${p.cat === "hoodie" ? "hoodies" : "tees"})`
  : p.cat === "bandana" ? "Bandana" : (p.kind === "pet" ? "Pet " : "Human ") + p.cat;
const forLabel = (p) => p.kind === "human" ? "Pet parents" : (p.kind === "twin" ? "Parent + " : "") + p.species.map((s) => (s === "dog" ? "dogs" : "cats")).join(" & ");
const sizeList = (p) => {
  if (p.cat === "bandana") return { Bandana: TT.SIZES.bandana.map((r) => r.s) };
  const o = {};
  if (p.kind !== "pet") o.Human = TT.SIZES.human.map((r) => r.s);
  if (p.kind !== "human") p.species.forEach((s) => (o[s === "dog" ? "Dog" : "Cat"] = TT.SIZES[s].map((r) => r.s)));
  return o;
};
const placement = (p) => p.cat === "bandana" ? "All-over repeat on the printed side; reverse side solid"
  : sidesOf(p).map((s) => { const g = PRINT[garmentOf(p, s)]; return `${g.label}: ${g.where}, top of print ${g.from}`; }).join(" | ");

/* ---------- 1. Print artwork ---------- */
const seen = new Set(), files = {};
const addFile = (key, rec) => (files[key] = files[key] || []).push(rec);
TT.PRODUCTS.forEach((p) => {
  p.colors.forEach((c) => {
    const t = tone(c);
    if (p.cat === "bandana") {
      const pat = TT.PRINTS[p.print].pattern, file = `patterns/${pat}__${t}-garment.svg`;
      if (!seen.has(file)) { seen.add(file); write(file, A.patternTile(pat, t)); addFile(p.print, { side: "pattern", tone: t, file }); }
      return;
    }
    sidesOf(p).forEach((side) => {
      const file = `prints/${p.print}__${side === "human" ? "human-chest" : "pet-back"}__${t}-garment.svg`;
      if (seen.has(file)) return;
      seen.add(file);
      write(file, A.printArt(p.print, side, t, p.custom ? "NAME" : ""));
      addFile(p.print, { side, tone: t, file });
    });
  });
});

/* ---------- 2. Mockups ---------- */
let mockups = 0;
TT.PRODUCTS.forEach((p) => p.colors.forEach((c) => A.views(p).forEach(([v]) => {
  write(`mockups/${p.sku}_${c}_${v}.svg`, A.product(p, c, { view: v, name: "BRUNO" }));
  mockups++;
})));

/* ---------- 3. SKU list ---------- */
const cell = (s) => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));
const csv = [["SKU", "Style", "Type", "For", "Fabric", "Print design", "Print placement", "Colourways", "Sizes", "MRP (INR)", "Selling price (INR)", "Made to order", "Collection"]];
TT.PRODUCTS.forEach((p) => csv.push([
  p.sku, p.name, typeLabel(p), forLabel(p), p.fab.map((f) => TT.FABRICS[f].name).join(" + "), TT.PRINTS[p.print].name, placement(p),
  p.colors.map((c) => `${TT.COLORS[c].name} ${TT.COLORS[c].hex}`).join("; "),
  Object.entries(sizeList(p)).map(([k, v]) => `${k}: ${v.join("/")}`).join("; "),
  p.mrp, p.price, p.custom ? "Yes (pet name print)" : "No", p.edit ? TT.EDITS[p.edit] : "Core"
]));
write("sku-list.csv", csv.map((r) => r.map(cell).join(",")).join("\n") + "\n");

/* ---------- 4. Tech pack ---------- */
const variants = TT.PRODUCTS.reduce((a, p) => a + p.colors.length * Object.values(sizeList(p)).reduce((b, l) => b + l.length, 0), 0);
const printKeys = [...new Set(TT.PRODUCTS.map((p) => p.print))];
const usedBy = (k) => TT.PRODUCTS.filter((p) => p.print === k).map((p) => p.sku);
const PREVIEW_BG = { light: TT.COLORS.chalk.hex, dark: TT.COLORS.midnight.hex };
const SIDE_LABEL = { human: "Human chest", pet: "Pet back", pattern: "Repeat tile" };
const table = (head, rows) => `<div class="tw"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

const notes = (p) => {
  const n = [];
  if (p.custom) n.push("Made to order. Print the customer's pet name with DTF or DTG after each order: Bricolage Grotesque ExtraBold (800), capitals, A–Z and spaces only, max 10 letters, auto-fit to the print width.");
  if (p.kind === "twin") n.push("Human and pet pieces ship together in one polybag with the set hang tag; both pieces use the same colourway.");
  if (p.cat === "hoodie" && p.kind !== "human") n.push("Pet hoodie: 3 cm leash slit at centre back, bound edges; hood lined in self fabric.");
  if (p.fab.includes("CT150")) n.push("Cat tee: keep ink deposit thin (water-based only, no puff or plastisol) so the garment stays light and quiet.");
  if (p.edit === "diwali") n.push(`Festive drop — finished stock must be ready to ship at least two weeks before Diwali (${DIWALI}).`);
  if (p.cat === "bandana") n.push("Slip-over collar channel 1.5 cm; reverse side is solid garment colour.");
  return n.length ? n.map((x) => `<li>${esc(x)}</li>`).join("") : "<li>Standard production.</li>";
};

const styleCard = (p) => `<article class="style keep" id="${p.sku}">
  <header><span class="sku">${p.sku}</span><h3>${esc(p.name)}</h3><span class="chip">${esc(typeLabel(p))}</span>${p.edit ? `<span class="chip hot">${esc(TT.EDITS[p.edit])}</span>` : ""}</header>
  <div class="mocks">${p.colors.map((c) => `<figure><div class="mock">${A.product(p, c, { name: "BRUNO" })}</div><figcaption><b>${TT.COLORS[c].name}</b> <span class="mono">${TT.COLORS[c].hex}</span></figcaption></figure>`).join("")}</div>
  <dl class="spec">
    <dt>For</dt><dd>${esc(forLabel(p))}</dd>
    <dt>Fabric</dt><dd>${p.fab.map((f, i) => `${p.fab.length > 1 ? (i ? "Pet: " : "Human: ") : ""}${esc(TT.FABRICS[f].name)} — ${esc(TT.FABRICS[f].comp)}; ${esc(TT.FABRICS[f].fit)}; ${esc(TT.FABRICS[f].trim)}`).join("<br>")}</dd>
    <dt>Print</dt><dd>${esc(TT.PRINTS[p.print].name)} <span class="mono muted">(${p.print})</span></dd>
    <dt>Placement</dt><dd>${esc(placement(p)).split(" | ").join("<br>")}</dd>
    <dt>Sizes</dt><dd>${Object.entries(sizeList(p)).map(([k, v]) => `${k}: ${v.join(" · ")}`).join("<br>")}</dd>
    <dt>Price</dt><dd>MRP ${inr(p.mrp)} · sells at ${inr(p.price)}</dd>
    <dt>Notes</dt><dd><ul>${notes(p)}</ul></dd>
  </dl>
</article>`;

const printCard = (k) => {
  const P = TT.PRINTS[k], recs = files[k] || [];
  const words = ["human", "pet"].filter((s) => P[s]).map((s) => `${SIDE_LABEL[s]}: ${P[s].big ? "(graphic only, no words)" : P[s].lines.map((l) => `“${esc(l)}”`).join(" / ")}`);
  return `<article class="print keep">
    <header><h3>${esc(P.name)}</h3><span class="mono muted">${k}</span></header>
    <div class="pvs">${recs.map((r) => `<figure><div class="pv" style="background:${PREVIEW_BG[r.tone]}">${r.side === "pattern" ? `<div class="tile" style="background-image:url('data:image/svg+xml;utf8,${encodeURIComponent(A.patternTile(P.pattern, r.tone))}')"></div>` : A.printArt(k, r.side, r.tone, "NAME")}</div>
      <figcaption>${SIDE_LABEL[r.side]} · for ${r.tone} garments<br><code>${r.file}</code></figcaption></figure>`).join("")}</div>
    ${words.length ? `<p class="proof"><b>Proof the words:</b> ${words.join(" · ")}</p>` : `<p class="proof"><b>Pattern:</b> ${esc(P.pattern)} icons; tile repeats seamlessly in both directions.</p>`}
    <p class="muted small">Used by ${usedBy(k).join(", ")}</p>
  </article>`;
};

const html = `<meta charset="utf-8">
<title>Tee &amp; Tail Tech Pack</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&amp;family=DM+Mono:wght@400;500&amp;family=Figtree:wght@400;600;700&amp;display=swap">
<style>
  :root { --paper: #FFFFFF; --ink: #1C2150; --text: #2A2D3E; --muted: #6B6E80; --line: #E7E1D8; --soft: #FFF5EA; --tile: #F7F3EC; --accent: #FF6A2A; --accent-ink: #B8420F; color-scheme: light; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--paper); color: var(--text); font: 400 14px/1.55 "Figtree", "Avenir Next", system-ui, sans-serif; }
  .doc { max-width: 1100px; margin: 0 auto; padding: 44px 28px 80px; }
  h1, h2, h3 { font-family: "Bricolage Grotesque", "Avenir Next", system-ui, sans-serif; color: var(--ink); margin: 0; text-wrap: balance; letter-spacing: -.015em; }
  h1 { font-size: 40px; font-weight: 800; line-height: 1.05; margin: 10px 0 12px; }
  h2 { font-size: 26px; font-weight: 800; margin: 56px 0 6px; padding-top: 18px; border-top: 2px solid var(--ink); }
  h3 { font-size: 17px; font-weight: 800; }
  p { margin: 0; max-width: 72ch; }
  .lede { font-size: 16px; color: var(--muted); }
  .eyebrow { font: 500 11.5px/1 "DM Mono", ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-ink); }
  .mono, code { font-family: "DM Mono", ui-monospace, monospace; font-size: .86em; }
  .muted { color: var(--muted); }
  .small { font-size: 12.5px; }
  .sub { color: var(--muted); margin-bottom: 18px; }
  .summary { display: flex; flex-wrap: wrap; gap: 8px 28px; margin: 22px 0 8px; padding: 16px 20px; background: var(--soft); border-radius: 14px; }
  .summary div { font-size: 13px; color: var(--muted); }
  .summary b { display: block; font: 800 20px/1.2 "Bricolage Grotesque", system-ui, sans-serif; color: var(--ink); font-variant-numeric: tabular-nums; }
  .toc { display: flex; flex-wrap: wrap; gap: 6px 18px; margin-top: 14px; font-weight: 600; }
  .toc a { color: var(--ink); text-decoration: none; border-bottom: 1.5px solid var(--accent); }
  .callout { border-left: 3px solid var(--accent); background: var(--soft); padding: 12px 16px; border-radius: 0 10px 10px 0; margin: 16px 0; max-width: 80ch; }
  .tw { overflow-x: auto; margin: 10px 0 18px; }
  table { width: 100%; border-collapse: collapse; font-size: inherit; font-variant-numeric: tabular-nums; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { font: 500 10.5px/1.3 "DM Mono", ui-monospace, monospace; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); white-space: nowrap; }
  td:first-child { font-weight: 700; color: var(--ink); white-space: nowrap; }
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin: 12px 0 18px; }
  .sw { border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  .sw i { display: block; height: 64px; }
  .sw div { padding: 8px 10px; font-size: 12.5px; }
  .sw b { display: block; color: var(--ink); font-size: 14px; }
  .prints { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; margin-top: 14px; }
  .print, .style { border: 1px solid var(--line); border-radius: 16px; padding: 16px; background: var(--paper); }
  .print header, .style header { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
  .pvs { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
  .pvs figure, .mocks figure { margin: 0; }
  .pv { aspect-ratio: 1; border-radius: 10px; display: grid; place-items: center; padding: 12px; }
  .pv svg { width: 88%; height: auto; max-height: 100%; }
  .pv .tile { width: 100%; height: 100%; background-size: 50% auto; border-radius: 6px; }
  figcaption { font-size: 11.5px; color: var(--muted); margin-top: 6px; line-height: 1.35; overflow-wrap: anywhere; }
  .proof { font-size: 13px; margin-top: 10px; }
  .styles { display: grid; gap: 16px; margin-top: 14px; }
  .sku { font: 500 12px/1 "DM Mono", ui-monospace, monospace; background: var(--ink); color: #fff; padding: 5px 8px; border-radius: 6px; }
  .chip { font-size: 12px; font-weight: 600; color: var(--muted); border: 1px solid var(--line); padding: 3px 8px; border-radius: 999px; }
  .chip.hot { color: var(--accent-ink); border-color: var(--accent); }
  .mocks { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-bottom: 14px; }
  .mock { aspect-ratio: 1; background: var(--tile); border-radius: 10px; display: grid; place-items: center; }
  .mock svg { width: 82%; height: auto; }
  .spec { display: grid; grid-template-columns: 110px 1fr; gap: 6px 14px; margin: 0; font-size: 13.5px; }
  .spec dt { font: 500 10.5px/1.9 "DM Mono", ui-monospace, monospace; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
  .spec dd { margin: 0; }
  .spec ul, .checks { margin: 0; padding-left: 18px; }
  .checks li { margin-bottom: 6px; max-width: 80ch; }
  @media (max-width: 640px) { .spec { grid-template-columns: 1fr; } h1 { font-size: 30px; } }
  @page { size: A4; margin: 14mm; }
  @media print { .doc { padding: 0; max-width: none; } .keep { break-inside: avoid; } h2 { break-before: page; } .toc { display: none; } }
</style>
<div class="doc">
  <span class="eyebrow">Production tech pack · Launch range · ${TODAY}</span>
  <h1>Tee &amp; Tail launch range</h1>
  <p class="lede">Everything a knitting unit and printer need to sample and produce the range sold on the Tee &amp; Tail website: colour standards, fabrics, size and print specifications, print artwork and one spec sheet per style.</p>
  <div class="summary">
    <div><b>${TT.PRODUCTS.length}</b>styles</div>
    <div><b>${TT.PRODUCTS.filter((p) => p.kind === "twin").length}</b>twinning sets</div>
    <div><b>${printKeys.length}</b>print designs</div>
    <div><b>${Object.keys(TT.COLORS).length}</b>garment colours</div>
    <div><b>${variants.toLocaleString("en-IN")}</b>garment variants (style × colour × size)</div>
  </div>
  <div class="callout"><b>Starting points, not sign-offs.</b> Measurements, print sizes and placements below are proposals. Approve a lab dip for every colour and a fit sample for every size (on real dogs and cats for pet sizes) before bulk production.</div>
  <nav class="toc"><a href="#colours">Colours</a><a href="#fabrics">Fabrics</a><a href="#sizes">Sizes &amp; print specs</a><a href="#artwork">Print artwork</a><a href="#styles">Style sheets</a><a href="#qc">Sampling &amp; QC</a></nav>

  <h2 id="colours">Colour standards</h2>
  <p class="sub">Match garment dyeing to these references with lab dips. Hex values are the brand reference; ask the mill for the closest standard (e.g. Pantone TCX) and record it here once approved.</p>
  <div class="swatches">${Object.entries(TT.COLORS).map(([k, c]) => `<div class="sw"><i style="background:${c.hex}"></i><div><b>${c.name}</b><span class="mono">${c.hex}</span> · RGB ${rgb(c.hex)}<br>Print inks: ${tone(k) === "light" ? "navy + orange" : "cream + peach"}</div></div>`).join("")}</div>
  <h3>Print inks</h3>
  ${table(["Ink", "Hex", "Used on", "Role"], [
    ["Navy", `<span class="mono">${A.INKS.light.ink}</span>`, "Light garments: Chalk, Butter, Sky, Blush, Marigold, Sage", "Icon and first line of words"],
    ["Orange", `<span class="mono">${A.INKS.light.acc}</span>`, "Light garments", "Last line of words, accents"],
    ["Cream", `<span class="mono">${A.INKS.dark.ink}</span>`, "Dark garments: Midnight, Charcoal", "Icon and first line (needs white underbase or discharge)"],
    ["Peach", `<span class="mono">${A.INKS.dark.acc}</span>`, "Dark garments", "Last line of words, accents"]
  ])}
  <p class="small muted">Which garments count as light or dark is decided by the artwork; see the colour cards above. Water-based, AZO-free inks throughout. Screen print for bulk runs (100+ pieces per design and colourway); DTF or DTG for samples and personalised name prints.</p>

  <h2 id="fabrics">Fabrics</h2>
  ${table(["Code", "Fabric", "Composition", "Finish", "Fit", "Trims"], Object.entries(TT.FABRICS).map(([k, f]) => [k, esc(f.name), esc(f.comp), esc(f.finish), esc(f.fit), esc(f.trim)]))}

  <h2 id="sizes">Sizes &amp; print specifications</h2>
  <p class="sub">Pet charts list the body measurement a size fits and a proposed finished garment measurement (ease included). Human sizes are finished garment measurements. Print widths are the artwork's width on the garment.</p>
  <h3>Dog tees and pet hoodies (cm)</h3>
  ${table(["Size", "Fits chest", "Finished chest", "Neck opening", "Back length", "Tee print width", "Hoodie print width", "Typical breeds"], TT.SIZES.dog.map((r) => [r.s, r.chest, max(r.chest) + 4, max(r.neck) + 2, r.back, PRINT["pet-tee"].width[r.s], PRINT["pet-hoodie"].width[r.s], esc(r.breeds)]))}
  <h3>Cat tees (cm)</h3>
  ${table(["Size", "Fits chest", "Finished chest", "Neck opening", "Back length", "Print width", "Typical cats"], TT.SIZES.cat.map((r) => [r.s, r.chest, max(r.chest) + 3, max(r.neck) + 2, r.back, PRINT["cat-tee"].width[r.s], esc(r.breeds)]))}
  <h3>Human tees and hoodies</h3>
  ${table(["Size", "Finished chest (in)", "Body length (in)", "Fits body chest (in)", "Tee print width (cm)", "Hoodie print width (cm)"], TT.SIZES.human.map((r) => [r.s, r.chest, r.length, esc(r.fits), PRINT["human-tee"].width[r.s], PRINT["human-hoodie"].width[r.s]]))}
  <p class="small muted">The Dog Parent tee (HT-001) is an oversized cut: add 4 in to the finished chest and drop the shoulder 5 cm.</p>
  <h3>Bandanas (cm)</h3>
  ${table(["Size", "Fits neck", "Collar channel length", "Triangle depth", "Pattern tile scale"], TT.SIZES.bandana.map((r, i) => [r.s, r.neck, max(r.neck) + 4, [18, 24, 30][i], ["85%", "100% (tile 18 × 15 cm)", "115%"][i]]))}
  <h3>Print placement</h3>
  ${table(["Garment", "Position", "Top of print"], Object.values(PRINT).map((g) => [g.label, g.where, g.from]))}

  <h2 id="artwork">Print artwork</h2>
  <p class="sub">Vector SVG files are in <code>production/prints/</code> and <code>production/patterns/</code>. Each file holds only the two ink colours; knockouts are true cut-outs. Words are set in <b>Bricolage Grotesque ExtraBold</b> (free Google Font, SIL Open Font License) — install it or convert text to outlines before separations. Proof every word below before printing screens.</p>
  <div class="prints">${printKeys.map(printCard).join("")}</div>

  <h2 id="styles">Style sheets</h2>
  <p class="sub">One sheet per style. Mockups for every colourway and view are in <code>production/mockups/</code> (named <code>SKU_colour_view.svg</code>); the full list is in <code>production/sku-list.csv</code>.</p>
  <div class="styles">${TT.PRODUCTS.map(styleCard).join("")}</div>

  <h2 id="qc">Sampling &amp; quality checks</h2>
  <ul class="checks">
    <li>Lab dip approved for all ${Object.keys(TT.COLORS).length} colours under daylight (D65), on the actual fabric.</li>
    <li>Fit sample for every pet size, tried on at least two animals of that size; check the collar doesn't choke and the leg openings don't rub.</li>
    <li>Wash test: 5 cycles at 30 °C, line dry. Shrinkage under 5% in length and width; no print cracking or fading.</li>
    <li>Rub and colour-fastness test on print and fabric; nothing should transfer onto a pet's fur.</li>
    <li>Pet garments: no loose buttons, beads or trims a pet could chew and swallow; all seams overlocked and bar-tacked at stress points.</li>
    <li>Labels: fibre content, size, wash care and "Made in India" on a soft printed or satin label — no scratchy woven labels on pet garments.</li>
    <li>Packaged goods in India need MRP (inclusive of taxes), manufacturer or packer name and address, month and year of manufacture, net quantity and customer-care details on the pack. Confirm the exact requirements with your manufacturer or legal adviser.</li>
    <li>Diwali edit: bulk ready to ship by ${DIWALI.replace("8 November", "25 October")} at the latest.</li>
  </ul>
</div>
`;
write("tech-pack.html", html);

console.log(`Styles: ${TT.PRODUCTS.length} · print files: ${[...seen].length} · mockups: ${mockups} · variants: ${variants}`);
console.log(`Wrote ${path.relative(ROOT, OUT)}/ (prints, patterns, mockups, sku-list.csv, tech-pack.html)`);
