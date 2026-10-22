import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../kit/iso-kit.mjs";
import * as A from "../../kit/audit.mjs";
import * as G from "../../kit/lathe.mjs";
import { kitScript } from "../../scripts/inline-kit.mjs";
import * as M from "./model.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const THEME = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 660;
const HEIGHT = 450;

const POINTS = [
  ...k.boxCorners(M.PLATE, -M.PLATE_H - M.FOOT_SHANK_H - M.FOOT_PAD_H, 0),
  [M.CASE.x, M.CASE.y, M.FACE_TOP + M.FACE_H + M.HUB.h],
  [M.COLUMN.x, M.COLUMN.y, M.COLUMN_TOP],
];
const P = k.fitProjection(POINTS, WIDTH, HEIGHT, { pad: 26, azimuth: 40 });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);

const R = A.recorder(P);
const record = R.solid;

function put(name, ref, svg, shapes = [], extra = {}) {
  R.put({ name, at: ref, svg, shapes, piece: "bench", ...extra });
}

function knurlAlong(F, radius, s0, s1, count) {
  const lines = [];
  for (let index = 0; index < count; index++) {
    const angle = (index / count) * Math.PI * 2;
    lines.push(k.segment(G.pointOf(F, s0, radius, angle), G.pointOf(F, s1, radius, angle), P));
  }
  return lines.join("");
}

{
  const F = G.frameAlong([M.CASE.x, M.CASE.y, M.CASE.z], [0, 0, 1]);
  const body = [[0, M.CASE.r], [M.CASE_SHOULDER, M.CASE.r], [M.CASE.h, M.CASE_TOP_R]];
  const head = [[M.CASE_BORE_H, M.CASE.r], [M.CASE_SHOULDER, M.CASE.r], [M.CASE.h, M.CASE_TOP_R]];
  const from = M.CASE.z + M.CASE_KNURL.from;
  const to = M.CASE.z + M.CASE_KNURL.to;
  put(
    "stand.case",
    [M.CASE.x, M.CASE.y, M.CASE.z + M.CASE.h / 2],
    S(G.solidOf(body, F, P), { tone: "mid" }) +
      Ln(k.sideArc(M.CASE.x, M.CASE.y, M.CASE.r, from, P, 40), { tone: "faint" }) +
      Ln(k.sideArc(M.CASE.x, M.CASE.y, M.CASE.r, to, P, 40), { tone: "faint" }) +
      Ln(k.knurl(M.CASE.x, M.CASE.y, M.CASE.r, from, to, 72, P, 0.3), { tone: "lo" }),
    [
      record(A.ring(F, 0, M.CASE_BORE_H, M.BORE_R, M.CASE.r, { name: "stand.case" })),
      record(A.solid(F, head, { name: "stand.case" })),
    ],
  );
}

{
  const z = M.FACE_TOP;
  const top = z + M.FACE_H;
  const ticks = k.radialTicks(M.CASE.x, M.CASE.y, M.GRAD_R, M.SCALE, M.MAJOR_EVERY, top, [1.3, 2.4], P, M.DIAL_ZERO);
  const zero = [Math.sin(M.DIAL_ZERO), -Math.cos(M.DIAL_ZERO)];
  put(
    "stand.face",
    [M.CASE.x, M.CASE.y, z],
    S(k.cylinder(M.CASE.x, M.CASE.y, M.FACE_R, z, M.FACE_H, P, 64, 0.5), { tone: "hi", crease: "lo" }) +
      Ln(k.ring(M.CASE.x, M.CASE.y, M.GRAD_R, top, P, 64), { tone: "faint" }) +
      Ln(ticks.minor, { tone: "lo" }) +
      Ln(ticks.major, { tone: "mid" }) +
      Ln(
        k.lineOnTop(
          [M.CASE.x + zero[0] * M.GRAD_R, M.CASE.y + zero[1] * M.GRAD_R],
          [M.CASE.x + zero[0] * (M.GRAD_R - 3.4), M.CASE.y + zero[1] * (M.GRAD_R - 3.4)],
          top,
          P,
        ),
        { tone: "hi" },
      ) +
      k.faceTextSvg(k.topMatrix([M.CASE.x, M.CASE.y + 7], top, P, "x"), "mm", { size: 2.6, tone: "lo", anchor: "middle" }),
    [record(A.cylinder(M.CASE.x, M.CASE.y, M.FACE_R, z, M.FACE_H, { name: "stand.face" }))],
  );
}

{
  put(
    "stand.hub",
    [M.CASE.x, M.CASE.y, M.FACE_TOP + M.FACE_H + M.HUB.h / 2],
    S(k.cylinder(M.CASE.x, M.CASE.y, M.HUB.r, M.FACE_TOP + M.FACE_H, M.HUB.h, P, 32, 0.2), { tone: "hi", crease: "lo" }),
    [record(A.cylinder(M.CASE.x, M.CASE.y, M.HUB.r, M.FACE_TOP + M.FACE_H, M.HUB.h, { name: "stand.hub" }))],
  );
}

{
  const plan = M.CARRIAGE;
  const z = M.CARRIAGE_BOTTOM;
  const h = M.DECK - M.CARRIAGE_BOTTOM;
  const screws = [
    [-30, -21],
    [30, -21],
    [-30, 21],
    [30, 21],
  ];
  const ribs = [
    { x: -31, y: 16, w: 19, d: 7, r: 1 },
    { x: 12, y: 16, w: 19, d: 7, r: 1 },
  ];
  put(
    "carriage.body",
    [0, 0, z + h / 2],
    S(k.slabOf(plan, z, h, P, 6, 0.8), { tone: "mid" }) +
      Ln(k.planOutline(k.insetPlan(plan, 3), z + h, P, 6), { tone: "faint" }) +
      ribs
        .map(
          (rib) =>
            S(k.slabOf(rib, z + h, 0.7, P, 3, 0.2), { tone: "mid", crease: "none" }) +
            Ln(k.planOutline(k.insetPlan(rib, 1.4), z + h + 0.7, P, 3), { tone: "faint" }),
        )
        .join("") +
      Dots(screws.map(([x, y]) => at([x, y, z + h])), { size: 0.45, tone: "lo" }),
    [
      record(A.slab(plan, z, h, { name: "carriage.body" })),
      ...ribs.map((rib) => record(A.slab(rib, z + h, 0.7, { name: "carriage.body" }))),
    ],
  );
}

{
  const shapes = [];
  const svg = [];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const plan = { x: sx * M.SHOE.x - M.SHOE.w / 2, y: sy * M.SHOE.y - M.SHOE.d / 2, w: M.SHOE.w, d: M.SHOE.d, r: 1 };
      shapes.push(record(A.slab(plan, M.WAY_H, M.SHOE.h, { name: "carriage.shoe" })));
      svg.push(S(k.slabOf(plan, M.WAY_H, M.SHOE.h, P, 3, 0.4), { tone: "lo" }));
    }
  }
  put("carriage.shoes", [0, 0, M.WAY_H + M.SHOE.h / 2], svg.join(""), shapes);
}

for (const block of M.BLOCKS) {
  const plan = { x: block.x - M.BLOCK_W / 2, y: -M.BLOCK_D / 2, w: M.BLOCK_W, d: M.BLOCK_D, r: 1 };
  put(
    `carriage.standard${block.id}`,
    [block.x, 0, M.DECK + block.h / 2],
    S(k.slabOf(plan, M.DECK, block.h, P, 4, 0.5), { tone: "hi", crease: "lo" }) +
      Ln(k.planOutline(k.insetPlan(plan, 2.5), M.DECK + block.h, P, 4), { tone: "faint" }),
    [record(A.slab(plan, M.DECK, block.h, { name: "carriage.standard" }))],
  );
}

{
  const plan = { x: M.INDEX.x, y: M.INDEX.y, w: M.INDEX.w, d: M.INDEX.d, r: 0.3 };
  put(
    "carriage.index",
    [M.INDEX.x + M.INDEX.w / 2, M.INDEX.y + M.INDEX.d / 2, M.INDEX.z + M.INDEX.h / 2],
    S(k.slabOf(plan, M.INDEX.z, M.INDEX.h, P, 2, 0.2), { tone: "mid", crease: "lo" }),
    [record(A.slab(plan, M.INDEX.z, M.INDEX.h, { name: "carriage.index" }))],
  );
}

{
  const F = G.frameAlong([M.CARRIAGE.x, 0, M.KNOB.z], [-1, 0, 0]);
  put(
    "carriage.knob",
    [M.CARRIAGE.x - M.KNOB.len / 2, 0, M.KNOB.z],
    S(G.disc(0, M.KNOB.len, M.KNOB.r, F, P, { steps: 28 }), { tone: "mid" }) +
      Ln(knurlAlong(F, M.KNOB.r, 0.5, M.KNOB.len - 0.5, 18), { tone: "lo" }),
    [record(A.disc(F, 0, M.KNOB.len, M.KNOB.r, { name: "carriage.knob" }))],
  );
}

{
  const top = M.contactAt(M.REST).top;
  put(
    "plunger",
    [M.ANVIL.x, M.ANVIL.y, top + M.ANVIL.h / 2],
    S(k.cylinder(M.ANVIL.x, M.ANVIL.y, M.ANVIL.r, top, M.ANVIL.h, P, 28, 0.2), { tone: "hi", lit: true }) +
      S(k.cylinder(M.ANVIL.x, M.ANVIL.y, M.STEM_R, top + M.ANVIL.h, M.PLUNGER_L, P, 20), { tone: "hi", lit: true, crease: "none" }),
    [
      record(A.cylinder(M.ANVIL.x, M.ANVIL.y, M.ANVIL.r, top, M.ANVIL.h, { name: "plunger" })),
      record(A.cylinder(M.ANVIL.x, M.ANVIL.y, M.STEM_R, top + M.ANVIL.h, M.PLUNGER_L, { name: "plunger" })),
    ],
  );
}

{
  const plan = M.PLATE;
  const z = -M.PLATE_H;
  put(
    "stand.plate",
    [0, 0, 0],
    `<path class="iso-halo" d="${k.haloOf(plan, z - M.FOOT_SHANK_H - M.FOOT_PAD_H, M.FOOT_SHANK_H + M.FOOT_PAD_H, P)}"/>` +
      S(k.slabOf(plan, z, M.PLATE_H, P, 8, 1.6), { tone: "mid" }) +
      Ln(k.planOutline(k.insetPlan(plan, 5), 0, P, 8), { tone: "faint" }),
    [record(A.slab(plan, z, M.PLATE_H, { name: "stand.plate" }))],
  );
}

{
  const shapes = [];
  const svg = [];
  for (const [x, y] of M.FOOT_AT) {
    const z = -M.PLATE_H;
    shapes.push(record(A.cylinder(x, y, M.FOOT_SHANK_R, z - M.FOOT_SHANK_H, M.FOOT_SHANK_H, { name: "stand.foot" })));
    shapes.push(record(A.cylinder(x, y, M.FOOT_PAD_R, z - M.FOOT_SHANK_H - M.FOOT_PAD_H, M.FOOT_PAD_H, { name: "stand.foot" })));
    svg.push(S(k.cylinder(x, y, M.FOOT_SHANK_R, z - M.FOOT_SHANK_H, M.FOOT_SHANK_H, P, 24), { tone: "mid" }));
    svg.push(S(k.cylinder(x, y, M.FOOT_PAD_R, z - M.FOOT_SHANK_H - M.FOOT_PAD_H, M.FOOT_PAD_H, P, 28), { tone: "lo" }));
  }
  put("stand.feet", [0, 0, -M.PLATE_H], svg.join(""), shapes);
}

{
  const plan = M.NAME_PLATE;
  const rules = [
    [[plan.x + 4, plan.y + 2.2], [plan.x + 18, plan.y + 2.2]],
    [[plan.x + 4, plan.y + 3.9], [plan.x + 13, plan.y + 3.9]],
    [[plan.x + 4, plan.y + 5.5], [plan.x + 21, plan.y + 5.5]],
  ];
  put(
    "stand.nameplate",
    [plan.x + plan.w / 2, plan.y + plan.d / 2, M.NAME_H / 2],
    S(k.slabOf(plan, 0, M.NAME_H, P, 3, 0.3), { tone: "lo" }) +
      rules.map(([a, b]) => Ln(k.lineOnTop(a, b, M.NAME_H, P), { tone: "mid" })).join("") +
      Dots([at([plan.x + 2.4, plan.y + 2.2, M.NAME_H]), at([plan.x + plan.w - 2.4, plan.y + plan.d - 2.2, M.NAME_H])], { size: 0.45, tone: "lo" }),
    [record(A.slab(plan, 0, M.NAME_H, { name: "stand.nameplate" }))],
  );
}

{
  const plan = M.SCALE_STRIP;
  const ticks = k.topTicks(plan.x + 2, plan.x + plan.w - 2, 2, 10, plan.y, M.SCALE_H, [1.4, 2.6], P);
  put(
    "stand.scale",
    [plan.x + plan.w / 2, plan.y + plan.d / 2, M.SCALE_H / 2],
    S(k.slabOf(plan, 0, M.SCALE_H, P, 3, 0.2), { tone: "lo" }) +
      Ln(ticks.minor, { tone: "lo" }) +
      Ln(ticks.major, { tone: "mid" }),
    [record(A.slab(plan, 0, M.SCALE_H, { name: "stand.scale" }))],
  );
}

{
  const shapes = [];
  const svg = [];
  for (const y of M.WAY_Y) {
    const plan = { x: M.WAY.x, y: y - M.WAY.d / 2, w: M.WAY.w, d: M.WAY.d, r: M.WAY.r };
    shapes.push(record(A.slab(plan, 0, M.WAY_H, { name: "stand.way" })));
    svg.push(S(k.slabOf(plan, 0, M.WAY_H, P, 3, 0.4), { tone: "mid" }));
    svg.push(Dots([at([M.WAY.x + 7, y, M.WAY_H]), at([M.WAY.x + M.WAY.w - 7, y, M.WAY_H])], { size: 0.45, tone: "lo" }));
  }
  put("stand.ways", [0, 0, M.WAY_H / 2], svg.join(""), shapes);
}

{
  const plan = M.WAY_STOP;
  put(
    "stand.stop",
    [plan.x + plan.w / 2, plan.y + plan.d / 2, M.WAY_STOP_H / 2],
    S(k.slabOf(plan, 0, M.WAY_STOP_H, P, 3, 0.5), { tone: "mid" }) +
      Dots([at([plan.x + plan.w / 2, plan.y + plan.d / 2, M.WAY_STOP_H])], { size: 0.45, tone: "lo" }),
    [record(A.slab(plan, 0, M.WAY_STOP_H, { name: "stand.stop" }))],
  );
}

{
  const plan = M.STAND_BASE;
  const screws = [
    [-12, -58],
    [12, -58],
    [-12, -42],
    [12, -42],
  ];
  put(
    "stand.base",
    [plan.x + plan.w / 2, plan.y + plan.d / 2, M.STAND_BASE_H / 2],
    S(k.slabOf(plan, 0, M.STAND_BASE_H, P, 6, 1.2), { tone: "mid" }) +
      Dots(screws.map(([x, y]) => at([x, y, M.STAND_BASE_H])), { size: 0.5, tone: "lo" }),
    [record(A.slab(plan, 0, M.STAND_BASE_H, { name: "stand.base" }))],
  );
}

{
  const plan = M.COLUMN;
  const rib = { x: -11, y: -52, w: 2, d: 4, r: 0.6 };
  put(
    "stand.column",
    [plan.x + plan.w / 2, plan.y + plan.d / 2, M.STAND_BASE_H],
    S(k.slabOf(plan, M.STAND_BASE_H, M.COLUMN_TOP - M.STAND_BASE_H, P, 4, 0.8), { tone: "mid" }) +
      S(k.slabOf(rib, 12, 32, P, 3, 0.3), { tone: "lo" }),
    [
      record(A.slab(plan, M.STAND_BASE_H, M.COLUMN_TOP - M.STAND_BASE_H, { name: "stand.column" })),
      record(A.slab(rib, 12, 32, { name: "stand.column" })),
    ],
  );
}

{
  const shapes = [];
  const svg = [];
  for (const side of [1, -1]) {
    const plan = { x: side > 0 ? M.CLAMP.x : -M.CLAMP.x - M.CLAMP.w, y: -44, w: M.CLAMP.w, d: M.CLAMP.d, r: 0.6 };
    shapes.push(record(A.slab(plan, M.CLAMP.z, M.CLAMP.h, { name: "stand.clamp" })));
    svg.push(S(k.slabOf(plan, M.CLAMP.z, M.CLAMP.h, P, 3, 0.4), { tone: "mid" }));
    svg.push(
      Dots(
        [M.CLAMP.z + 3, M.CLAMP.z + M.CLAMP.h - 3].map((z) => at([plan.x + (side > 0 ? M.CLAMP.w - 2 : 2), -43, z])),
        { size: 0.45, tone: "lo" },
      ),
    );
  }
  put("stand.clamp", [0, -43, M.CLAMP.z + M.CLAMP.h / 2], svg.join(""), shapes);
}

{
  const plan = M.ARM;
  const prong = { x: M.YOKE.x, y: M.YOKE.y, w: M.YOKE.w, d: M.YOKE.d, r: 0.6 };
  const prongLeft = { x: -M.YOKE.x - M.YOKE.w, y: M.YOKE.y, w: M.YOKE.w, d: M.YOKE.d, r: 0.6 };
  put(
    "stand.arm",
    [plan.x + plan.w / 2, plan.y + plan.d / 2, plan.z + plan.h / 2],
    S(k.slabOf(plan, plan.z, plan.h, P, 4, 0.6), { tone: "mid" }) +
      S(k.slabOf(prong, M.YOKE.z, M.YOKE.h, P, 3, 0.3), { tone: "mid" }) +
      S(k.slabOf(prongLeft, M.YOKE.z, M.YOKE.h, P, 3, 0.3), { tone: "mid" }) +
      Dots([-4.5, 4.5].map((x) => at([x, -40, plan.z + plan.h])), { size: 0.45, tone: "lo" }),
    [
      record(A.slab(plan, plan.z, plan.h, { name: "stand.arm" })),
      record(A.slab(prong, M.YOKE.z, M.YOKE.h, { name: "stand.arm" })),
      record(A.slab(prongLeft, M.YOKE.z, M.YOKE.h, { name: "stand.arm" })),
    ],
  );
}

{
  const F = G.frameAlong([M.CLAMP.x + M.CLAMP.w, -43, M.THUMB.z], [1, 0, 0]);
  put(
    "stand.thumb",
    [M.CLAMP.x + M.CLAMP.w, -43, M.THUMB.z],
    S(G.disc(0, M.THUMB.len, M.THUMB.r, F, P, { steps: 24 }), { tone: "mid" }) +
      Ln(knurlAlong(F, M.THUMB.r, 0.4, M.THUMB.len - 0.4, 20), { tone: "lo" }),
    [record(A.disc(F, 0, M.THUMB.len, M.THUMB.r, { name: "stand.thumb" }))],
  );
}

const needlePath = (turn) => {
  const angle = M.DIAL_ZERO + turn * Math.PI * 2;
  const sx = Math.sin(angle);
  const sy = -Math.cos(angle);
  return k.lineOnTop(
    [M.CASE.x - sx * M.HUB.r, M.CASE.y - sy * M.HUB.r],
    [M.CASE.x + sx * M.NEEDLE.r1, M.CASE.y + sy * M.NEEDLE.r1],
    M.NEEDLE.z,
    P,
  );
};

A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);

const items = [
  ...R.items.map((item) => `<g class="it" data-name="${item.name}"${item.part ? ` data-part="${item.part}"` : ""}>${item.svg}</g>`),
  `<path data-part="needle" class="iso-line" data-tone="lit" data-free="end" d="${needlePath(M.turnOf(M.travelOf(M.REST_TOP)))}" style="stroke-width:1.1"/>`,
];

const model = readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "");

const card = k.plateHtml({
  fig: "Fig 1",
  title: "Height gauge",
  hint: "Drag the carriage",
  readout: M.readoutOf(M.REST),
  keys: [
    { mark: "lit", label: "Needle and anvil: what moves when the height changes" },
    { mark: "raised", label: "Three standards: 18, 14 and 10 mm tall" },
  ],
  caption:
    "A bench height gauge on a granite surface plate. A carriage on two ground ways carries three gauge standards, 18, 14 and 10 mm tall. The dial is graduated 0 to 20 in one-millimetre divisions and turns one full revolution for every 20 mm the plunger rises, so the needle points at the height of the standard under the anvil.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Height gauge: slide the carriage to bring a standard under the anvil" aria-valuemin="0" aria-valuemax="20" aria-valuenow="14">${k.figureSvg({
    width: WIDTH,
    height: HEIGHT,
    label:
      "A bench height gauge: a carriage on a granite surface plate carries three gauge standards of 18, 14 and 10 millimetres, and a dial on a cast stand reads the height of the standard under its anvil.",
    body: items,
  })}</div>`,
});

const page = k.pageHtml({ title: "Height gauge", theme: THEME, body: card, script: kitScript() + model, width: 700 });

const file = join(HERE, THEME === "light" ? "height-gauge-light.html" : "height-gauge.html");
writeFileSync(file, page);
console.log("wrote", file.split(/[\\/]/).pop(), `${(page.length / 1024).toFixed(0)} KB`, `${R.items.length} items`);

A.auditOrExit(R, P);
