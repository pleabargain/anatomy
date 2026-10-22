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
  [M.CASE.x, M.CASE.y, M.CASE.z + M.CASE.h + M.DOME.h + M.FACE_H + M.BEZEL_H],
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

A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);

const items = R.items.map((item) => `<g class="it" data-name="${item.name}"${item.part ? ` data-part="${item.part}"` : ""}>${item.svg}</g>`);

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
