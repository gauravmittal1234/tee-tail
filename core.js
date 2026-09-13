/* Tee & Tail — state, cart, router and shared UI */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  TT.$ = $; TT.$$ = $$;

  /* ---------- Storage (safe) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("tt:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("tt:" + k, JSON.stringify(v)); } catch {} }
  };
  const S = (TT.S = {
    cart: store.get("cart", []),
    wish: store.get("wish", []),
    coupon: store.get("coupon", null),
    orders: store.get("orders", []),
    pin: store.get("pin", "")
  });
  TT.save = () => { ["cart", "wish", "coupon", "orders", "pin"].forEach((k) => store.set(k, S[k])); TT.updateBadges(); };

  /* ---------- Formatting ---------- */
  TT.esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  TT.fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  TT.off = (p) => Math.round((1 - p.price / p.mrp) * 100);
  TT.stars = (p) => `<span class="rating"><span class="star">★</span>${p.rating.toFixed(1)} <span class="count">(${p.reviews.toLocaleString("en-IN")})</span></span>`;
  TT.priceHtml = (p) => `<div class="price"><b>${TT.fmt(p.price)}</b><s>${TT.fmt(p.mrp)}</s><span class="off">${TT.off(p)}% off</span></div>`;
  TT.tile = (p) => "var(--t" + ((TT.PRODUCTS.indexOf(p) % 6) + 1) + ")";
  TT.forLabel = (p) => {
    const sp = p.species.map((s) => (s === "dog" ? "Dogs" : "Cats")).join(" & ");
    if (p.kind === "twin") return "You + " + sp.toLowerCase();
    if (p.kind === "human") return "For pawrents";
    return "For " + sp.toLowerCase();
  };
  TT.dateStr = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

  /* ---------- Sizes for a product ---------- */
  TT.sizeRows = (p, species) => {
    const sp = species || p.species[0];
    const human = { key: "size", label: "Your size", list: TT.SIZES.human, sub: (r) => r.chest + '"' };
    const pet = { key: "petSize", label: sp === "cat" ? "Your cat's size" : "Your dog's size", list: TT.SIZES[sp], sub: (r) => r.chest + "cm" };
    if (p.cat === "bandana") return [{ key: "petSize", label: "Bandana size", list: TT.SIZES.bandana, sub: (r) => r.neck + "cm" }];
    if (p.kind === "human") return [human];
    if (p.kind === "pet") return [pet];
    return [human, pet];
  };

  /* ---------- Cart ---------- */
  const lineKey = (l) => [l.id, l.color, l.size, l.petSize, l.species, l.name].join("|");
  TT.addToCart = (line) => {
    line.key = lineKey(line);
    const ex = S.cart.find((l) => l.key === line.key);
    if (ex) ex.qty = Math.min(10, ex.qty + line.qty);
    else S.cart.push(line);
    TT.save();
    const p = TT.byId(line.id);
    TT.toast(`Added ${TT.esc(p.name)}`, `<a href="#" data-act="open-cart">View bag</a>`);
  };
  TT.setQty = (key, q) => {
    const l = S.cart.find((x) => x.key === key);
    if (!l) return;
    if (q <= 0) S.cart = S.cart.filter((x) => x.key !== key);
    else l.qty = Math.min(10, q);
    TT.save();
  };
  TT.totals = () => {
    const sub = S.cart.reduce((a, l) => a + TT.byId(l.id).price * l.qty, 0);
    const mrp = S.cart.reduce((a, l) => a + TT.byId(l.id).mrp * l.qty, 0);
    const count = S.cart.reduce((a, l) => a + l.qty, 0);
    let discount = 0, couponOk = false;
    const c = S.coupon && TT.COUPONS[S.coupon];
    if (c && c.test({ items: S.cart, sub })) { discount = c.value({ items: S.cart, sub }); couponOk = true; }
    const after = sub - discount;
    const ship = sub === 0 || after >= TT.BRAND.freeShip ? 0 : TT.BRAND.shipFee;
    return { sub, mrp, count, discount, couponOk, ship, total: after + ship, saved: mrp - sub + discount };
  };
  TT.lineMeta = (l) => {
    const p = TT.byId(l.id), parts = [TT.COLORS[l.color].name];
    if (l.size) parts.push((p.kind === "twin" ? "You " : "") + l.size);
    if (l.petSize) parts.push((p.cat === "bandana" ? "" : (l.species === "cat" ? "Cat " : "Dog ")) + l.petSize);
    if (l.name) parts.push("“" + l.name + "”");
    return parts.join(" · ");
  };

  /* ---------- Wishlist ---------- */
  TT.toggleWish = (id) => {
    const on = S.wish.includes(id);
    S.wish = on ? S.wish.filter((x) => x !== id) : [...S.wish, id];
    TT.save();
    $$(`[data-act="wish"][data-id="${id}"]`).forEach((b) => { b.classList.toggle("on", !on); b.setAttribute("aria-pressed", String(!on)); });
    TT.toast(on ? "Removed from wishlist" : "Saved to wishlist", on ? "" : `<a href="#/wishlist">See wishlist</a>`);
  };

  /* ---------- Delivery estimate ---------- */
  TT.delivery = (pin, custom) => {
    if (!/^[1-8]\d{5}$/.test(pin)) return { ok: false, msg: "Enter a valid 6-digit Indian pincode." };
    const metro = ["11", "40", "41", "50", "56", "60", "70", "12", "20"].includes(pin.slice(0, 2));
    const days = (metro ? 3 : 5) + (custom ? 3 : 0);
    const d = new Date(); d.setDate(d.getDate() + days);
    return { ok: true, date: d, metro, msg: `Delivers by <b>${TT.dateStr(d)}</b> · COD available${metro ? " · Metro express" : ""}` };
  };

  /* ---------- Product card ---------- */
  TT.card = (p) => {
    const w = S.wish.includes(p.id);
    const badgeCls = p.badge === "Bestseller" ? "hot" : p.isNew ? "new" : "";
    return `<article class="card">
      <a class="card-media" href="#/product/${p.id}" style="background:${TT.tile(p)}" aria-label="${TT.esc(p.name)}">
        ${TT.ART.product(p)}
        ${p.badge ? `<span class="card-badge ${badgeCls}">${p.badge}</span>` : ""}
      </a>
      <button class="wish ${w ? "on" : ""}" data-act="wish" data-id="${p.id}" aria-pressed="${w}" aria-label="Save ${TT.esc(p.name)} to wishlist">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/></svg>
      </button>
      <div class="card-body">
        <span class="card-for">${TT.forLabel(p)}</span>
        <a class="card-title" href="#/product/${p.id}">${TT.esc(p.name)}</a>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">${TT.stars(p)}<span class="card-swatches">${p.colors.map((c) => `<i style="background:${TT.COLORS[c].hex}" title="${TT.COLORS[c].name}"></i>`).join("")}</span></div>
        ${TT.priceHtml(p)}
        <div class="card-foot"><button class="btn sm block" data-act="quick" data-id="${p.id}">Add to bag</button></div>
      </div>
    </article>`;
  };
  // wish button sits over the media; keep it positioned relative to the card
  const st = document.createElement("style");
  st.textContent = ".card{position:relative}";
  document.head.appendChild(st);

  /* ---------- Toasts ---------- */
  TT.toast = (msg, extra = "") => {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<span>${msg}</span>${extra}`;
    $("#toasts").appendChild(t);
    setTimeout(() => t.remove(), 3200);
  };

  /* ---------- Overlay (drawer + modal) ---------- */
  let lastFocus = null;
  const scrim = () => $("#scrim");
  function showOverlay(el) {
    lastFocus = document.activeElement;
    scrim().hidden = false; el.hidden = false;
    requestAnimationFrame(() => { scrim().classList.add("show"); el.classList.add("show"); });
    document.body.style.overflow = "hidden";
    setTimeout(() => { const f = el.querySelector("input, button, [href]"); f && f.focus({ preventScroll: true }); }, 60);
  }
  TT.closeAll = () => {
    ["#drawer", "#modal"].forEach((s) => { const el = $(s); if (!el.hidden) { el.classList.remove("show"); setTimeout(() => (el.hidden = true), 250); } });
    scrim().classList.remove("show");
    setTimeout(() => (scrim().hidden = true), 220);
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  };
  TT.openModal = (html, mount) => {
    $("#drawer").hidden = true;
    const inner = document.createElement("div");
    inner.innerHTML = html;
    $("#modal").replaceChildren(inner);
    mount && mount(inner);
    showOverlay($("#modal"));
  };
  TT.openCart = () => { $("#modal").hidden = true; TT.renderCart(); showOverlay($("#drawer")); };
  const X = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`;
  TT.X = X;

  /* ---------- Cart drawer ---------- */
  TT.renderCart = () => {
    const t = TT.totals(), d = $("#drawer");
    const left = TT.BRAND.freeShip - (t.sub - t.discount);
    const body = !S.cart.length
      ? `<div class="empty-state" style="margin-top:12px"><div style="width:120px;margin:0 auto">${TT.ART.pet("#F4A340", "dogface")}</div><h3>Your bag is empty</h3><p>Even the good boy is disappointed. Let's fix that.</p><a class="btn" href="#/shop?kind=twin" data-act="close">Shop twinning sets</a></div>`
      : `<div class="ship-bar">${left > 0 ? `Add <b>${TT.fmt(left)}</b> more for free shipping` : `<b>You've unlocked free shipping</b> 🎉`}<div class="track"><div class="fill" style="width:${Math.min(100, ((t.sub - t.discount) / TT.BRAND.freeShip) * 100)}%"></div></div></div>
         ${S.cart.map((l) => { const p = TT.byId(l.id); return `<div class="line-item">
           <a class="thumb" href="#/product/${p.id}" data-act="close" style="background:${TT.tile(p)}">${TT.ART.product(p, l.color, { name: l.name })}</a>
           <div><div class="li-title">${TT.esc(p.name)}</div><div class="li-meta">${TT.esc(TT.lineMeta(l))}</div>
             <div class="qty sm"><button data-act="qty" data-key="${TT.esc(l.key)}" data-d="-1" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button data-act="qty" data-key="${TT.esc(l.key)}" data-d="1" aria-label="Increase quantity">+</button></div>
           </div>
           <div><div class="li-price">${TT.fmt(p.price * l.qty)}</div><button class="li-remove" data-act="remove" data-key="${TT.esc(l.key)}">Remove</button></div>
         </div>`; }).join("")}`;
    const foot = !S.cart.length ? "" : `<div class="drawer-foot">
      ${TT.couponBox(t)}
      <div class="sum-row"><span>Bag total (MRP ${TT.fmt(t.mrp)})</span><span>${TT.fmt(t.sub)}</span></div>
      ${t.discount ? `<div class="sum-row"><span>Coupon ${S.coupon}</span><span class="save">−${TT.fmt(t.discount)}</span></div>` : ""}
      <div class="sum-row"><span>Shipping</span><span>${t.ship ? TT.fmt(t.ship) : "Free"}</span></div>
      <div class="sum-row total"><span>To pay</span><span>${TT.fmt(t.total)}</span></div>
      <div class="sum-row"><span class="save">You save ${TT.fmt(t.saved)} on this order</span></div>
      <a class="btn block" href="#/checkout" data-act="close">Checkout securely</a>
    </div>`;
    d.innerHTML = `<div class="drawer-head"><h3>Your bag${t.count ? ` <span class="muted" style="font-size:15px;font-weight:500">· ${t.count} item${t.count > 1 ? "s" : ""}</span>` : ""}</h3><button class="close-btn" data-act="close" aria-label="Close bag">${X}</button></div>
      <div class="drawer-body">${body}</div>${foot}`;
  };
  TT.couponBox = (t) => {
    const applied = S.coupon && t.couponOk;
    const pending = S.coupon && !t.couponOk;
    return `<div>
      ${applied ? `<div class="twin-note" style="justify-content:space-between"><span>${S.coupon} applied — ${TT.COUPONS[S.coupon].label}</span><button class="li-remove" style="margin:0" data-act="coupon-remove">Remove</button></div>`
        : `<form class="coupon" data-act="coupon-form"><input class="input" name="code" placeholder="Coupon code" aria-label="Coupon code" value="${pending ? S.coupon : ""}"><button class="btn navy sm" type="submit">Apply</button></form>
           ${pending ? `<div class="pin-msg err" style="margin-top:6px">${TT.COUPONS[S.coupon].need}</div>` : ""}
           <div class="coupon-hints" style="margin-top:8px">${Object.keys(TT.COUPONS).map((k) => `<button type="button" data-act="coupon-pick" data-code="${k}" title="${TT.COUPONS[k].label}">${k}</button>`).join("")}</div>`}
    </div>`;
  };
  TT.refreshCartViews = () => {
    TT.updateBadges();
    if (!$("#drawer").hidden) TT.renderCart();
    if (TT.route.path === "checkout") TT.render(true);
  };

  /* ---------- Badges & theme ---------- */
  TT.updateBadges = () => {
    const c = S.cart.reduce((a, l) => a + l.qty, 0), w = S.wish.length;
    const cb = $("#cartCount"), wb = $("#wishCount");
    cb.hidden = !c; cb.textContent = c;
    wb.hidden = !w; wb.textContent = w;
  };
  const themeKey = store.get("theme", null);
  if (themeKey) document.documentElement.dataset.theme = themeKey;
  $("#themeBtn").addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("theme", next);
  });

  /* ---------- Search ---------- */
  TT.search = (q) => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return TT.PRODUCTS.slice();
    return TT.PRODUCTS.filter((p) => {
      const hay = [p.name, p.desc, p.kind === "twin" ? "twinning set matching" : p.kind === "human" ? "human pawrent parent" : "pet", p.species.join(" "), p.cat, p.print, p.colors.join(" "), p.badge || ""].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w.replace(/s$/, "")));
    });
  };
  const si = $("#searchInput"), sp = $("#searchPop");
  si.addEventListener("input", () => {
    const q = si.value.trim();
    if (!q) { sp.hidden = true; return; }
    const r = TT.search(q).slice(0, 6);
    sp.innerHTML = r.length
      ? r.map((p) => `<a href="#/product/${p.id}"><span class="thumb" style="background:${TT.tile(p)}">${TT.ART.product(p)}</span><span><b style="color:var(--ink);font-weight:700">${TT.esc(p.name)}</b><br><span class="muted" style="font-size:13px">${TT.fmt(p.price)} · ${TT.forLabel(p)}</span></span></a>`).join("") +
        `<a href="#/shop?q=${encodeURIComponent(q)}" style="justify-content:center;font-weight:700;color:var(--accent)">See all results for “${TT.esc(q)}”</a>`
      : `<div class="empty">No tees match “${TT.esc(q)}”. Try “dog”, “cat”, “hoodie” or “twinning”.</div>`;
    sp.hidden = false;
  });
  si.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { location.hash = "#/shop?q=" + encodeURIComponent(si.value.trim()); sp.hidden = true; si.blur(); }
    if (e.key === "Escape") { sp.hidden = true; }
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".search")) sp.hidden = true; });
  sp.addEventListener("click", (e) => { if (e.target.closest("a")) { sp.hidden = true; si.value = ""; } });

  /* ---------- Router ---------- */
  TT.route = { path: "", arg: "", params: new URLSearchParams() };
  TT.parse = () => {
    const h = location.hash.replace(/^#\/?/, "");
    const [p, qs] = h.split("?");
    const [path, arg] = p.split("/");
    return { path: path || "", arg: decodeURIComponent(arg || ""), params: new URLSearchParams(qs || "") };
  };
  TT.render = (keepScroll) => {
    const r = (TT.route = TT.parse());
    const views = TT.V || {};
    const map = { "": views.home, shop: views.shop, product: views.product, checkout: views.checkout, orders: views.orders, order: views.order, wishlist: views.wishlist, "size-guide": views.sizeGuide, faq: views.faq };
    const view = map[r.path] || views.notFound;
    const out = view(r);
    // fresh container each render so view listeners never pile up
    const box = document.createElement("div");
    box.innerHTML = typeof out === "string" ? out : out.html;
    $("#app").replaceChildren(box);
    if (out && out.mount) out.mount(box);
    if (!keepScroll) window.scrollTo({ top: 0, behavior: "instant" });
    // nav highlight
    const p = r.params, key = r.path === "size-guide" ? "size" : r.path !== "shop" ? "" :
      p.get("kind") === "twin" ? "twin" : p.get("species") === "dog" ? "dog" : p.get("species") === "cat" ? "cat" : p.get("kind") === "human" ? "human" :
      p.get("cat") === "hoodie" ? "hoodie" : p.get("cat") === "bandana" ? "bandana" : p.get("custom") ? "custom" : p.get("sort") === "discount" ? "offers" : "";
    $$("#nav a").forEach((a) => a.classList.toggle("on", a.dataset.nav === key));
    document.title = (out && out.title ? out.title + " · " : "") + "Tee & Tail";
  };
  window.addEventListener("hashchange", () => { TT.closeAll(); TT.render(); });

  /* ---------- Global actions ---------- */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act === "open-cart") { e.preventDefault(); TT.openCart(); }
    else if (act === "close") { if (el.tagName !== "A") e.preventDefault(); TT.closeAll(); }
    else if (act === "wish") { e.preventDefault(); TT.toggleWish(el.dataset.id); if (TT.route.path === "wishlist") TT.render(true); }
    else if (act === "quick") { e.preventDefault(); TT.quickAdd(el.dataset.id); }
    else if (act === "qty") { const l = S.cart.find((x) => x.key === el.dataset.key); if (l) { TT.setQty(l.key, l.qty + +el.dataset.d); TT.refreshCartViews(); } }
    else if (act === "remove") { TT.setQty(el.dataset.key, 0); TT.refreshCartViews(); TT.toast("Removed from bag"); }
    else if (act === "coupon-pick") { TT.applyCoupon(el.dataset.code); }
    else if (act === "coupon-remove") { S.coupon = null; TT.save(); TT.refreshCartViews(); }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.matches('[data-act="coupon-form"]')) { e.preventDefault(); TT.applyCoupon(e.target.code.value); }
  });
  TT.applyCoupon = (raw) => {
    const code = String(raw || "").trim().toUpperCase();
    if (!code) return;
    if (!TT.COUPONS[code]) { TT.toast(`“${TT.esc(code)}” isn't a valid code. Try TWINNING15.`); return; }
    S.coupon = code; TT.save(); TT.refreshCartViews();
    const t = TT.totals();
    TT.toast(t.couponOk ? `${code} applied · you save ${TT.fmt(t.discount)}` : TT.COUPONS[code].need);
  };
  $("#cartBtn").addEventListener("click", TT.openCart);
  $("#scrim").addEventListener("click", TT.closeAll);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#scrim").hidden) TT.closeAll(); });
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#newsEmail").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { TT.toast("Enter an email like you@example.com"); return; }
    $("#newsEmail").value = "";
    TT.toast("You're on the list — new drops land in your inbox first.");
  });

  TT.start = () => { TT.updateBadges(); TT.render(); };
})();
