/* Tee & Tail — catalogue data. Edit prices, products and copy here.
   SKUs are manufacturing codes: never renumber an existing style, only append. */
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

/* Fabric specs shared by the site and the production tech pack */
TT.FABRICS = {
  HT180: { short: "180 GSM cotton", name: "180 GSM combed cotton single jersey", comp: "100% combed ring-spun cotton", finish: "Bio-washed, pre-shrunk", fit: "Regular fit", trim: "1×1 rib collar with 5% elastane" },
  HT220: { short: "220 GSM heavyweight", name: "220 GSM heavyweight combed cotton jersey", comp: "100% combed ring-spun cotton", finish: "Bio-washed, pre-shrunk", fit: "Oversized, drop shoulder", trim: "2 cm 1×1 rib collar" },
  HTCM:  { short: "Cotton-modal", name: "170 GSM cotton-modal jersey", comp: "60% cotton, 40% modal", finish: "Enzyme-washed", fit: "Regular fit", trim: "1×1 rib collar" },
  PT160: { short: "160 GSM stretch cotton", name: "160 GSM stretch cotton jersey", comp: "95% cotton, 5% elastane", finish: "Bio-washed", fit: "Dog fit, wide leg openings", trim: "1×1 rib at collar and leg openings" },
  CT150: { short: "150 GSM stretch cotton", name: "150 GSM stretch cotton jersey", comp: "95% cotton, 5% elastane", finish: "Bio-washed, extra soft", fit: "Cat fit, lightweight", trim: "Soft 1×1 rib at collar and leg openings" },
  PH320: { short: "320 GSM fleece", name: "320 GSM brushed fleece", comp: "80% cotton, 20% polyester", finish: "Brushed inside", fit: "Pet hoodie with leash slit at centre back", trim: "Rib cuffs, lined hood" },
  HH320: { short: "320 GSM fleece", name: "320 GSM brushed fleece", comp: "80% cotton, 20% polyester", finish: "Brushed inside", fit: "Relaxed hoodie, kangaroo pocket", trim: "2×2 rib cuffs and hem, flat drawcords" },
  HH380: { short: "380 GSM loopback", name: "380 GSM loopback fleece", comp: "80% cotton, 20% polyester", finish: "Loopback, garment-washed", fit: "Relaxed hoodie, kangaroo pocket", trim: "2×2 rib cuffs and hem, flat drawcords" },
  BD:    { short: "Cotton poplin", name: "Double-layer cotton poplin", comp: "100% cotton", finish: "Reversible to solid colour", fit: "Slip-over collar sleeve, no knots", trim: "1.5 cm collar channel" }
};

/* Body measurements in cm (pets) and garment chest in inches (humans) */
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
  goodboy: { name: "Good Boy", human: { icon: "dog", lines: ["HUMAN OF A", "GOOD BOY"] }, pet: { icon: "bone", lines: ["THE", "GOOD BOY"] } },
  original:{ name: "Original & Mini Me", human: { icon: "heart", lines: ["THE", "ORIGINAL"] }, pet: { icon: "heart", lines: ["MINI", "ME"] } },
  copilot: { name: "Pilot & Co-Pilot", human: { icon: "plane", lines: ["PILOT"] }, pet: { icon: "plane", lines: ["CO-", "PILOT"] } },
  chai:    { name: "Chai & Zoomies", human: { icon: "chai", lines: ["CHAI &", "CHILL"] }, pet: { icon: "chai", lines: ["CHAI &", "ZOOMIES"] } },
  indie:   { name: "Indie & Proud", human: { icon: "paw", lines: ["ADOPT,", "DON'T SHOP"] }, pet: { icon: "paw", lines: ["INDIE &", "PROUD"] } },
  walkies: { name: "Walkies", human: { icon: "paw", lines: ["WALK", "CREW"] }, pet: { icon: "bone", lines: ["WILL WORK", "FOR WALKIES"] } },
  sniff:   { name: "Sniff Squad", human: { icon: "dog", lines: ["SNIFF", "SQUAD"] }, pet: { icon: "dog", lines: ["SNIFF", "SQUAD"] } },
  manager: { name: "Cat Mom & The Manager", human: { icon: "cat", lines: ["CAT MOM", "CLUB"] }, pet: { icon: "cat", lines: ["THE", "MANAGER"] } },
  catface: { name: "Whisker Face", human: { icon: "cat", lines: ["WHISKER", "CLUB"] }, pet: { icon: "cat", big: true, lines: [] } },
  dogface: { name: "Big Dog Face", human: { icon: "dog", big: true, lines: [] }, pet: { icon: "dog", big: true, lines: [] } },
  parent:  { name: "Dog Parent", human: { icon: "paw", lines: ["DOG", "PARENT"] }, pet: { icon: "paw", lines: ["MY", "HUMAN"] } },
  zoomies: { name: "Zoomies Incoming", human: { icon: "paw", lines: ["ZOOMIES", "INCOMING"] }, pet: { icon: "paw", lines: ["ZOOMIES", "INCOMING"] } },
  dogmom:  { name: "Dog Mom", human: { icon: "dog", lines: ["DOG", "MOM"] }, pet: { icon: "heart", lines: ["MOM'S", "BABY"] } },
  dogdad:  { name: "Dog Dad", human: { icon: "dog", lines: ["DOG", "DAD"] }, pet: { icon: "bone", lines: ["DAD'S", "BUDDY"] } },
  catdad:  { name: "Cat Dad", human: { icon: "cat", lines: ["CAT", "DAD"] }, pet: { icon: "cat", lines: ["DAD'S", "KITTY"] } },
  bff:     { name: "Best Fur-iends", human: { icon: "heart", lines: ["BEST", "FUR-IEND"] }, pet: { icon: "heart", lines: ["BEST", "FUR-IEND"] } },
  treats:  { name: "Treats", human: { icon: "bone", lines: ["TREAT", "DEALER"] }, pet: { icon: "bone", lines: ["TREAT", "INSPECTOR"] } },
  napping: { name: "Naps", human: { icon: "cat", lines: ["NAPS WITH", "MY CAT"] }, pet: { icon: "cat", lines: ["PRO", "NAPPER"] } },
  rescue:  { name: "Rescued & Loved", human: { icon: "heart", lines: ["RESCUED IS MY", "FAVOURITE BREED"] }, pet: { icon: "paw", lines: ["RESCUED", "& LOVED"] } },
  diwali:  { name: "Diyas, Not Patake", human: { icon: "diya", lines: ["DIYAS,", "NOT PATAKE"] }, pet: { icon: "diya", lines: ["PLEASE,", "NO PATAKE"] } },
  custom:  { name: "Personalised name", human: { icon: "heart", lines: ["{NAME}'S", "HUMAN"] }, pet: { icon: "paw", lines: ["{NAME}"] } },
  pawtern: { name: "Paw pattern", pattern: "paw" },
  chaibreak: { name: "Chai pattern", pattern: "chai" },
  diyapattern: { name: "Diya pattern", pattern: "diya" }
};

/* kind: pet | human | twin · cat: tee | hoodie | bandana · fab: fabric code(s) · best: signature rank */
TT.PRODUCTS = [
  /* ---------- Twinning sets (1 human tee + 1 pet tee) ---------- */
  { sku: "TW-001", id: "twin-good-boy", name: "Good Boy & His Human Twinning Set", kind: "twin", species: ["dog"], cat: "tee", fab: ["HT180", "PT160"], print: "goodboy",
    colors: ["marigold", "chalk", "midnight"], price: 1699, mrp: 2298, badge: "Signature", best: 1,
    desc: "Our first set. A relaxed-fit tee for you that says what everyone already knows, and a matching back-print tee for the good boy himself." },
  { sku: "TW-002", id: "twin-mini-me", name: "Original & Mini Me Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", fab: ["HT180", "PT160"], print: "original",
    colors: ["sky", "blush", "chalk"], price: 1699, mrp: 2298, best: 3,
    desc: "You're the original. They're the pocket-sized upgrade. Works for dogs and cats — pick your pet's size chart when you choose sizes." },
  { sku: "TW-003", id: "twin-copilot", name: "Pilot & Co-Pilot Twinning Set", kind: "twin", species: ["dog"], cat: "tee", fab: ["HT180", "PT160"], print: "copilot",
    colors: ["midnight", "sage", "charcoal"], price: 1699, mrp: 2298,
    desc: "For the road-trip duo who always calls the window seat." },
  { sku: "TW-004", id: "twin-chai", name: "Chai & Zoomies Twinning Set", kind: "twin", species: ["dog"], cat: "tee", fab: ["HT180", "PT160"], print: "chai",
    colors: ["butter", "marigold", "chalk"], price: 1699, mrp: 2298, best: 6,
    desc: "One of you wants chai. The other wants to sprint laps of the living room. Both of you get a tee." },
  { sku: "TW-005", id: "twin-custom", name: "Personalised Name Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", fab: ["HT180", "PT160"], print: "custom", custom: 1,
    colors: ["chalk", "sky", "blush", "midnight"], price: 1899, mrp: 2498, badge: "Personalise", best: 2,
    desc: "Your pet's name on their back, and '<name>'s human' on yours. Printed to order in 3–4 working days." },
  { sku: "TW-006", id: "twin-hoodie", name: "Cosy Twin Hoodie Set", kind: "twin", species: ["dog"], cat: "hoodie", fab: ["HH320", "PH320"], print: "zoomies",
    colors: ["charcoal", "sage", "midnight"], price: 2799, mrp: 3598, badge: "Winter drop", isNew: 1,
    desc: "Brushed-fleece hoodies for foggy morning walks and hill-station trips. Matching, obviously." },
  { sku: "TW-007", id: "twin-cat-mom", name: "Cat Mom & The Manager Twinning Set", kind: "twin", species: ["cat"], cat: "tee", fab: ["HT180", "CT150"], print: "manager",
    colors: ["blush", "chalk", "charcoal"], price: 1699, mrp: 2298, best: 8,
    desc: "She runs the household; you run the tin opener. A matching set with a lightweight, cat-sized tee." },
  { sku: "TW-008", id: "twin-dog-mom", name: "Dog Mom & Mom's Baby Twinning Set", kind: "twin", species: ["dog"], cat: "tee", fab: ["HT180", "PT160"], print: "dogmom",
    colors: ["blush", "sky", "chalk"], price: 1699, mrp: 2298, badge: "New", isNew: 1, best: 5,
    desc: "For the mom whose camera roll is 90% dog. Your tee says Dog Mom; theirs says Mom's Baby." },
  { sku: "TW-009", id: "twin-dog-dad", name: "Dog Dad & Dad's Buddy Twinning Set", kind: "twin", species: ["dog"], cat: "tee", fab: ["HT180", "PT160"], print: "dogdad",
    colors: ["midnight", "sage", "charcoal"], price: 1699, mrp: 2298, badge: "New", isNew: 1, best: 7,
    desc: "Walk buddies, couch buddies, snack-sharing buddies. Now matching buddies." },
  { sku: "TW-010", id: "twin-rescue", name: "Rescued & Loved Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", fab: ["HT180", "PT160"], print: "rescue",
    colors: ["marigold", "chalk", "sage"], price: 1699, mrp: 2298, badge: "Adopt",
    desc: "Your tee: Rescued is my favourite breed. Theirs: Rescued & loved. For every adopted dog and cat." },
  { sku: "TW-011", id: "twin-diwali", name: "Diyas, Not Patake Festive Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", fab: ["HT180", "PT160"], print: "diwali", edit: "diwali",
    colors: ["butter", "marigold", "midnight"], price: 1699, mrp: 2298, badge: "Diwali edit", isNew: 1,
    desc: "Firecrackers terrify pets. Celebrate with diyas instead — and say it with a matching set for the festive photos." },
  { sku: "TW-012", id: "twin-bff", name: "Best Fur-iends Twinning Set", kind: "twin", species: ["dog", "cat"], cat: "tee", fab: ["HT180", "PT160"], print: "bff",
    colors: ["sky", "blush", "butter"], price: 1699, mrp: 2298,
    desc: "The same words on both tees, because it's mutual. Works for dogs and cats." },

  /* ---------- Pet tees ---------- */
  { sku: "PT-001", id: "dog-good-boy", name: "The Good Boy Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "goodboy",
    colors: ["marigold", "chalk", "midnight", "sky"], price: 799, mrp: 999, badge: "Signature", best: 4,
    desc: "The back print says it. The tail wag confirms it. Stretchy rib collar, leg openings cut wide so nothing rubs." },
  { sku: "PT-002", id: "dog-indie", name: "Indie & Proud Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "indie",
    colors: ["marigold", "chalk", "sage"], price: 799, mrp: 999, badge: "Adopt",
    desc: "For the desi dog with the best ears in the building." },
  { sku: "PT-003", id: "dog-walkies", name: "Will Work For Walkies Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "walkies",
    colors: ["sky", "butter", "charcoal"], price: 799, mrp: 999,
    desc: "A statement of intent, in lightweight stretch cotton for summer walks." },
  { sku: "PT-004", id: "dog-sniff", name: "Sniff Squad Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "sniff",
    colors: ["sage", "chalk", "blush"], price: 749, mrp: 999,
    desc: "For the dog who has to smell every single lamppost. Every. Single. One." },
  { sku: "PT-005", id: "cat-manager", name: "The Manager Cat Tee", kind: "pet", species: ["cat"], cat: "tee", fab: ["CT150"], print: "manager",
    colors: ["blush", "chalk", "charcoal"], price: 699, mrp: 899,
    desc: "Runs the household. Approves nothing. Extra-soft jersey sized for cats — try it on for short sessions first." },
  { sku: "PT-006", id: "cat-whiskers", name: "Whisker Face Cat Tee", kind: "pet", species: ["cat"], cat: "tee", fab: ["CT150"], print: "catface",
    colors: ["sky", "butter", "chalk"], price: 699, mrp: 899, badge: "New", isNew: 1,
    desc: "A big, happy cat face across the back. Lightweight and quiet — no crinkly prints." },
  { sku: "PT-007", id: "pet-name-tee", name: "Your Pet's Name Tee", kind: "pet", species: ["dog", "cat"], cat: "tee", fab: ["PT160"], print: "custom", custom: 1,
    colors: ["chalk", "marigold", "sky", "midnight"], price: 899, mrp: 1099, badge: "Personalise", best: 9,
    desc: "Their name, big and bold across the back. Up to 10 letters. Printed to order in 3–4 working days." },
  { sku: "PT-008", id: "dog-copilot", name: "Co-Pilot Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "copilot",
    colors: ["midnight", "sage", "sky"], price: 799, mrp: 999,
    desc: "Window seat, head out, ears flapping. Mission control approves." },
  { sku: "PT-009", id: "dog-chai", name: "Chai & Zoomies Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "chai",
    colors: ["butter", "marigold", "chalk"], price: 799, mrp: 999,
    desc: "Fuelled by zoomies, never by chai. A cutting-chai glass on the back." },
  { sku: "PT-010", id: "pet-mini-me", name: "Mini Me Pet Tee", kind: "pet", species: ["dog", "cat"], cat: "tee", fab: ["PT160"], print: "original",
    colors: ["sky", "blush", "chalk"], price: 749, mrp: 999,
    desc: "The mini version of you — pair it with The Original tee." },
  { sku: "PT-011", id: "dog-big-face", name: "Big Dog Face Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "dogface",
    colors: ["butter", "sky", "chalk"], price: 799, mrp: 999, badge: "New", isNew: 1,
    desc: "A floppy-eared face across the back, so everyone behind you on the walk gets a smile." },
  { sku: "PT-012", id: "dog-treats", name: "Treat Inspector Dog Tee", kind: "pet", species: ["dog"], cat: "tee", fab: ["PT160"], print: "treats",
    colors: ["marigold", "sage", "charcoal"], price: 749, mrp: 999, badge: "New", isNew: 1,
    desc: "Licensed to inspect every treat, snack and dropped chapati in the house." },
  { sku: "PT-013", id: "cat-napper", name: "Pro Napper Cat Tee", kind: "pet", species: ["cat"], cat: "tee", fab: ["CT150"], print: "napping",
    colors: ["sky", "blush", "chalk"], price: 699, mrp: 899, badge: "New", isNew: 1,
    desc: "Sixteen hours a day, minimum. Soft enough to nap in." },
  { sku: "PT-014", id: "pet-diwali", name: "Please, No Patake Pet Tee", kind: "pet", species: ["dog", "cat"], cat: "tee", fab: ["PT160"], print: "diwali", edit: "diwali",
    colors: ["butter", "marigold", "midnight"], price: 799, mrp: 999, badge: "Diwali edit", isNew: 1,
    desc: "A polite festive request from the smallest member of the family." },
  { sku: "PT-015", id: "pet-rescue", name: "Rescued & Loved Pet Tee", kind: "pet", species: ["dog", "cat"], cat: "tee", fab: ["PT160"], print: "rescue",
    colors: ["marigold", "chalk", "sage"], price: 799, mrp: 999, badge: "Adopt",
    desc: "For every adopted dog and cat who landed on their paws." },

  /* ---------- Pet hoodies ---------- */
  { sku: "PH-001", id: "dog-hoodie", name: "Zoomies Fleece Pet Hoodie", kind: "pet", species: ["dog", "cat"], cat: "hoodie", fab: ["PH320"], print: "zoomies",
    colors: ["charcoal", "sage", "blush"], price: 1299, mrp: 1599, badge: "Winter drop", isNew: 1,
    desc: "Brushed fleece inside, a hood that actually stays put, and a leash slit at the back." },
  { sku: "PH-002", id: "pet-diwali-hoodie", name: "Please, No Patake Fleece Pet Hoodie", kind: "pet", species: ["dog", "cat"], cat: "hoodie", fab: ["PH320"], print: "diwali", edit: "diwali",
    colors: ["midnight", "charcoal"], price: 1299, mrp: 1599, badge: "Diwali edit", isNew: 1,
    desc: "Cosy fleece for the nights the crackers start. Leash slit at the back." },

  /* ---------- Bandanas ---------- */
  { sku: "BD-001", id: "bandana-paw", name: "Paw Print Reversible Bandana", kind: "pet", species: ["dog", "cat"], cat: "bandana", fab: ["BD"], print: "pawtern",
    colors: ["marigold", "sky", "blush", "sage"], price: 399, mrp: 499,
    desc: "Slips over the collar — no knots to chew. Reversible to a solid colour." },
  { sku: "BD-002", id: "bandana-chai", name: "Chai Break Bandana", kind: "pet", species: ["dog", "cat"], cat: "bandana", fab: ["BD"], print: "chaibreak",
    colors: ["butter", "chalk", "midnight"], price: 399, mrp: 499, badge: "New", isNew: 1,
    desc: "Tiny cutting-chai glasses all over. Slip-on collar sleeve, machine washable." },
  { sku: "BD-003", id: "bandana-diya", name: "Festive Diya Bandana", kind: "pet", species: ["dog", "cat"], cat: "bandana", fab: ["BD"], print: "diyapattern", edit: "diwali",
    colors: ["marigold", "butter", "midnight"], price: 399, mrp: 499, badge: "Diwali edit", isNew: 1,
    desc: "Little diyas all over, for festive photos without the noise. Reversible to solid." },

  /* ---------- Pawrent tees ---------- */
  { sku: "HT-001", id: "human-dog-parent", name: "Dog Parent Oversized Tee", kind: "human", species: ["dog"], cat: "tee", fab: ["HT220"], print: "parent",
    colors: ["chalk", "midnight", "sage", "charcoal"], price: 1199, mrp: 1499, badge: "Signature", best: 10,
    desc: "Drop-shoulder oversized fit in heavyweight cotton. Fur shows less on Chalk and Sage." },
  { sku: "HT-002", id: "human-cat-mom", name: "Cat Mom Club Tee", kind: "human", species: ["cat"], cat: "tee", fab: ["HT180"], print: "manager",
    colors: ["blush", "chalk", "charcoal"], price: 1099, mrp: 1499,
    desc: "Regular fit, combed cotton. Membership is lifelong and non-negotiable." },
  { sku: "HT-003", id: "human-adopt", name: "Adopt, Don't Shop Tee", kind: "human", species: ["dog", "cat"], cat: "tee", fab: ["HT180"], print: "indie",
    colors: ["marigold", "chalk", "midnight"], price: 1099, mrp: 1499, badge: "Adopt",
    desc: "Wear the message. Pairs with the Indie & Proud dog tee." },
  { sku: "HT-004", id: "human-dog-face", name: "Big Dog Face Tee", kind: "human", species: ["dog"], cat: "tee", fab: ["HT180"], print: "dogface",
    colors: ["butter", "sky", "chalk"], price: 1099, mrp: 1499,
    desc: "A floppy-eared hero across your chest. Bio-washed so it's soft from day one." },
  { sku: "HT-005", id: "human-walk-crew", name: "Walk Crew Tee", kind: "human", species: ["dog"], cat: "tee", fab: ["HTCM"], print: "walkies",
    colors: ["sky", "sage", "charcoal"], price: 999, mrp: 1299,
    desc: "For the 6 AM and 9 PM shifts. Breathable cotton-modal." },
  { sku: "HT-006", id: "human-dog-mom", name: "Dog Mom Tee", kind: "human", species: ["dog"], cat: "tee", fab: ["HT180"], print: "dogmom",
    colors: ["blush", "chalk", "sky"], price: 1099, mrp: 1499, badge: "New", isNew: 1, best: 11,
    desc: "Says it plainly. Pairs with the Mom's Baby dog tee." },
  { sku: "HT-007", id: "human-dog-dad", name: "Dog Dad Tee", kind: "human", species: ["dog"], cat: "tee", fab: ["HT180"], print: "dogdad",
    colors: ["midnight", "sage", "charcoal", "chalk"], price: 1099, mrp: 1499, badge: "New", isNew: 1, best: 12,
    desc: "Official title. Pairs with the Dad's Buddy dog tee." },
  { sku: "HT-008", id: "human-cat-dad", name: "Cat Dad Tee", kind: "human", species: ["cat"], cat: "tee", fab: ["HT180"], print: "catdad",
    colors: ["charcoal", "chalk", "sky"], price: 1099, mrp: 1499, badge: "New", isNew: 1,
    desc: "For the dads who got adopted by a cat and never recovered." },
  { sku: "HT-009", id: "human-treat-dealer", name: "Treat Dealer Tee", kind: "human", species: ["dog"], cat: "tee", fab: ["HT180"], print: "treats",
    colors: ["marigold", "chalk", "charcoal"], price: 1099, mrp: 1499,
    desc: "Every pet in the colony knows your pockets. Pairs with the Treat Inspector dog tee." },
  { sku: "HT-010", id: "human-nap-cat", name: "Naps With My Cat Tee", kind: "human", species: ["cat"], cat: "tee", fab: ["HT180"], print: "napping",
    colors: ["sky", "blush", "chalk"], price: 1099, mrp: 1499,
    desc: "Weekend plans: sorted. Pairs with the Pro Napper cat tee." },
  { sku: "HT-011", id: "human-diwali", name: "Diyas, Not Patake Tee", kind: "human", species: ["dog", "cat"], cat: "tee", fab: ["HT180"], print: "diwali", edit: "diwali",
    colors: ["butter", "marigold", "midnight"], price: 1099, mrp: 1499, badge: "Diwali edit", isNew: 1,
    desc: "A quieter, brighter Diwali for the pets in your life." },
  { sku: "HT-012", id: "human-rescue", name: "Rescued Is My Favourite Breed Tee", kind: "human", species: ["dog", "cat"], cat: "tee", fab: ["HT180"], print: "rescue",
    colors: ["marigold", "chalk", "midnight"], price: 1099, mrp: 1499, badge: "Adopt",
    desc: "True for dogs, true for cats. Pairs with the Rescued & Loved pet tee." },

  /* ---------- Pawrent hoodies ---------- */
  { sku: "HH-001", id: "human-hoodie", name: "Pawrent Heavyweight Hoodie", kind: "human", species: ["dog", "cat"], cat: "hoodie", fab: ["HH380"], print: "zoomies",
    colors: ["charcoal", "midnight", "sage"], price: 1999, mrp: 2499, badge: "Winter drop",
    desc: "Heavyweight loopback fleece with a kangaroo pocket that fits treats, poop bags and your phone." },
  { sku: "HH-002", id: "human-dog-dad-hoodie", name: "Dog Dad Heavyweight Hoodie", kind: "human", species: ["dog"], cat: "hoodie", fab: ["HH380"], print: "dogdad",
    colors: ["charcoal", "midnight"], price: 1999, mrp: 2499, badge: "New", isNew: 1,
    desc: "The Dog Dad print on heavyweight fleece, for winter walks." }
];

TT.EDITS = { diwali: "Diwali edit" };

TT.COUPONS = {
  TWINNING15: { label: "15% off when your bag has a twinning set", test: (c) => c.items.some((i) => TT.byId(i.id).kind === "twin"), value: (c) => Math.round(c.sub * 0.15), need: "Add a twinning set to use TWINNING15" },
  FIRSTWOOF:  { label: "₹150 off orders above ₹999", test: (c) => c.sub >= 999, value: () => 150, need: "FIRSTWOOF needs a bag total of ₹999 or more" },
  ADOPT10:    { label: "10% off — thanks for adopting", test: () => true, value: (c) => Math.round(c.sub * 0.10) }
};

/* How to measure — shown on the home page */
TT.MEASURE = [
  ["Chest", "Wrap a soft tape around the widest part of the chest, just behind the front legs. This decides the size."],
  ["Neck", "Measure where the collar sits, with two fingers under the tape so it's comfortable."],
  ["Back length", "From the base of the neck to the base of the tail. Long-backed breeds like Dachshunds may need to size up."]
];

TT.FAQ = [
  ["How do I pick the right size for my pet?", "Measure the widest part of your pet's chest, just behind the front legs, and match it to the chest range in our size guide. Between sizes? Go up one. Or use the breed size finder on the home page."],
  ["Can I exchange if it doesn't fit?", "Yes — size exchanges are free within 15 days as long as the tee is unwashed and the tags are on. Personalised items can be exchanged for size, but not returned."],
  ["Are the prints safe if my dog licks or chews them?", "We print with water-based, AZO-free inks. They're safe on skin, but no clothing is a chew toy — always supervise."],
  ["How long does delivery take?", "Ready-to-ship items reach metro cities in 2–4 days and the rest of India in 4–7 days. Personalised items take an extra 3–4 working days to print."],
  ["Do you offer Cash on Delivery?", "Yes, COD is available on all pincodes we deliver to, along with UPI, cards and netbanking."],
  ["How should I wash them?", "Turn inside out, cold machine wash with similar colours, and line dry. Skip the dryer to keep the print crisp and the pet tee's rib collar springy."]
];

TT.byId = (id) => TT.PRODUCTS.find((p) => p.id === id);
TT.fabShort = (p) => p.fab.length > 1 ? "Set of 2 · " + p.fab.map((f) => TT.FABRICS[f].short.split(" ")[0]).join(" + ") + " GSM" : TT.FABRICS[p.fab[0]].short;
