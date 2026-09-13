/* Tee & Tail — product, checkout, orders, wishlist, size guide, FAQ */
(function () {
  const V = TT.V, S = TT.S, ART = TT.ART;
  const { $, $$, esc, fmt } = TT;

  /* ================= Product ================= */
  const picks = {}, views = {};
  const fabric = (p) => p.cat === "hoodie"
    ? (p.kind === "pet" ? "320 GSM brushed fleece (80% cotton, 20% polyester), leash slit at the back" : "320–380 GSM loopback fleece, ribbed cuffs and hem")
    : p.cat === "bandana" ? "100% cotton poplin, double-layered and reversible, slip-over collar sleeve"
    : p.kind === "human" ? (p.id === "human-dog-parent" ? "220 GSM heavyweight combed cotton, drop-shoulder oversized fit" : "180 GSM combed cotton, bio-washed, regular fit")
    : p.kind === "pet" ? "160 GSM cotton with 5% spandex for stretch, rib collar, wide leg openings"
    : "Human tee: 180 GSM combed cotton. Pet tee: 160 GSM cotton with 5% spandex, rib collar";

  V.product = (r) => {
    const p = TT.byId(r.arg);
    if (!p) return V.notFound();
    const st = (picks[p.id] = picks[p.id] || TT.newPick(p));
    const vlist = ART.views(p);
    const view = views[p.id] || vlist[0][0];
    const vlabel = (vlist.find((v) => v[0] === view) || vlist[0])[1];
    const related = TT.PRODUCTS.filter((x) => x.id !== p.id && (x.kind === p.kind || x.print === p.print)).slice(0, 8);
    const dlv = S.pin ? TT.delivery(S.pin, p.custom) : null;
    const crumb = p.kind === "twin" ? ["Twinning sets", "#/shop?kind=twin"] : p.kind === "human" ? ["Pawrents", "#/shop?kind=human"] : p.species[0] === "cat" ? ["Cats", "#/shop?kind=pet&species=cat"] : ["Dogs", "#/shop?kind=pet&species=dog"];
    const wished = S.wish.includes(p.id);

    const html = `<div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><a href="${crumb[1]}">${crumb[0]}</a><span>/</span><span>${esc(p.name)}</span></nav>
      <div class="pdp">
        <div class="gallery">
          <div class="thumbs">${vlist.map(([k, n]) => `<button class="${k === view ? "on" : ""}" style="background:${TT.tile(p)}" data-view="${k}" aria-label="${n}">${ART.product(p, st.color, { view: k, name: st.name })}</button>`).join("")}</div>
          <div class="main-img" style="background:${TT.tile(p)}" data-main>${ART.product(p, st.color, { view, name: st.name })}<span class="view-label">${vlabel} · ${TT.COLORS[st.color].name}</span></div>
        </div>
        <div class="pdp-info">
          <div><span class="card-for">${TT.forLabel(p)}${p.badge ? " · " + p.badge : ""}</span>
            <h1 style="margin:8px 0 10px">${esc(p.name)}</h1>
            <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">${TT.stars(p)}<span class="muted" style="font-size:13px">${p.reviews.toLocaleString("en-IN")} verified reviews</span></div></div>
          <div class="pdp-price">${TT.priceHtml(p)}<div class="tax">Inclusive of all taxes · or 3 interest-free UPI payments of ${fmt(Math.ceil(p.price / 3))}</div></div>
          ${p.kind === "twin" ? `<div class="twin-note"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="12" r="5"/><circle cx="17" cy="13" r="3.5"/></svg>This set is 1 tee for you + 1 tee for your pet. Pick both sizes.</div>` : ""}
          <div style="display:flex;flex-direction:column;gap:18px" data-picker>${TT.pickerHtml(p, st, { guide: true })}</div>
          <div class="buy-row">
            <div class="qty" aria-label="Quantity"><button data-q="-1" aria-label="Decrease">−</button><span>${st.qty}</span><button data-q="1" aria-label="Increase">+</button></div>
            <button class="btn" data-add>Add to bag</button>
            <button class="btn navy" data-buy>Buy now</button>
            <button class="wish ${wished ? "on" : ""}" style="position:static;width:46px;height:46px;box-shadow:inset 0 0 0 1.5px var(--line)" data-act="wish" data-id="${p.id}" aria-pressed="${wished}" aria-label="Save to wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/></svg></button>
          </div>
          <form class="pin-box" data-pin><label for="pinIn" style="font-weight:700;color:var(--ink)">Check delivery date</label>
            <div class="pin-row"><input class="input" id="pinIn" inputmode="numeric" maxlength="6" placeholder="6-digit pincode" value="${esc(S.pin)}"><button class="btn navy sm" style="height:46px">Check</button></div>
            <div class="pin-msg ${dlv ? (dlv.ok ? "ok" : "err") : ""}" data-pinmsg>${dlv ? dlv.msg : "Enter your pincode to see when it reaches you."}</div></form>
          <div class="perks"><div><b>Free shipping</b>on orders over ${fmt(TT.BRAND.freeShip)}</div><div><b>15-day exchange</b>free size swaps, pickup included</div><div><b>Cash on delivery</b>plus UPI, cards &amp; netbanking</div></div>
          <div class="acc">
            <details open><summary>About this ${p.cat === "bandana" ? "bandana" : p.kind === "twin" ? "set" : p.cat}</summary><div class="acc-body"><p>${esc(p.desc)}</p></div></details>
            <details><summary>Fabric &amp; fit</summary><div class="acc-body"><ul><li>${fabric(p)}</li><li>Water-based, AZO-free inks — OEKO-TEX certified</li><li>Knitted, cut and printed in Tiruppur, Tamil Nadu</li>${p.kind !== "human" && p.cat !== "bandana" ? "<li>Pet tees: measure chest just behind the front legs; if between sizes, size up</li>" : ""}</ul></div></details>
            <details><summary>Wash care</summary><div class="acc-body"><ul><li>Turn inside out, cold machine wash with similar colours</li><li>Line dry in shade; skip the tumble dryer</li><li>Iron inside out, never on the print</li></ul></div></details>
            <details><summary>Shipping &amp; exchange</summary><div class="acc-body"><p>Metro cities in 2–4 days, rest of India in 4–7 days${p.custom ? "; personalised items take 3–4 extra working days to print" : ""}. Free size exchange within 15 days on unwashed items with tags.${p.custom ? " Personalised items can be exchanged for size but not returned." : ""}</p></div></details>
          </div>
        </div>
      </div>
      ${related.length ? `<section class="section"><div class="sec-head"><div><h2>Pairs well with</h2><p>Complete the look — for them, or for you.</p></div></div><div class="rail">${related.map(TT.card).join("")}</div></section>` : ""}
    </div>`;

    const mount = (root) => {
      const rerender = (focusSel) => { TT.render(true); if (focusSel) { const el = $(focusSel); el && el.focus({ preventScroll: true }); } };
      TT.bindPicker($("[data-picker]", root), p, st, (k, v) => rerender(`[data-pick="${k}"][data-v="${v}"]`), () => {
        $("[data-main]", root).innerHTML = ART.product(p, st.color, { view, name: st.name }) + `<span class="view-label">${vlabel} · ${TT.COLORS[st.color].name}</span>`;
      });
      root.addEventListener("click", (e) => {
        const t = e.target;
        const vb = t.closest("[data-view]");
        if (vb) { views[p.id] = vb.dataset.view; rerender(`[data-view="${vb.dataset.view}"]`); return; }
        const q = t.closest("[data-q]");
        if (q) { st.qty = Math.max(1, Math.min(10, st.qty + +q.dataset.q)); $(".qty span", root).textContent = st.qty; return; }
        if (t.closest("[data-add]") || t.closest("[data-buy]")) {
          const miss = TT.missing(p, st);
          if (miss) { const er = $("[data-err]", root); er.textContent = miss; er.scrollIntoView({ block: "center", behavior: "smooth" }); return; }
          TT.addToCart(TT.lineFrom(p, st));
          st.qty = 1;
          if (t.closest("[data-buy]")) location.hash = "#/checkout"; else TT.openCart();
          return;
        }
        if (t.closest('[data-act="guide"]')) { e.stopPropagation(); TT.sizeModal(p, st); }
      });
      $("[data-pin]", root).addEventListener("submit", (e) => {
        e.preventDefault();
        const v = $("#pinIn", root).value.trim(), d = TT.delivery(v, p.custom), m = $("[data-pinmsg]", root);
        m.className = "pin-msg " + (d.ok ? "ok" : "err"); m.innerHTML = d.msg;
        if (d.ok) { S.pin = v; TT.save(); }
      });
    };
    return { html, mount, title: p.name };
  };

  /* ================= Size guide (modal + page) ================= */
  const tableFor = (key, hl) => {
    const rows = TT.SIZES[key];
    const cols = key === "human" ? [["s", "Size"], ["chest", 'Chest (in)'], ["length", 'Length (in)'], ["fits", "Fits body chest"]]
      : key === "bandana" ? [["s", "Size"], ["neck", "Neck (cm)"], ["breeds", "Good for"]]
      : [["s", "Size"], ["chest", "Chest (cm)"], ["neck", "Neck (cm)"], ["back", "Back length (cm)"], ["breeds", "Typical breeds"]];
    return `<div class="table-wrap"><table class="size-table"><thead><tr>${cols.map((c) => `<th>${c[1]}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr class="${r.s === hl ? "hl" : ""}">${cols.map((c) => `<td>${esc(r[c[0]])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  };
  const measureTip = `<p class="muted" style="font-size:14px">Measure the <b>chest</b> at its widest point, just behind the front legs, with a soft tape snug but not tight. <b>Back length</b> runs from the base of the neck to the base of the tail. Between two sizes? Go up one.</p>`;
  TT.sizeModal = (p, st) => {
    const sets = p.cat === "bandana" ? [["bandana", "Bandana"]] : p.kind === "human" ? [["human", "Your tee"]] : p.kind === "pet" ? [[st.species, st.species === "cat" ? "Cat tee" : "Dog tee"]] : [["human", "Your tee"], [st.species, st.species === "cat" ? "Cat tee" : "Dog tee"]];
    TT.openModal(`<div style="display:flex;justify-content:space-between;gap:12px;align-items:start"><div><h3>Size guide</h3><p class="muted" style="font-size:14px">${esc(p.name)}</p></div><button class="close-btn" data-act="close" aria-label="Close">${TT.X}</button></div>
      ${sets.map(([k, n]) => `<h4 style="margin:18px 0 8px;font-size:15px">${n}</h4>${tableFor(k, k === "human" ? st.size : st.petSize)}`).join("")}
      <div style="margin-top:16px">${measureTip}</div>`);
  };

  V.sizeGuide = () => ({
    title: "Size guide",
    html: `<div class="wrap"><nav class="crumbs"><a href="#/">Home</a><span>/</span><span>Size guide</span></nav>
      <div class="shop-head"><div><h1>Size guide</h1><p class="muted">Pet sizes are in centimetres; human sizes in inches.</p></div></div>
      <div class="panel">${measureTip}</div>
      <div class="panel"><h2>Dog tees &amp; hoodies</h2>${tableFor("dog")}</div>
      <div class="panel"><h2>Cat tees</h2>${tableFor("cat")}</div>
      <div class="panel"><h2>Pawrent tees &amp; hoodies</h2>${tableFor("human")}<p class="muted" style="font-size:13.5px;margin-top:10px">Measurements are of the garment laid flat, chest measured armpit to armpit and doubled. The Dog Parent tee is oversized — size down for a regular fit.</p></div>
      <div class="panel"><h2>Bandanas</h2>${tableFor("bandana")}</div></div>`
  });

  V.faq = () => ({
    title: "FAQs",
    html: `<div class="wrap"><nav class="crumbs"><a href="#/">Home</a><span>/</span><span>FAQs</span></nav>
      <div class="shop-head"><div><h1>Shipping, exchanges &amp; FAQs</h1><p class="muted">Still stuck? Write to hello@teeandtail.in — a human (with a dog) replies within a day.</p></div></div>
      <div class="faq">${TT.FAQ.map(([q, a], i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div>`
  });

  /* ================= Checkout ================= */
  const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
  const PIN_CITY = { "11": ["New Delhi", "Delhi"], "40": ["Mumbai", "Maharashtra"], "41": ["Pune", "Maharashtra"], "56": ["Bengaluru", "Karnataka"], "60": ["Chennai", "Tamil Nadu"], "70": ["Kolkata", "West Bengal"], "50": ["Hyderabad", "Telangana"], "30": ["Jaipur", "Rajasthan"], "38": ["Ahmedabad", "Gujarat"], "12": ["Gurugram", "Haryana"], "20": ["Noida", "Uttar Pradesh"], "68": ["Kochi", "Kerala"] };
  const FIELDS = [
    ["name", "Full name", "text", (v) => v.trim().length >= 2 || "Enter the name for delivery."],
    ["phone", "Mobile number", "tel", (v) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)) && v.replace(/\D/g, "").length >= 10 || "Enter a 10-digit mobile number starting with 6–9."],
    ["email", "Email", "email", (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter an email like you@example.com."],
    ["pin", "Pincode", "text", (v) => /^[1-8]\d{5}$/.test(v.trim()) || "Enter a valid 6-digit pincode."],
    ["line1", "House no., building, street", "text", (v) => v.trim().length >= 5 || "Add your house number and street.", true],
    ["landmark", "Landmark (optional)", "text", () => true],
    ["city", "City", "text", (v) => v.trim().length >= 2 || "Enter your city."],
    ["state", "State", "select", (v) => !!v || "Choose your state."]
  ];
  let draft = null;
  const loadDraft = () => { if (!draft) { try { draft = JSON.parse(localStorage.getItem("tt:addr")) || {}; } catch { draft = {}; } draft.pay = draft.pay || "upi"; if (!draft.pin && S.pin) draft.pin = S.pin; } return draft; };
  const saveDraft = () => { try { localStorage.setItem("tt:addr", JSON.stringify(draft)); } catch {} };
  let errors = {};

  const summaryHtml = (t) => `<div class="panel summary"><h2>Order summary</h2>
    <div style="display:flex;flex-direction:column;gap:12px">${S.cart.map((l) => { const p = TT.byId(l.id); return `<div class="line-item"><span class="thumb" style="background:${TT.tile(p)}">${ART.product(p, l.color, { name: l.name })}</span>
      <div><div class="li-title" style="font-size:14px">${esc(p.name)}</div><div class="li-meta">${esc(TT.lineMeta(l))}</div>
      <div class="qty sm"><button data-act="qty" data-key="${esc(l.key)}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-act="qty" data-key="${esc(l.key)}" data-d="1" aria-label="Increase">+</button></div></div>
      <div class="li-price">${fmt(p.price * l.qty)}</div></div>`; }).join("")}</div>
    <div style="display:flex;flex-direction:column;gap:10px;margin-top:18px">${TT.couponBox(t)}
      <div class="sum-row"><span>Bag total</span><span>${fmt(t.sub)}</span></div>
      ${t.discount ? `<div class="sum-row"><span>Coupon ${S.coupon}</span><span class="save">−${fmt(t.discount)}</span></div>` : ""}
      <div class="sum-row"><span>Shipping</span><span>${t.ship ? fmt(t.ship) : "Free"}</span></div>
      <div class="sum-row total"><span>To pay</span><span>${fmt(t.total)}</span></div>
      <div class="sum-row"><span class="save">You save ${fmt(t.saved)} vs MRP</span></div></div></div>`;

  V.checkout = () => {
    if (!S.cart.length) return { title: "Checkout", html: `<div class="wrap"><div class="empty-state" style="margin-top:28px"><div style="width:130px;margin:0 auto">${ART.pet("#F2B4AB", "catface")}</div><h3>Nothing to check out yet</h3><p>Your bag is empty — the manager is unimpressed.</p><a class="btn" href="#/shop">Start shopping</a></div></div>` };
    const d = loadDraft(), t = TT.totals();
    const field = ([k, label, type, , full]) => `<div class="field ${full || k === "landmark" ? "full" : ""} ${errors[k] ? "invalid" : ""}"><label for="f-${k}">${label}</label>
      ${type === "select" ? `<select class="select" id="f-${k}" name="${k}"><option value="">Select state</option>${STATES.map((s) => `<option ${d[k] === s ? "selected" : ""}>${s}</option>`).join("")}</select>`
        : `<input class="input" id="f-${k}" name="${k}" type="${type}" value="${esc(d[k] || "")}" ${k === "pin" ? 'inputmode="numeric" maxlength="6"' : ""} ${k === "phone" ? 'inputmode="tel" placeholder="98765 43210"' : ""} autocomplete="${{ name: "name", phone: "tel-national", email: "email", pin: "postal-code", line1: "address-line1", city: "address-level2", state: "address-level1" }[k] || "off"}">`}
      <span class="err">${errors[k] || ""}</span></div>`;
    const dlv = /^[1-8]\d{5}$/.test(d.pin || "") ? TT.delivery(d.pin, S.cart.some((l) => TT.byId(l.id).custom)) : null;
    const html = `<div class="wrap"><nav class="crumbs"><a href="#/">Home</a><span>/</span><span>Checkout</span></nav>
      <div class="steps"><span class="on"><span class="dot">✓</span>Bag</span><span class="sep"></span><span class="on"><span class="dot">2</span>Address &amp; payment</span><span class="sep"></span><span><span class="dot">3</span>Confirmation</span></div>
      <form class="checkout" id="coForm" novalidate>
        <div>
          <div class="panel"><h2>Delivery address</h2><div class="form-grid">${FIELDS.map(field).join("")}</div>
            <div class="pin-msg ok" style="margin-top:12px" data-dlv>${dlv && dlv.ok ? dlv.msg : ""}</div></div>
          <div class="panel"><h2>Payment</h2>
            ${[["upi", "UPI", "GPay, PhonePe, Paytm or any UPI app"], ["card", "Card / Netbanking", "Visa, Mastercard, RuPay and 50+ banks via our secure payment partner"], ["cod", "Cash on delivery", "Pay by cash or UPI when your order arrives"]]
              .map(([v, b, s]) => `<label class="pay-opt"><input type="radio" name="pay" value="${v}" ${d.pay === v ? "checked" : ""}><span><b>${b}</b><span>${s}</span></span></label>`).join("")}
            <label class="check" style="margin-top:16px"><input type="checkbox" name="gift" ${d.gift ? "checked" : ""}>This is a gift — hide prices on the invoice</label>
          </div>
        </div>
        <div>${summaryHtml(t)}
          <button class="btn block" type="submit" style="margin-top:16px;height:52px;font-size:16px">${d.pay === "cod" ? "Place COD order" : "Pay"} · ${fmt(t.total)}</button>
          <p class="muted" style="font-size:12.5px;text-align:center;margin-top:10px">Demo store: no payment is taken. Your order is saved in this browser.</p></div>
      </form></div>`;

    const mount = (root) => {
      const form = $("#coForm", root);
      form.addEventListener("input", (e) => {
        const n = e.target.name; if (!n) return;
        d[n] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        if (n === "pin" && /^[1-8]\d{5}$/.test(d.pin)) {
          const m = PIN_CITY[d.pin.slice(0, 2)];
          if (m) { if (!d.city) { d.city = m[0]; form.city.value = m[0]; } if (!d.state) { d.state = m[1]; form.state.value = m[1]; } }
          const x = TT.delivery(d.pin, S.cart.some((l) => TT.byId(l.id).custom)); $("[data-dlv]", root).innerHTML = x.msg;
        }
        if (errors[n]) { delete errors[n]; const f = e.target.closest(".field"); f.classList.remove("invalid"); f.querySelector(".err").textContent = ""; }
        saveDraft();
      });
      form.addEventListener("change", (e) => { if (e.target.name === "pay" || e.target.name === "state") { d[e.target.name] = e.target.value; saveDraft(); if (e.target.name === "pay") TT.render(true); } });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        errors = {};
        FIELDS.forEach(([k, , , test]) => { const r = test(d[k] || ""); if (r !== true) errors[k] = r; });
        if (Object.keys(errors).length) { TT.render(true); const f = $(".field.invalid .input, .field.invalid .select"); f && f.focus(); TT.toast("Check the highlighted fields"); return; }
        const tt = TT.totals();
        const order = { id: "TT" + String(Date.now()).slice(-7), date: Date.now(), items: S.cart.map((l) => ({ ...l })), totals: tt, coupon: tt.couponOk ? S.coupon : null,
          addr: { name: d.name, phone: d.phone, email: d.email, pin: d.pin, line1: d.line1, landmark: d.landmark, city: d.city, state: d.state }, pay: d.pay, gift: !!d.gift,
          eta: TT.delivery(d.pin, S.cart.some((l) => TT.byId(l.id).custom)).date.getTime() };
        S.orders.unshift(order); S.cart = []; S.coupon = null; S.pin = d.pin; TT.save();
        location.hash = "#/order/" + order.id;
      });
    };
    return { html, mount, title: "Checkout" };
  };

  /* ================= Orders ================= */
  const payName = { upi: "UPI", card: "Card / Netbanking", cod: "Cash on delivery" };
  const timeline = (o) => {
    const age = Date.now() - o.date;
    const steps = [["Placed", true], ["Packed", age > 20 * 60e3], ["Shipped", age > 864e5], ["Delivered", Date.now() > o.eta]];
    return `<div class="timeline">${steps.map(([n, done]) => `<div class="tl-step ${done ? "done" : ""}"><i>${done ? "✓" : ""}</i>${n}</div>`).join("")}</div>`;
  };
  const orderCard = (o, full) => `<div class="order-card">
    <div class="order-top"><div><b>Order ${o.id}</b><div class="muted" style="font-size:13.5px">Placed ${TT.dateStr(new Date(o.date))} · ${payName[o.pay]} · ${o.items.reduce((a, l) => a + l.qty, 0)} item(s)</div></div>
      <div style="text-align:right"><b>${fmt(o.totals.total)}</b><div class="muted" style="font-size:13.5px">Arriving by ${TT.dateStr(new Date(o.eta))}</div></div></div>
    ${timeline(o)}
    ${full ? `<div style="display:flex;flex-direction:column;gap:12px">${o.items.map((l) => { const p = TT.byId(l.id); return `<div class="line-item" style="grid-template-columns:64px 1fr auto"><span class="thumb" style="width:64px;height:64px;background:${TT.tile(p)}">${ART.product(p, l.color, { name: l.name })}</span><div><a class="li-title" href="#/product/${p.id}">${esc(p.name)}</a><div class="li-meta">${esc(TT.lineMeta(l))} · Qty ${l.qty}</div></div><div class="li-price">${fmt(p.price * l.qty)}</div></div>`; }).join("")}</div>
      <div class="form-grid"><div><div class="opt-head">Delivering to</div><p class="muted" style="font-size:14px">${esc(o.addr.name)}<br>${esc(o.addr.line1)}${o.addr.landmark ? ", " + esc(o.addr.landmark) : ""}<br>${esc(o.addr.city)}, ${esc(o.addr.state)} ${esc(o.addr.pin)}<br>+91 ${esc(o.addr.phone)}</p></div>
        <div style="display:flex;flex-direction:column;gap:8px"><div class="sum-row"><span>Bag total</span><span>${fmt(o.totals.sub)}</span></div>${o.totals.discount ? `<div class="sum-row"><span>Coupon ${o.coupon}</span><span class="save">−${fmt(o.totals.discount)}</span></div>` : ""}<div class="sum-row"><span>Shipping</span><span>${o.totals.ship ? fmt(o.totals.ship) : "Free"}</span></div><div class="sum-row total"><span>${o.pay === "cod" ? "To pay on delivery" : "Paid"}</span><span>${fmt(o.totals.total)}</span></div></div></div>`
    : `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div class="order-items">${o.items.map((l) => { const p = TT.byId(l.id); return `<span class="thumb" style="background:${TT.tile(p)}" title="${esc(p.name)}">${ART.product(p, l.color, { name: l.name })}</span>`; }).join("")}</div><a class="btn ghost sm" href="#/order/${o.id}">View details</a></div>`}
  </div>`;

  V.order = (r) => {
    const o = S.orders.find((x) => x.id === r.arg);
    if (!o) return V.notFound();
    const fresh = Date.now() - o.date < 10 * 60e3;
    return { title: "Order " + o.id, html: `<div class="wrap">
      ${fresh ? `<div class="confirm-hero"><span class="check-circle"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>
        <h1>Order placed — tails are wagging.</h1><p class="muted">We've sent the details to ${esc(o.addr.email)}. Your order ${o.id} arrives by <b>${TT.dateStr(new Date(o.eta))}</b>.</p>
        <div class="hero-ctas" style="justify-content:center"><a class="btn" href="#/shop">Continue shopping</a><a class="btn ghost" href="#/orders">All orders</a></div></div>`
        : `<nav class="crumbs"><a href="#/">Home</a><span>/</span><a href="#/orders">Orders</a><span>/</span><span>${o.id}</span></nav>`}
      <div style="margin-top:22px">${orderCard(o, true)}</div></div>` };
  };

  V.orders = () => ({ title: "Your orders", html: `<div class="wrap"><nav class="crumbs"><a href="#/">Home</a><span>/</span><span>Orders</span></nav>
    <div class="shop-head"><div><h1>Your orders</h1><p class="muted">Track deliveries and exchanges. Orders are saved in this browser.</p></div></div>
    ${S.orders.length ? S.orders.map((o) => orderCard(o)).join("") : `<div class="empty-state"><div style="width:130px;margin:0 auto">${ART.pet("#9DBB95", "walkies")}</div><h3>No orders yet</h3><p>Once you place an order, you can track it here.</p><a class="btn" href="#/shop?kind=twin">Shop twinning sets</a></div>`}</div>` });

  V.wishlist = () => {
    const items = S.wish.map(TT.byId).filter(Boolean);
    return { title: "Wishlist", html: `<div class="wrap"><nav class="crumbs"><a href="#/">Home</a><span>/</span><span>Wishlist</span></nav>
      <div class="shop-head"><div><h1>Your wishlist</h1><p class="muted">${items.length} saved style${items.length === 1 ? "" : "s"}</p></div></div>
      ${items.length ? `<div class="grid">${items.map(TT.card).join("")}</div>` : `<div class="empty-state"><div style="width:130px;margin:0 auto">${ART.pet("#F2B4AB", "original")}</div><h3>Nothing saved yet</h3><p>Tap the heart on any tee to keep it here for later.</p><a class="btn" href="#/shop">Browse all tees</a></div>`}</div>` };
  };

  V.notFound = () => ({ title: "Not found", html: `<div class="wrap"><div class="empty-state" style="margin-top:28px"><div style="width:130px;margin:0 auto">${ART.pet("#98BFE4", "sniff")}</div><h3>We sniffed everywhere</h3><p>That page doesn't exist — it may have been moved or the link is mistyped.</p><a class="btn" href="#/">Back to home</a></div></div>` });

  TT.start();
})();
