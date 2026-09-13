/* Tee & Tail — catalogue data. Edit prices, products and copy here. */
window.TT = window.TT || {};

TT.BRAND = { name: "Tee & Tail", freeShip: 999, shipFee: 79 };

TT.COLORS = {
  marigold: { name: "Marigold", hex: "#F4A340" },
  chalk:    { name: "Chalk",    hex: "#F3EFE6" },
  midnight: { name: "Midnight", hex: "#262B55" },
  sage:     { name: "Sage",     hex: "#9DBB95" },
  blush:    { name: "Blush",    hex: "#F2B4AB" },
  sky:      { name: "Sky",      hex: "#98BFE4" },
  charcoal: { name: "Charcoal", hex: "#3B3B43" },
  butter:   { name: "Butter",   hex: "#F4DD78" }
};

/* Measurements in cm (pets) and inches (humans) */
TT.SIZES = {
  dog: [
    { s: "XS", chest: "30–36", neck: "20–25", back: "22", breeds: "Chihuahua, Pomeranian" },
    { s: "S",  chest: "36–44", neck: "25–30", back: "28", breeds: "Shih Tzu, Maltese, Dachshund" },
    { s: "M",  chest: "44–54", neck: "30–36", back: "35", breeds: "Beagle, Pug, French Bulldog" },
    { s: "L",  chest: "54–64", neck: "36–42", back: "43", breeds: "Indie, Husky, Border Collie" },
    { s: "XL", chest: "64–76", neck: "42–50", back: "52", breeds: "Labrador, Golden Retriever" },
    { s: "XXL",chest: "76–88", neck: "50–58", back: "60", breeds: "German Shepherd, Great Dane" }
  ],
  cat: [
    { s: "XS", chest: "26–32", neck: "18–22", back: "20", breeds: "Kittens (3–6 months)" },
    { s: "S",  chest: "32–38", neck: "22–26", back: "26", breeds: "Indian Shorthair, Siamese" },
    { s: "M",  chest: "38–46", neck: "26–30", back: "32", breeds: "Persian, Bengal, British Shorthair" }
  ],
  human: [
    { s: "XS", chest: "36", length: "26", fits: "Slim, 32–34 chest" },
    { s: "S",  chest: "38", length: "27", fits: "34–36 chest" },
    { s: "M",  chest: "40", length: "28", fits: "36–38 chest" },
    { s: "L",  chest: "42", length: "29", fits: "38–40 chest" },
    { s: "XL", chest: "44", length: "30", fits: "40–42 chest" },
    { s: "XXL",chest: "46", length: "31", fits: "42–44 chest" }
  ],
  bandana: [
    { s: "S", neck: "22–32", breeds: "Cats, toy & small dogs" },
    { s: "M", neck: "32–44", breeds: "Beagle, Indie, Cocker Spaniel" },
    { s: "L", neck: "44–58", breeds: "Labrador, GSD, Golden Retriever" }
  ]
};

TT.BREEDS = [
  ["Chihuahua", "dog", "XS"], ["Pomeranian", "dog", "XS"], ["Shih Tzu", "dog", "S"], ["Maltese", "dog", "S"],
  ["Dachshund", "dog", "S"], ["Pug", "dog", "M"], ["Beagle", "dog", "M"], ["French Bulldog", "dog", "M"],
  ["Cocker Spaniel", "dog", "M"], ["Indie (INDog)", "dog", "L"], ["Siberian Husky", "dog", "L"], ["Border Collie", "dog", "L"],
  ["Labrador Retriever", "dog", "XL"], ["Golden Retriever", "dog", "XL"], ["German Shepherd", "dog", "XXL"], ["Great Dane", "dog", "XXL"],
  ["Indian Shorthair (cat)", "cat", "S"], ["Siamese (cat)", "cat", "S"], ["Persian (cat)", "cat", "M"], ["Bengal (cat)", "cat", "M"], ["Kitten under 6 months", "cat", "XS"]
];

/* Print artwork: what goes on the human tee (chest) and the pet tee (back) */
TT.PRINTS = {
  goodboy: { human: { icon: "dog", lines: ["HUMAN OF A", "GOOD BOY"] }, pet: { icon: "bone", lines: ["THE", "GOOD BOY"] } },
  original:{ human: { icon: "heart", lines: ["THE", "ORIGINAL"] }, pet: { icon: "heart", lines: ["MINI", "ME"] } },
  copilot: { human: { icon: "plane", lines: ["PILOT"] }, pet: { icon: "plane", lines: ["CO-", "PILOT"] } },
  chai:    { human: { icon: "chai", lines: ["CHAI &", "CHILL"] }, pet: { icon: "chai", lines: ["CHAI &", "ZOOMIES"] } },
  indie:   { human: { icon: "paw", lines: ["ADOPT,", "DON'T SHOP"] }, pet: { icon: "paw", lines: ["INDIE &", "PROUD"] } },
  walkies: { human: { icon: "paw", lines: ["WALK", "CREW"] }, pet: { icon: "bone", lines: ["WILL WORK", "FOR WALKIES"] } },
  sniff:   { human: { icon: "dog", lines: ["SNIFF", "SQUAD"] }, pet: { icon: "dog", lines: ["SNIFF", "SQUAD"] } },
  manager: { human: { icon: "cat", lines: ["CAT MOM", "CLUB"] }, pet: { icon: "cat", lines: ["THE", "MANAGER"] } },
  catface: { human: { icon: "cat", lines: ["WHISKER", "CLUB"] }, pet: { icon: "cat", big: true, lines: [] } },
  dogface: { human: { icon: "dog", big: true, lines: [] }, pet: { icon: "dog", big: true, lines: [] } },
  parent:  { human: { icon: "paw", lines: ["DOG", "PARENT"] }, pet: { icon: "paw", lines: ["MY", "HUMAN"] } },
  zoomies: { human: { icon: "paw", lines: ["ZOOMIES", "INCOMING"] }, pet: { icon: "paw", lines: ["ZOOMIES", "INCOMING"] } },
  custom:  { human: { icon: "heart", lines: ["{NAME}'S", "HUMAN"] }, pet: { icon: "paw", lines: ["{NAME}"] } },
  pawtern: { pattern: "paw" },
  chaibreak: { pattern: "chai" }
};

/* kind: pet | human | twin · cat: tee | hoodie | bandana */
TT.PRODUCTS = [
  { id: "twin-good-boy", name: "Good Boy & His Human Twinning Set", kind: "twin", species: ["dog"], cat: "tee", print: "goodboy",
    colors: ["marigold", "chalk", "midnight"], price: 1699, mrp: 2298, rating: 4.8, reviews: 1204, badge: "Bestseller", best: 1,
    desc: "Our first and most-loved set. A relaxed-fit tee for you that says what everyone already knows, and a matching back-print tee for the good boy himself." },
  { id: "twin-mini-me", name: "Original & Mini Me Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", print: "original",
    colors: ["sky", "blush", "chalk"], price: 1699, mrp: 2298, rating: 4.7, reviews: 856, best: 3,
    desc: "You're the original. They're the pocket-sized upgrade. Works for dogs and cats — pick your pet's size chart when you choose sizes." },
  { id: "twin-copilot", name: "Pilot & Co-Pilot Twinning Set", kind: "twin", species: ["dog"], cat: "tee", print: "copilot",
    colors: ["midnight", "sage", "charcoal"], price: 1699, mrp: 2298, rating: 4.9, reviews: 412, badge: "New", isNew: 1,
    desc: "For the road-trip duo who always calls the window seat. Soft-hand print that survives car-window drool." },
  { id: "twin-chai", name: "Chai & Zoomies Twinning Set", kind: "twin", species: ["dog"], cat: "tee", print: "chai",
    colors: ["butter", "marigold", "chalk"], price: 1699, mrp: 2298, rating: 4.6, reviews: 318, best: 6,
    desc: "One of you wants chai. The other wants to sprint laps of the living room. Both of you get a tee." },
  { id: "twin-custom", name: "Personalised Name Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", print: "custom", custom: 1,
    colors: ["chalk", "sky", "blush", "midnight"], price: 1899, mrp: 2498, rating: 4.9, reviews: 640, badge: "Personalise", best: 2,
    desc: "Your pet's name on their back, and '<name>'s human' on yours. Printed to order in 3–4 working days." },
  { id: "twin-hoodie", name: "Cosy Twin Hoodie Set", kind: "twin", species: ["dog"], cat: "hoodie", print: "zoomies",
    colors: ["charcoal", "sage", "midnight"], price: 2799, mrp: 3598, rating: 4.8, reviews: 227, badge: "Winter drop", isNew: 1,
    desc: "320 GSM brushed-fleece hoodies for foggy Delhi mornings and hill-station walks. Matching, obviously." },

  { id: "dog-good-boy", name: "The Good Boy Dog Tee", kind: "pet", species: ["dog"], cat: "tee", print: "goodboy",
    colors: ["marigold", "chalk", "midnight", "sky"], price: 799, mrp: 999, rating: 4.8, reviews: 2140, badge: "Bestseller", best: 4,
    desc: "The back print says it. The tail wag confirms it. Stretchy rib collar, leg openings cut wide so nothing rubs." },
  { id: "dog-indie", name: "Indie & Proud Dog Tee", kind: "pet", species: ["dog"], cat: "tee", print: "indie",
    colors: ["marigold", "chalk", "sage"], price: 799, mrp: 999, rating: 4.9, reviews: 978, badge: "Gives back", best: 5,
    desc: "For the desi dog with the best ears in the building. ₹50 from every Indie tee funds street-dog feeding drives." },
  { id: "dog-walkies", name: "Will Work For Walkies Dog Tee", kind: "pet", species: ["dog"], cat: "tee", print: "walkies",
    colors: ["sky", "butter", "charcoal"], price: 799, mrp: 999, rating: 4.7, reviews: 534,
    desc: "A statement of intent. Lightweight 160 GSM cotton for summer walks." },
  { id: "dog-sniff", name: "Sniff Squad Dog Tee", kind: "pet", species: ["dog"], cat: "tee", print: "sniff",
    colors: ["sage", "chalk", "blush"], price: 749, mrp: 999, rating: 4.6, reviews: 289,
    desc: "For the dog who has to smell every single lamppost. Every. Single. One." },
  { id: "cat-manager", name: "The Manager Cat Tee", kind: "pet", species: ["cat"], cat: "tee", print: "manager",
    colors: ["blush", "chalk", "charcoal"], price: 699, mrp: 899, rating: 4.7, reviews: 411, best: 8,
    desc: "Runs the household. Approves nothing. Extra-soft 150 GSM jersey sized for cats — try it on for short sessions first." },
  { id: "cat-whiskers", name: "Whisker Face Cat Tee", kind: "pet", species: ["cat"], cat: "tee", print: "catface",
    colors: ["sky", "butter", "chalk"], price: 699, mrp: 899, rating: 4.5, reviews: 176, badge: "New", isNew: 1,
    desc: "A big, happy cat face across the back. Lightweight and quiet — no crinkly prints." },
  { id: "pet-name-tee", name: "Your Pet's Name Tee", kind: "pet", species: ["dog", "cat"], cat: "tee", print: "custom", custom: 1,
    colors: ["chalk", "marigold", "sky", "midnight"], price: 899, mrp: 1099, rating: 4.9, reviews: 1320, badge: "Personalise", best: 7,
    desc: "Their name, big and bold across the back. Up to 10 letters. Printed to order in 3–4 working days." },
  { id: "dog-hoodie", name: "Zoomies Fleece Dog Hoodie", kind: "pet", species: ["dog", "cat"], cat: "hoodie", print: "zoomies",
    colors: ["charcoal", "sage", "blush"], price: 1299, mrp: 1599, rating: 4.8, reviews: 603, badge: "Winter drop", isNew: 1,
    desc: "Brushed fleece inside, a hood that actually stays put, and a leash slit at the back." },
  { id: "bandana-paw", name: "Paw Print Reversible Bandana", kind: "pet", species: ["dog", "cat"], cat: "bandana", print: "pawtern",
    colors: ["marigold", "sky", "blush", "sage"], price: 399, mrp: 499, rating: 4.7, reviews: 845,
    desc: "Slips over the collar — no knots to chew. Reversible to a solid colour." },
  { id: "bandana-chai", name: "Chai Break Bandana", kind: "pet", species: ["dog", "cat"], cat: "bandana", print: "chaibreak",
    colors: ["butter", "chalk", "midnight"], price: 399, mrp: 499, rating: 4.6, reviews: 212, badge: "New", isNew: 1,
    desc: "Tiny cutting-chai glasses all over. Slip-on collar sleeve, machine washable." },

  { id: "human-dog-parent", name: "Dog Parent Oversized Tee", kind: "human", species: ["dog"], cat: "tee", print: "parent",
    colors: ["chalk", "midnight", "sage", "charcoal"], price: 1199, mrp: 1499, rating: 4.8, reviews: 1650, badge: "Bestseller", best: 9,
    desc: "Drop-shoulder oversized fit in 220 GSM heavyweight cotton. Fur shows less on Chalk and Sage — we checked." },
  { id: "human-cat-mom", name: "Cat Mom Club Tee", kind: "human", species: ["cat"], cat: "tee", print: "manager",
    colors: ["blush", "chalk", "charcoal"], price: 1099, mrp: 1499, rating: 4.7, reviews: 732,
    desc: "Regular fit, 180 GSM combed cotton. Membership is lifelong and non-negotiable." },
  { id: "human-adopt", name: "Adopt, Don't Shop Tee", kind: "human", species: ["dog", "cat"], cat: "tee", print: "indie",
    colors: ["marigold", "chalk", "midnight"], price: 1099, mrp: 1499, rating: 4.9, reviews: 904, badge: "Gives back",
    desc: "Wear the message. ₹100 from every tee goes to our adoption-drive partners across India." },
  { id: "human-dog-face", name: "Big Dog Face Tee", kind: "human", species: ["dog"], cat: "tee", print: "dogface",
    colors: ["butter", "sky", "chalk"], price: 1099, mrp: 1499, rating: 4.6, reviews: 388, badge: "New", isNew: 1,
    desc: "A floppy-eared hero across your chest. Regular fit, bio-washed so it's soft from day one." },
  { id: "human-walk-crew", name: "Walk Crew Tee", kind: "human", species: ["dog"], cat: "tee", print: "walkies",
    colors: ["sky", "sage", "charcoal"], price: 999, mrp: 1299, rating: 4.5, reviews: 241,
    desc: "For the 6 AM and 9 PM shifts. Moisture-friendly cotton-modal blend." },
  { id: "human-hoodie", name: "Pawrent Heavyweight Hoodie", kind: "human", species: ["dog", "cat"], cat: "hoodie", print: "zoomies",
    colors: ["charcoal", "midnight", "sage"], price: 1999, mrp: 2499, rating: 4.8, reviews: 467, badge: "Winter drop",
    desc: "380 GSM loopback fleece with a kangaroo pocket that fits treats, poop bags and your phone." }
];

TT.COUPONS = {
  TWINNING15: { label: "15% off when your bag has a twinning set", test: (c) => c.items.some((i) => TT.byId(i.id).kind === "twin"), value: (c) => Math.round(c.sub * 0.15), need: "Add a twinning set to use TWINNING15" },
  FIRSTWOOF:  { label: "₹150 off orders above ₹999", test: (c) => c.sub >= 999, value: () => 150, need: "FIRSTWOOF needs a bag total of ₹999 or more" },
  ADOPT10:    { label: "10% off — thanks for adopting", test: () => true, value: (c) => Math.round(c.sub * 0.10) }
};

TT.REVIEWS = [
  { who: "Ananya & Bruno", where: "Bengaluru", pet: "dog", tile: "t1", wore: "Beagle · wore M · Marigold", text: "Bruno sits still for exactly one thing: getting dressed for a matching photo. The fabric doesn't pill and the M fits his barrel chest perfectly." },
  { who: "Rohan & Mishti", where: "Pune", pet: "cat", tile: "t4", wore: "Indian Shorthair · wore S · Blush", text: "I was sure my cat would hate it. She wore The Manager tee for a whole evening and then fell asleep in it. Honestly a win." },
  { who: "Kavya & Laddoo", where: "Jaipur", pet: "dog", tile: "t2", wore: "Indie · wore L · Sage", text: "Used the breed size finder — Indie, size L — and it was spot on. Strangers stop us on walks to ask where the tees are from." }
];

TT.FAQ = [
  ["How do I pick the right size for my pet?", "Measure the widest part of your pet's chest, just behind the front legs, and match it to the chest range in our size guide. Between sizes? Go up one. Or use the breed size finder on the home page."],
  ["Can I exchange if it doesn't fit?", "Yes — size exchanges are free within 15 days as long as the tee is unwashed and the tags are on. Personalised items can be exchanged for size, but not returned."],
  ["Are the prints safe if my dog licks or chews them?", "We print with water-based, AZO-free inks that are OEKO-TEX certified. They're safe on skin, but no clothing is a chew toy — always supervise."],
  ["How long does delivery take?", "Ready-to-ship items reach metro cities in 2–4 days and the rest of India in 4–7 days. Personalised items take an extra 3–4 working days to print."],
  ["Do you offer Cash on Delivery?", "Yes, COD is available on all pincodes we deliver to, along with UPI, cards and netbanking."],
  ["How should I wash them?", "Turn inside out, cold machine wash with similar colours, and line dry. Skip the dryer to keep the print crisp and the pet tee's rib collar springy."]
];

TT.byId = (id) => TT.PRODUCTS.find((p) => p.id === id);
