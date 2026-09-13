/* Tee & Tail — generated product artwork (SVG). No image files needed. */
(function () {
  const A = (TT.ART = {});
  let uid = 0;

  const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const lum = (hex) => { const [r, g, b] = rgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
  const shade = (hex, amt) => {
    const f = amt < 0 ? (c) => Math.round(c * (1 + amt)) : (c) => Math.round(c + (255 - c) * amt);
    return "#" + rgb(hex).map((c) => f(c).toString(16).padStart(2, "0")).join("");
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  A.ink = (hex) => (lum(hex) > 0.55 ? "#1C2150" : "#FFF6EA");
  A.acc = (hex) => (lum(hex) > 0.55 ? "#E4541A" : "#FFB38F");
  A.hex = (key) => (TT.COLORS[key] || TT.COLORS.chalk).hex;

  /* ---------- Icons (drawn in a 100-unit box around 0,0) ---------- */
  function icon(name, cx, cy, size, g) {
    const ink = A.ink(g), acc = A.acc(g), k = size / 100;
    let d = "";
    switch (name) {
      case "dog":
        d = `<ellipse cx="-33" cy="-2" rx="15" ry="28" fill="${acc}" transform="rotate(22 -33 -2)"/>
             <ellipse cx="33" cy="-2" rx="15" ry="28" fill="${acc}" transform="rotate(-22 33 -2)"/>
             <circle r="33" fill="${ink}"/>
             <ellipse cy="14" rx="17" ry="13" fill="${g}"/>
             <ellipse cy="8" rx="7" ry="5" fill="${ink}"/>
             <circle cx="-12" cy="-8" r="4.5" fill="${g}"/><circle cx="12" cy="-8" r="4.5" fill="${g}"/>
             <path d="M-5 28 Q0 38 5 28" fill="${acc}"/>`;
        break;
      case "cat":
        d = `<path d="M-34 -8 L-30 -46 L-6 -28 Z M34 -8 L30 -46 L6 -28 Z" fill="${ink}"/>
             <path d="M-28 -16 L-26 -36 L-14 -26 Z M28 -16 L26 -36 L14 -26 Z" fill="${acc}"/>
             <ellipse cy="4" rx="36" ry="31" fill="${ink}"/>
             <ellipse cx="-13" cy="-2" rx="4.5" ry="7" fill="${g}"/><ellipse cx="13" cy="-2" rx="4.5" ry="7" fill="${g}"/>
             <path d="M-5 12 L5 12 L0 18 Z" fill="${acc}"/>
             <path d="M-10 18 L-44 12 M-10 22 L-44 26 M10 18 L44 12 M10 22 L44 26" stroke="${g}" stroke-width="2.4" stroke-linecap="round"/>`;
        break;
      case "paw":
        d = `<ellipse cy="14" rx="26" ry="22" fill="${ink}"/>
             <ellipse cx="-32" cy="-12" rx="10" ry="13" fill="${acc}"/><ellipse cx="-12" cy="-30" rx="10" ry="13" fill="${ink}"/>
             <ellipse cx="12" cy="-30" rx="10" ry="13" fill="${ink}"/><ellipse cx="32" cy="-12" rx="10" ry="13" fill="${acc}"/>`;
        break;
      case "bone":
        d = `<g transform="rotate(-18)"><rect x="-32" y="-10" width="64" height="20" rx="6" fill="${ink}"/>
             <circle cx="-34" cy="-11" r="12" fill="${ink}"/><circle cx="-34" cy="11" r="12" fill="${ink}"/>
             <circle cx="34" cy="-11" r="12" fill="${acc}"/><circle cx="34" cy="11" r="12" fill="${acc}"/></g>`;
        break;
      case "heart":
        d = `<path d="M0 36 C-40 10 -46 -14 -34 -28 C-22 -42 -4 -36 0 -22 C4 -36 22 -42 34 -28 C46 -14 40 10 0 36 Z" fill="${acc}"/>
             <path d="M-22 -18 Q-26 -8 -18 0" stroke="${g}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`;
        break;
      case "plane":
        d = `<path d="M-44 4 L44 -30 L10 38 L0 12 Z" fill="${ink}"/><path d="M0 12 L44 -30 L-4 26 Z" fill="${acc}"/>`;
        break;
      case "chai":
        d = `<path d="M-24 -12 L24 -12 L18 38 L-18 38 Z" fill="${ink}"/>
             <path d="M-21 6 L21 6 L18 36 L-18 36 Z" fill="${acc}"/>
             <path d="M-10 -22 q-6 -8 0 -16 q6 -8 0 -16 M10 -22 q-6 -8 0 -16 q6 -8 0 -16" stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
        break;
    }
    return `<g transform="translate(${cx} ${cy}) scale(${k})">${d}</g>`;
  }
  A.icon = icon;

  /* ---------- Print block (icon + stacked words) ---------- */
  function printBlock(spec, cx, top, w, g, name) {
    if (!spec) return "";
    const ink = A.ink(g), acc = A.acc(g);
    if (spec.big) return icon(spec.icon, cx, top + w * 0.46, w * 0.92, g);
    const lines = spec.lines.map((l) => l.replace("{NAME}", (name || "BRUNO").toUpperCase()));
    const iconSize = lines.length ? w * 0.36 : w * 0.7;
    let out = icon(spec.icon, cx, top + iconSize / 2, iconSize, g);
    const longest = Math.max(...lines.map((l) => l.length), 1);
    const fs = Math.min(w * 0.23, w / (longest * 0.6));
    let y = top + iconSize + fs * 0.95;
    lines.forEach((l, i) => {
      const fill = i === lines.length - 1 && lines.length > 1 ? acc : ink;
      out += `<text x="${cx}" y="${y.toFixed(1)}" text-anchor="middle" font-family="Bricolage Grotesque, Avenir Next, sans-serif" font-weight="800" font-size="${fs.toFixed(1)}" letter-spacing="-0.4" fill="${fill}">${esc(l)}</text>`;
      y += fs * 0.98;
    });
    return out;
  }

  const tag = (x, y, g) => `<rect x="${x - 13}" y="${y}" width="26" height="12" rx="2" fill="${A.acc(g)}"/><text x="${x}" y="${y + 8.6}" text-anchor="middle" font-family="DM Mono, monospace" font-size="6" fill="${lum(A.acc(g)) > .6 ? "#1C2150" : "#fff"}">T&amp;T</text>`;

  /* ---------- Human tee / hoodie ---------- */
  function humanInner(g, printKey, o = {}) {
    const hood = o.hood, dk = shade(g, -0.12), dk2 = shade(g, -0.24);
    const body = hood
      ? "M118,36 C128,52 172,52 182,36 L232,54 C252,64 262,90 268,130 L282,226 L252,232 L226,140 L226,262 Q226,272 216,272 L84,272 Q74,272 74,262 L74,140 L48,232 L18,226 L32,130 C38,90 48,64 68,54 Z"
      : "M118,36 C128,52 172,52 182,36 L232,54 L272,104 L240,130 L222,112 L222,262 Q222,272 212,272 L88,272 Q78,272 78,262 L78,112 L60,130 L28,104 L68,54 Z";
    let s = "";
    if (hood) s += `<path d="M106,46 C98,2 202,2 194,46 Z" fill="${dk}"/>`;
    s += `<path d="${body}" fill="${g}"/>`;
    s += `<path d="M180,120 Q200,190 190,272 L212,272 Q222,272 222,262 L222,112 Z" fill="#000" opacity=".05"/>`;
    s += `<path d="M80,116 L80,262 Q80,270 88,271 L102,271 Q94,190 112,112 Z" fill="#fff" opacity=".1"/>`;
    s += `<path d="M118,36 Q150,28 182,36 C172,52 128,52 118,36 Z" fill="${dk2}"/>`;
    s += `<path d="M118,36 C128,52 172,52 182,36" stroke="${dk}" stroke-width="6" fill="none"/>`;
    if (hood) {
      s += `<path d="M18,226 L48,232 M252,232 L282,226" stroke="${dk}" stroke-width="12"/>`;
      s += `<rect x="74" y="256" width="152" height="16" rx="4" fill="${dk}"/>`;
      s += `<path d="M104,212 L112,178 L188,178 L196,212 Z" fill="${dk}" opacity=".55"/>`;
      s += `<path d="M138,50 L136,92 M162,50 L164,92" stroke="${A.ink(g)}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
    } else {
      s += `<path d="M68,56 Q76,84 78,112 M232,56 Q224,84 222,112" stroke="${dk}" stroke-width="1.6" fill="none"/>`;
      s += `<path d="M86,262 L214,262 M33,108 L62,125 M267,108 L238,125" stroke="${dk}" stroke-width="1.6" stroke-dasharray="3 3"/>`;
    }
    if (o.view === "back") s += tag(150, 50, g);
    else {
      const spec = TT.PRINTS[printKey] && TT.PRINTS[printKey].human;
      s += printBlock(spec, 150, hood ? 70 : 72, hood ? 92 : 104, g, o.name);
    }
    return s;
  }

  /* ---------- Pet tee / hoodie (flat-lay, back view) ---------- */
  function petInner(g, printKey, o = {}) {
    const dk = shade(g, -0.12), dk2 = shade(g, -0.26);
    let s = `<ellipse cx="150" cy="282" rx="96" ry="9" fill="#000" opacity=".07"/>`;
    s += `<path d="M112,48 C126,60 174,60 188,48 L214,64 L254,78 L246,118 L220,112 C220,112 224,190 222,232 C220,258 190,272 150,272 C110,272 80,258 78,232 C76,190 80,112 80,112 L54,118 L46,78 L86,64 Z" fill="${g}"/>`;
    s += `<path d="M184,120 Q204,200 176,268 C200,262 220,250 222,232 C224,190 220,112 220,112 Z" fill="#000" opacity=".05"/>`;
    s += `<path d="M112,48 Q150,36 188,48 C174,60 126,60 112,48 Z" fill="${dk2}"/>`;
    s += `<path d="M112,48 C126,60 174,60 188,48" stroke="${dk}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M47,80 L54,116 M253,80 L246,116" stroke="${dk}" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M82,238 C88,256 114,268 150,268 C186,268 212,256 218,238" stroke="${dk}" stroke-width="5" fill="none"/>`;
    let top = 92, w = 104;
    if (o.hood) {
      s += `<path d="M106,50 C92,74 102,118 150,124 C198,118 208,74 194,50 C178,62 122,62 106,50 Z" fill="${shade(g, -0.07)}" stroke="${dk}" stroke-width="3"/>`;
      s += `<path d="M130,90 Q150,100 170,90" stroke="${dk2}" stroke-width="3" fill="none"/>`;
      top = 134; w = 84;
    }
    if (o.view === "front") s += tag(150, 70, g);
    else {
      const spec = TT.PRINTS[printKey] && TT.PRINTS[printKey].pet;
      s += printBlock(spec, 150, top, w, g, o.name);
    }
    return s;
  }

  /* ---------- Bandana ---------- */
  function bandanaInner(g, printKey, o = {}) {
    const id = "bd" + ++uid, dk = shade(g, -0.14), p = TT.PRINTS[printKey] || {};
    let s = `<path d="M50,100 L250,100 L160,256 Q150,272 140,256 Z" fill="${g}"/>`;
    if (o.view !== "reverse") {
      s += `<clipPath id="${id}"><path d="M50,100 L250,100 L160,256 Q150,272 140,256 Z"/></clipPath><g clip-path="url(#${id})">`;
      for (let r = 0; r < 6; r++) for (let c = 0; c < 7; c++) {
        const x = 40 + c * 36 + (r % 2 ? 18 : 0), y = 118 + r * 30;
        s += icon(p.pattern === "chai" ? "chai" : "paw", x, y, 20, g);
      }
      s += `</g>`;
    }
    s += `<path d="M150,100 L150,262" stroke="#000" stroke-opacity=".05" stroke-width="30"/>`;
    s += `<rect x="36" y="70" width="228" height="36" rx="14" fill="${dk}"/>`;
    s += `<path d="M50,88 L250,88" stroke="${shade(g, -0.26)}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    return s;
  }

  const wrap = (inner, vb = "0 0 300 300") => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  A.human = (hex, printKey, o) => wrap(humanInner(hex, printKey, o));
  A.pet = (hex, printKey, o) => wrap(petInner(hex, printKey, o));
  A.bandana = (hex, printKey, o) => wrap(bandanaInner(hex, printKey, o));
  A.twin = (hex, printKey, o = {}) =>
    wrap(`<g transform="translate(-8 -4) scale(.84)">${humanInner(hex, printKey, { hood: o.hood, name: o.name })}</g>
          <g transform="translate(140 132) scale(.55)">${petInner(hex, printKey, { hood: o.hood, name: o.name })}</g>`);

  /* Views available for each product (used by the gallery) */
  A.views = (p) => {
    if (p.kind === "twin") return [["set", "The set"], ["human", "Your tee · front"], ["pet", "Their tee · back"]];
    if (p.cat === "bandana") return [["front", "Printed side"], ["reverse", "Reverse · solid"]];
    if (p.kind === "pet") return [["back", "Back print"], ["front", "Collar side"]];
    return [["front", "Front print"], ["back", "Back"]];
  };

  A.product = (p, colorKey, o = {}) => {
    const hex = A.hex(colorKey || p.colors[0]);
    const hood = p.cat === "hoodie", view = o.view, name = o.name;
    if (p.cat === "bandana") return A.bandana(hex, p.print, { view });
    if (p.kind === "twin") {
      if (view === "human") return A.human(hex, p.print, { hood, name });
      if (view === "pet") return A.pet(hex, p.print, { hood, name });
      return A.twin(hex, p.print, { hood, name });
    }
    if (p.kind === "pet") return A.pet(hex, p.print, { hood, name, view: view === "front" ? "front" : "back" });
    return A.human(hex, p.print, { hood, name, view: view === "back" ? "back" : "front" });
  };

  /* Category circles */
  A.cat = (key) => {
    const m = {
      twin: () => A.twin("#F4A340", "goodboy"),
      dog: () => A.pet("#98BFE4", "dogface"),
      cat: () => A.pet("#F2B4AB", "catface"),
      human: () => A.human("#F3EFE6", "parent"),
      hoodie: () => A.human("#9DBB95", "zoomies", { hood: true }),
      bandana: () => A.bandana("#F4DD78", "pawtern"),
      custom: () => A.pet("#262B55", "custom", { name: "LADDOO" }),
      sale: () => wrap(`<g transform="rotate(-12 150 150)"><path d="M70,90 L190,90 L250,150 L190,210 L70,210 Q56,210 56,196 L56,104 Q56,90 70,90 Z" fill="#FF6A2A"/><circle cx="192" cy="150" r="12" fill="#FFF6EA"/><text x="118" y="168" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-weight="800" font-size="50" fill="#FFF6EA">%</text></g>`)
    };
    return (m[key] || m.twin)();
  };

  A.face = (kind, hex) => wrap(icon(kind, 50, 54, 78, hex), "0 0 100 100");
})();
