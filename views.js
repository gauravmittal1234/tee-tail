/* Tee & Tail — home, shop, quick-add and the shared option picker */
(function () {
  const V = (TT.V = TT.V || {});
  const { $, $$, esc, fmt } = TT;
  const ART = TT.ART;

  /* ================= Option picker (quick-add + product page) ================= */
  TT.newPick = (p) => ({ color: p.colors[0], species: p.species[0], size: "", petSize: "", name: "", qty: 1 });

  TT.pickerHtml = (p, st, o = {}) => {
    const rows = TT.sizeRows(p, st.species);
    let h = "";
    if (p.species.length > 1 && p.kind !== "human" && p.cat !== "bandana") {
      h += `<div><div class="opt-head">Your pet is a</div><div class="opt-row">${p.species.map((s) => `<button class="chip ${st.species === s ? "on" : ""}" data-pick="species" data-v="${s}">${s === "dog" ? "Dog" : "Cat"}</button>`).join("")}</div></div>`;
    }
    h += `<div><div class="opt-head">Colour <span>${TT.COLORS[st.color].name}</span></div><div class="opt-row">${p.colors.map((c) => `<button class="swatch ${st.color === c ? "on" : ""}" style="background:${TT.COLORS[c].hex}" data-pick="color" data-v="${c}" aria-label="${TT.COLORS[c].name}" aria-pressed="${st.color === c}"></button>`).join("")}</div></div>`;
    rows.forEach((r) => {
      const sel = r.list.find((x) => x.s === st[r.key]);
      let detail = "Select a size";
      if (sel) detail = sel.length ? `Chest ${sel.chest}" · Length ${sel.length}"` : sel.chest ? `Chest ${sel.chest} cm · ${sel.breeds}` : `Neck ${sel.neck} cm · ${sel.breeds}`;
      h += `<div><div class="opt-head">${r.label} <span>${detail}</span></div>
        <div class="opt-row">${r.list.map((x) => `<button class="size-btn ${st[r.key] === x.s ? "on" : ""}" data-pick="${r.key}" data-v="${x.s}" aria-pressed="${st[r.key] === x.s}">${x.s}<small>${r.sub(x)}</small></button>`).join("")}</div></div>`;
    });
    if (o.guide) h += `<button class="link" style="align-self:flex-start;font-size:14px" data-act="guide" data-id="${p.id}">Not sure? Open the size guide &amp; breed finder →</button>`;
    if (p.custom) {
      h += `<div class="personal"><label class="opt-head" for="petName" style="margin:0">Your pet's name <span>up to 10 letters · printed to order</span></label>
        <input class="input" id="petName" data-pick="name" maxlength="10" placeholder="e.g. Bruno" value="${esc(st.name)}" autocomplete="off"></div>`;
    }
    h += `<div class="pin-msg err" data-err role="alert"></div>`;
    return h;
  };

  TT.missing = (p, st) => {
    const r = TT.sizeRows(p, st.species).find((r) => !st[r.key]);
    if (r) return "Pick " + r.label.toLowerCase().replace(/^your/, "your") + " first.";
    if (p.custom && !st.name.trim()) return "Add your pet's name for the print.";
    return "";
  };

  TT.lineFrom = (p, st) => {
    const rows = TT.sizeRows(p, st.species);
    const line = { id: p.id, color: st.color, qty: st.qty || 1 };
    if (rows.some((r) => r.key === "size")) line.size = st.size;
    if (rows.some((r) => r.key === "petSize")) line.petSize = st.petSize;
    if (p.kind !== "human" && p.cat !== "bandana") line.species = st.species;
    if (p.custom) line.name = st.name.trim().toUpperCase();
    return line;
  };

  /* Wires clicks inside root; onChange(fullRerender) */
  TT.bindPicker = (root, p, st, onChange, onName) => {
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pick]");
      if (!b || b.tagName === "INPUT") return;
      const k = b.dataset.pick, v = b.dataset.v;
      if (k === "species" && st.species !== v) st.petSize = "";
      st[k] = v;
      onChange(k, v);
    });
    root.addEventListener("input", (e) => {
      if (e.target.dataset.pick !== "name") return;
      const clean = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 10);
      if (clean !== e.target.value) e.target.value = clean;
      st.name = clean;
      onName && onName(clean);
    });
  };

  /* ================= Quick add ================= */
  TT.quickAdd = (id) => {
    const p = TT.byId(id), st = TT.newPick(p);
    const draw = (m) => {
      m.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:start;gap:12px;margin-bottom:16px">
          <div><span class="card-for">${TT.forLabel(p)}</span><h3>${esc(p.name)}</h3>${TT.priceHtml(p)}</div>
          <button class="close-btn" data-act="close" aria-label="Close">${TT.X}</button></div>
        <div class="qa-grid"><div class="thumb" style="background:${TT.tile(p)}" data-art>${ART.product(p, st.color, { name: st.name })}</div>
          <div style="display:flex;flex-direction:column;gap:16px">${TT.pickerHtml(p, st)}
            <div class="buy-row"><button class="btn" data-qa-add>Add to bag · ${fmt(p.price)}</button></div>
            <a class="link" href="#/product/${p.id}" style="font-size:14px">View full details</a></div></div>`;
    };
    TT.openModal("", (m) => {
      draw(m);
      TT.bindPicker(m, p, st, (k, v) => {
        draw(m);
        const again = m.querySelector(`[data-pick="${k}"][data-v="${v}"]`); again && again.focus();
      }, () => { m.querySelector("[data-art]").innerHTML = ART.product(p, st.color, { name: st.name }); });
      m.addEventListener("click", (e) => {
        if (!e.target.closest("[data-qa-add]")) return;
        const miss = TT.missing(p, st);
        if (miss) { m.querySelector("[data-err]").textContent = miss; return; }
        TT.addToCart(TT.lineFrom(p, st));
        TT.closeAll();
      });
    });
  };

  /* ================= Home ================= */
  const heroColors = ["marigold", "sky", "sage", "blush", "midnight"];
  let heroColor = "marigold", homeTab = "twin", finderBreed = "Beagle", promoName = "LADDOO";

  const catTiles = [
    ["twin", "Twinning Sets", "#/shop?kind=twin", "var(--t1)"],
    ["dog", "Dog Tees", "#/shop?kind=pet&species=dog", "var(--t3)"],
    ["cat", "Cat Tees", "#/shop?kind=pet&species=cat", "var(--t4)"],
    ["human", "Pawrent Tees", "#/shop?kind=human", "var(--t2)"],
    ["hoodie", "Hoodies", "#/shop?cat=hoodie", "var(--t6)"],
    ["bandana", "Bandanas", "#/shop?cat=bandana", "var(--t5)"],
    ["custom", "Personalise", "#/shop?custom=1", "var(--t3)"],
    ["sale", "Offer Zone", "#/shop?sort=discount", "var(--t1)"]
  ];
  const catCount = (k) => {
    const f = { twin: (p) => p.kind === "twin", dog: (p) => p.kind === "pet" && p.species.includes("dog"), cat: (p) => p.kind === "pet" && p.species.includes("cat"),
      human: (p) => p.kind === "human", hoodie: (p) => p.cat === "hoodie", bandana: (p) => p.cat === "bandana", custom: (p) => p.custom, sale: (p) => TT.off(p) >= 20 }[k];
    return TT.PRODUCTS.filter(f).length;
  };
  const tabDefs = { twin: ["For both of us", (p) => p.kind === "twin"], pet: ["For my pet", (p) => p.kind === "pet"], human: ["For me", (p) => p.kind === "human"] };
  const railFor = (k) => TT.PRODUCTS.filter(tabDefs[k][1]).sort((a, b) => (a.best || 99) - (b.best || 99)).map(TT.card).join("");

  const finderHtml = () => {
    const b = TT.BREEDS.find((x) => x[0] === finderBreed) || TT.BREEDS[0];
    const row = TT.SIZES[b[1]].find((r) => r.s === b[2]);
    return `<div class="size-big">${row.s}</div><div>
      <div style="font-weight:700;color:var(--ink)">${esc(b[0])} → size ${row.s}</div>
      <dl class="measure"><dt>Chest</dt><dt>Neck</dt><dt>Back length</dt><dd>${row.chest} cm</dd><dd>${row.neck} cm</dd><dd>${row.back} cm</dd></dl>
      <a class="btn sm" href="#/shop?kind=pet&species=${b[1]}&size=${row.s}">Shop ${b[1]} tees in ${row.s}</a></div>`;
  };

  V.home = () => {
    const newest = TT.PRODUCTS.filter((p) => p.isNew);
    const html = `<div class="wrap">
    <section class="hero" aria-labelledby="heroTitle"><div class="hero-grid">
      <div>
        <span class="eyebrow">New · The Twinning Edit 2026</span>
        <h1 id="heroTitle">Same tee.<br>Two sizes.<br><em>One very good boy.</em></h1>
        <p class="hero-lede">Matching tees and hoodies for you and your dog or cat — cut for four legs, sized by chest in centimetres, printed with pet-safe inks in Tiruppur.</p>
        <div class="hero-ctas"><a class="btn" href="#/shop?kind=twin">Shop twinning sets</a><a class="btn ghost" href="#/size-guide">Find my pet's size</a></div>
        <div class="hero-stats"><div><b>48,000+</b>matched pairs shipped</div><div><b>4.8 ★</b>from 9,600 reviews</div><div><b>15 days</b>free size exchange</div></div>
      </div>
      <div class="twin-stage">
        <div class="twin-art"><div class="human" data-h>${ART.human(ART.hex(heroColor), "goodboy")}</div><div class="pet" data-p>${ART.pet(ART.hex(heroColor), "goodboy")}</div>
          <div class="tagline-chip"><b>Try a colour</b><br>Both tees change together — that's the whole point.</div></div>
        <div class="twin-controls"><span>Colour</span>${heroColors.map((c) => `<button class="swatch ${c === heroColor ? "on" : ""}" style="background:${TT.COLORS[c].hex}" data-hero="${c}" aria-label="${TT.COLORS[c].name}"></button>`).join("")}</div>
      </div>
    </div></section>

    <section class="section" aria-labelledby="catTitle">
      <div class="sec-head"><div><h2 id="catTitle">Shop by category</h2><p>Tees for every tail, and the humans holding the leash.</p></div></div>
      <div class="cats">${catTiles.map(([k, n, href, bg]) => `<a class="cat" href="${href}"><span class="cat-circle" style="background:${bg}">${ART.cat(k)}</span><span>${n}<small>${catCount(k)} styles</small></span></a>`).join("")}</div>
    </section>

    <section class="section" aria-labelledby="bestTitle">
      <div class="sec-head"><div><h2 id="bestTitle">Bestsellers</h2><p>Who are you shopping for today?</p></div>
        <div class="tabs" role="tablist">${Object.entries(tabDefs).map(([k, [n]]) => `<button class="chip ${k === homeTab ? "on" : ""}" role="tab" aria-selected="${k === homeTab}" data-tab="${k}">${n}</button>`).join("")}</div></div>
      <div class="rail" data-rail>${railFor(homeTab)}</div>
    </section>

    <section class="section"><div class="finder">
      <div><span class="eyebrow">Breed size finder</span><h3 style="margin-top:10px">Pet tees are sized by chest, not by guesswork.</h3>
        <p class="muted" style="margin-top:8px">Pick a breed for our starting size. For a perfect fit, measure the widest part of the chest just behind the front legs.</p>
        <div class="finder-form"><label class="sr" for="breedSel">Breed</label><select class="select" id="breedSel" style="flex:1;min-width:200px">${TT.BREEDS.map((b) => `<option ${b[0] === finderBreed ? "selected" : ""}>${esc(b[0])}</option>`).join("")}</select>
          <a class="btn ghost" href="#/size-guide">Full size chart</a></div></div>
      <div class="finder-result" data-finder>${finderHtml()}</div>
    </div></section>

    <section class="section"><div class="promos">
      <div class="promo dark"><span class="eyebrow">Personalise</span><h3>Their name, big and bold on their back.</h3>
        <p>Type a name to preview it. Printed to order, ships in 3–4 days.</p>
        <input class="input" data-promo-name maxlength="10" value="${esc(promoName)}" aria-label="Preview your pet's name" style="max-width:220px;background:var(--navy-2);color:var(--navy-ink);border-color:#3A4080">
        <a class="btn" href="#/product/pet-name-tee">Personalise a tee</a>
        <div class="promo-art" data-promo-art>${ART.pet("#F4A340", "custom", { name: promoName })}</div></div>
      <div class="promo" style="background:var(--t2)"><span class="eyebrow">Adopt, don't shop</span><h3>Indie &amp; proud.</h3>
        <p>₹50 from every Indie tee funds street-dog feeding drives with our rescue partners.</p>
        <a class="btn navy" href="#/product/dog-indie">Shop the Indie tee</a>
        <div class="promo-art">${ART.pet("#F4A340", "indie")}</div></div>
    </div></section>

    <section class="section" aria-labelledby="newTitle">
      <div class="sec-head"><div><h2 id="newTitle">New this season</h2><p>Winter fleece is here — hoodies for foggy morning walks.</p></div><a class="link" href="#/shop?sort=new">See all new →</a></div>
      <div class="rail">${newest.map(TT.card).join("")}</div>
    </section>

    <section class="section" aria-labelledby="revTitle">
      <div class="sec-head"><div><h2 id="revTitle">Pet parents, in their own words</h2><p>Real sizes, real breeds, very real zoomies.</p></div></div>
      <div class="reviews">${TT.REVIEWS.map((r) => `<figure class="review" style="margin:0"><span class="rating"><span class="star">★★★★★</span></span><q>${esc(r.text)}</q><span class="wore">${esc(r.wore)}</span>
        <figcaption class="review-who"><span class="avatar" style="background:var(--${r.tile})">${ART.face(r.pet, "#FFF6EA")}</span><span><b>${esc(r.who)}</b><span>${esc(r.where)}</span></span></figcaption></figure>`).join("")}</div>
    </section>

    <section class="section"><div class="usps">
      ${[["M4 7h16M4 12h16M4 17h10", "180 GSM combed cotton", "Bio-washed, pre-shrunk, soft from the first wear."],
         ["M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z", "Pet-safe inks", "Water-based, AZO-free, OEKO-TEX certified."],
         ["M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4", "Free size exchange", "Swap sizes within 15 days, pickup included."],
         ["M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", "Knitted in Tiruppur", "Made in India's knitwear capital, fairly."]]
        .map(([d, b, s]) => `<div class="usp"><span class="usp-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg></span><span><b>${b}</b><span>${s}</span></span></div>`).join("")}
    </div></section>

    <section class="section" aria-labelledby="faqTitle">
      <div class="sec-head"><div><h2 id="faqTitle">Questions pet parents ask</h2></div><a class="link" href="#/faq">All FAQs →</a></div>
      <div class="faq">${TT.FAQ.slice(0, 4).map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
    </section></div>`;

    const mount = (root) => {
      root.addEventListener("click", (e) => {
        const h = e.target.closest("[data-hero]");
        if (h) {
          heroColor = h.dataset.hero;
          $("[data-h]", root).innerHTML = ART.human(ART.hex(heroColor), "goodboy");
          $("[data-p]", root).innerHTML = ART.pet(ART.hex(heroColor), "goodboy");
          $$("[data-hero]", root).forEach((b) => b.classList.toggle("on", b === h));
        }
        const t = e.target.closest("[data-tab]");
        if (t) {
          homeTab = t.dataset.tab;
          $("[data-rail]", root).innerHTML = railFor(homeTab);
          $$("[data-tab]", root).forEach((b) => { b.classList.toggle("on", b === t); b.setAttribute("aria-selected", b === t); });
        }
      });
      $("#breedSel", root).addEventListener("change", (e) => { finderBreed = e.target.value; $("[data-finder]", root).innerHTML = finderHtml(); });
      $("[data-promo-name]", root).addEventListener("input", (e) => {
        const v = e.target.value.replace(/[^A-Za-z ]/g, "").slice(0, 10);
        e.target.value = v; promoName = v || "LADDOO";
        $("[data-promo-art]", root).innerHTML = ART.pet("#F4A340", "custom", { name: promoName });
      });
    };
    return { html, mount };
  };

  /* ================= Shop ================= */
  const list = (params, k) => (params.get(k) || "").split(",").filter(Boolean);
  const SORTS = [["popular", "Most popular"], ["new", "Newest first"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["discount", "Biggest discount"], ["rating", "Top rated"]];
  const LABELS = { kind: { twin: "Twinning sets", pet: "For pets", human: "For pawrents" }, species: { dog: "Dogs", cat: "Cats" }, cat: { tee: "Tees", hoodie: "Hoodies", bandana: "Bandanas" } };

  function sizesOf(p) { return new Set(TT.sizeRows(p).concat(p.species[1] ? TT.sizeRows(p, p.species[1]) : []).flatMap((r) => r.list.map((x) => x.s))); }

  function filterProducts(params, skip) {
    const q = params.get("q") || "";
    let r = q ? TT.search(q) : TT.PRODUCTS.slice();
    const f = (k, test) => { const v = list(params, k); if (v.length && k !== skip) r = r.filter((p) => test(p, v)); };
    f("kind", (p, v) => v.includes(p.kind));
    f("species", (p, v) => p.species.some((s) => v.includes(s)));
    f("cat", (p, v) => v.includes(p.cat));
    f("color", (p, v) => p.colors.some((c) => v.includes(c)));
    f("size", (p, v) => { const s = sizesOf(p); return v.some((x) => s.has(x)); });
    f("print", (p, v) => v.includes(p.print));
    if (params.get("custom")) r = r.filter((p) => p.custom);
    const max = +params.get("max");
    if (max) r = r.filter((p) => p.price <= max);
    return r;
  }

  function sortProducts(r, sort) {
    const by = {
      popular: (a, b) => (a.best || 99) - (b.best || 99) || b.reviews - a.reviews,
      new: (a, b) => (b.isNew || 0) - (a.isNew || 0) || (a.best || 99) - (b.best || 99),
      "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price,
      discount: (a, b) => TT.off(b) - TT.off(a), rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews
    }[sort] || ((a, b) => (a.best || 99) - (b.best || 99) || b.reviews - a.reviews);
    return r.sort(by);
  }

  function shopTitle(params) {
    if (params.get("q")) return `Results for “${esc(params.get("q"))}”`;
    const kind = list(params, "kind"), sp = list(params, "species"), cat = list(params, "cat");
    if (params.get("custom")) return "Personalised tees";
    if (params.get("print") === "indie") return "Adopt, don't shop";
    if (kind.length === 1 && kind[0] === "twin") return "Twinning sets";
    if (kind.length === 1 && kind[0] === "human") return "Tees for pawrents";
    if (kind.length === 1 && kind[0] === "pet" && sp.length === 1) return sp[0] === "dog" ? "Dog tees & hoodies" : "Cat tees";
    if (cat.length === 1) return { hoodie: "Winter hoodies", bandana: "Bandanas", tee: "Tees" }[cat[0]];
    if (params.get("sort") === "discount") return "Offer Zone";
    return "All products";
  }

  V.shop = (r) => {
    const params = r.params;
    const results = sortProducts(filterProducts(params), params.get("sort"));
    const count = (k, v) => filterProducts(new URLSearchParams([...params].filter(([x]) => x !== k).concat([[k, v]])), null).length;
    const checks = (k) => Object.entries(LABELS[k]).map(([v, n]) => `<label class="check"><input type="checkbox" data-f="${k}" value="${v}" ${list(params, k).includes(v) ? "checked" : ""}>${n}<span class="n">${count(k, v)}</span></label>`).join("");
    const max = +params.get("max") || 2799;
    const active = [];
    ["kind", "species", "cat"].forEach((k) => list(params, k).forEach((v) => active.push([k, v, LABELS[k][v]])));
    list(params, "color").forEach((v) => active.push(["color", v, TT.COLORS[v] ? TT.COLORS[v].name : v]));
    list(params, "size").forEach((v) => active.push(["size", v, "Size " + v]));
    if (params.get("custom")) active.push(["custom", "1", "Personalised"]);
    if (params.get("max")) active.push(["max", "", "Under " + fmt(max)]);
    if (params.get("q")) active.push(["q", "", "“" + params.get("q") + "”"]);

    const html = `<div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><span>${shopTitle(params)}</span></nav>
      <div class="shop-head"><div><h1>${shopTitle(params)}</h1><p class="muted">${results.length} style${results.length === 1 ? "" : "s"} · prices include GST</p></div>
        <div class="toolbar"><button class="btn ghost sm filter-toggle" data-ftoggle>Filters${active.length ? ` (${active.length})` : ""}</button>
          <label class="sr" for="sortSel">Sort by</label><select class="select" id="sortSel" style="height:40px">${SORTS.map(([v, n]) => `<option value="${v}" ${(params.get("sort") || "popular") === v ? "selected" : ""}>${n}</option>`).join("")}</select></div></div>
      <div class="shop-layout">
        <aside class="filters" id="filters" aria-label="Filters">
          <div class="filter-group"><h4>Shopping for</h4><div class="filter-list">${checks("kind")}</div></div>
          <div class="filter-group"><h4>Pet</h4><div class="filter-list">${checks("species")}</div></div>
          <div class="filter-group"><h4>Category</h4><div class="filter-list">${checks("cat")}</div></div>
          <div class="filter-group"><h4>Colour</h4><div class="filter-swatches">${Object.entries(TT.COLORS).map(([k, c]) => `<button class="swatch ${list(params, "color").includes(k) ? "on" : ""}" style="background:${c.hex}" data-fc="${k}" title="${c.name}" aria-label="${c.name}" aria-pressed="${list(params, "color").includes(k)}"></button>`).join("")}</div></div>
          <div class="filter-group"><h4>Size</h4><div class="filter-sizes">${["XS", "S", "M", "L", "XL", "XXL"].map((s) => `<button class="chip ${list(params, "size").includes(s) ? "on" : ""}" data-fs="${s}">${s}</button>`).join("")}</div></div>
          <div class="filter-group"><h4>Max price</h4><input type="range" min="399" max="2799" step="100" value="${max}" data-fmax aria-label="Maximum price"><div class="range-row"><span>₹399</span><b data-maxlbl>${fmt(max)}</b></div></div>
          <label class="check"><input type="checkbox" data-fcustom ${params.get("custom") ? "checked" : ""}>Personalised only</label>
        </aside>
        <div>
          ${active.length ? `<div class="active-filters">${active.map(([k, v, n]) => `<button class="chip" data-rm="${k}" data-v="${esc(v)}">${esc(n)} ✕</button>`).join("")}<button class="link" style="font-size:13.5px" data-clear>Clear all</button></div>` : ""}
          ${results.length ? `<div class="grid">${results.map(TT.card).join("")}</div>`
            : `<div class="empty-state"><div style="width:130px;margin:0 auto">${ART.pet("#98BFE4", "sniff")}</div><h3>No tees match these filters</h3><p>Our sniff squad came back empty-pawed. Try removing a filter.</p><button class="btn" data-clear>Clear all filters</button></div>`}
        </div>
      </div></div>`;

    const mount = (root) => {
      const set = (fn) => {
        const p = new URLSearchParams(params); fn(p);
        [...p.keys()].forEach((k) => { if (!p.get(k)) p.delete(k); });
        const qs = p.toString();
        history.replaceState(null, "", "#/shop" + (qs ? "?" + qs : ""));
        const wasOpen = $("#filters", root).classList.contains("open");
        TT.render(true);
        if (wasOpen) $("#filters").classList.add("open");
      };
      const toggle = (p, k, v) => { const l = list(p, k); p.set(k, (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]).join(",")); };
      root.addEventListener("change", (e) => {
        const t = e.target;
        if (t.dataset.f) set((p) => toggle(p, t.dataset.f, t.value));
        else if ("fcustom" in t.dataset) set((p) => p.set("custom", t.checked ? "1" : ""));
        else if ("fmax" in t.dataset) set((p) => p.set("max", t.value === "2799" ? "" : t.value));
        else if (t.id === "sortSel") set((p) => p.set("sort", t.value === "popular" ? "" : t.value));
      });
      root.addEventListener("input", (e) => { if ("fmax" in e.target.dataset) $("[data-maxlbl]", root).textContent = fmt(e.target.value); });
      root.addEventListener("click", (e) => {
        const t = e.target;
        if (t.closest("[data-fc]")) set((p) => toggle(p, "color", t.closest("[data-fc]").dataset.fc));
        else if (t.closest("[data-fs]")) set((p) => toggle(p, "size", t.closest("[data-fs]").dataset.fs));
        else if (t.closest("[data-rm]")) { const b = t.closest("[data-rm]"); set((p) => (b.dataset.v && !["custom"].includes(b.dataset.rm) ? toggle(p, b.dataset.rm, b.dataset.v) : p.delete(b.dataset.rm))); }
        else if (t.closest("[data-clear]")) set((p) => [...p.keys()].forEach((k) => k !== "sort" && p.delete(k)));
        else if (t.closest("[data-ftoggle]")) $("#filters", root).classList.toggle("open");
      });
    };
    return { html, mount, title: shopTitle(params).replace(/&[^;]+;/g, "") };
  };
})();
