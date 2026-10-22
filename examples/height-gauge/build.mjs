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
const HEIGHT = 420;

const POINTS = [
  ...k.boxCorners(M.PLATE, -M.PLATE_H - 7, 0),
  [M.CASE.x, M.CASE.y, M.CASE.z + M.CASE.h + 4],
  [0, M.RING.y0, M.RING.z],
];

const P = k.fitProjection(POINTS, WIDTH, HEIGHT, { pad: 26, azimuth: 40 });

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);

const R = A.recorder(P);
const record = R.solid;

function part(name, ref, svg, shapes = [], extra = {}) {
  R.put({ name, at: ref, svg, shapes, piece: "bench", ...extra });
  return svg;
}

const bench = [];

bench.push(
  part(
    "stand.plate",
    [0, 0, -M.PLATE_H / 2],
    `<path class="iso-halo" d="${k.haloOf(M.PLATE, -M.PLATE_H - 7, 7, P)}"/>` +
      S(k.slabOf(M.PLATE, -M.PLATE_H, M.PLATE_H, P, 8, 1.6), { tone: "mid" }),
    [record(A.slab(M.PLATE, -M.PLATE_H, M.PLATE_H, { name: "stand.plate", owner: "stand" }))],
  ),
);

{
  const feet = [];
  for (const [x, y] of M.FOOT_AT) {
    feet.push(
      S(k.cylinder(x, y, M.FOOT_SHANK_R, -M.PLATE_H, M.FOOT_SHANK_H, P, 24), { tone: "lo" }),
      S(k.cylinder(x, y, M.FOOT_PAD_R, -M.PLATE_H - M.FOOT_PAD_H, M.FOOT_PAD_H, P, 28), { tone: "lo" }),
    );
  }
  bench.push(
    part(
      "stand.feet",
      [0, 0, -M.PLATE_H - 3],
      feet.join(""),
      M.FOOT_AT.flatMap(([x, y]) => [
        record(A.cylinder(x, y, M.FOOT_SHANK_R, -M.PLATE_H, M.FOOT_SHANK_H, { name: "stand.foot-shank", owner: "stand" })),
        record(A.cylinder(x, y, M.FOOT_PAD_R, -M.PLATE_H - M.FOOT_PAD_H, M.FOOT_PAD_H, { name: "stand.foot-pad", owner: "stand" })),
      ]),
    ),
  );
}

{
  const plan = M.NAME_PLATE;
  const rules = [
    [[plan.x + 4, plan.y + 3.6], [plan.x + 15, plan.y + 3.6]],
    [[plan.x + 4, plan.y + 6.2], [plan.x + 26, plan.y + 6.2]],
    [[plan.x + 4, plan.y + 8.8], [plan.x + 19, plan.y + 8.8]],
  ];
  bench.push(
    part(
      "stand.nameplate",
      [plan.x + plan.w / 2, plan.y + plan.d / 2, M.NAME_H / 2],
      S(k.slabOf(plan, 0, M.NAME_H, P, 3, 0.3), { tone: "lo" }) +
        Ln(k.planOutline(k.insetPlan(plan, 1.2), M.NAME_H, P), { tone: "faint" }) +
        rules
          .map(([[x1, y1], [x2, y2]]) => Ln(k.segment([x1, y1, M.NAME_H], [x2, y2, M.NAME_H], P), { tone: "lo", free: true }))
          .join("") +
        Dots(
          [
            at([plan.x + 1.4, plan.y + 1.4, M.NAME_H]),
            at([plan.x + plan.w - 1.4, plan.y + plan.d - 1.4, M.NAME_H]),
          ],
          { size: 0.4, tone: "lo" },
        ),
      [record(A.slab(plan, 0, M.NAME_H, { name: "stand.nameplate", owner: "stand" }))],
    ),
  );
}

{
  const ways = [];
  const shapes = [];
  for (const y of M.WAY_Y) {
    const plan = { x: M.WAY.x, y: y - M.WAY.d / 2, w: M.WAY.w, d: M.WAY.d, r: M.WAY.r };
    ways.push(S(k.slabOf(plan, 0, M.WAY_H, P, 3, 0.4), { tone: "mid" }));
    shapes.push(record(A.slab(plan, 0, M.WAY_H, { name: "stand.way", owner: "stand" })));
  }
  bench.push(part("stand.ways", [0, 0, M.WAY_H / 2], ways.join(""), shapes));
}

{
  const plan = M.WAY_STOP;
  bench.push(
    part(
      "stand.way-stop",
      [plan.x + plan.w / 2, plan.y + plan.d / 2, 4],
      S(k.slabOf(plan, 0, 8, P, 3, 0.5), { tone: "mid" }) +
        Dots(
          [
            at([plan.x + 2, plan.y + 3, 8]),
            at([plan.x + plan.w - 2, plan.y + plan.d - 3, 8]),
          ],
          { size: 0.45, tone: "lo" },
        ),
      [record(A.slab(plan, 0, 8, { name: "stand.way-stop", owner: "stand" }))],
    ),
  );
}

A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);

const figure = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "A bench height gauge: a dial indicator on a cast stand over a carriage of gauge blocks 18, 14 and 10 tall.",
  body: R.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`),
});

const card = k.plateHtml({
  fig: "Fig 1",
  title: "Height gauge",
  hint: "Drag the carriage",
  readout: M.readoutAt(M.REST),
  keys: [
    { mark: "lit", label: "Anvil and needle: what moves when the height changes" },
    { mark: "raised", label: "Three standards: 18, 14 and 10 tall" },
  ],
  caption:
    "A bench height gauge on a granite surface plate. A carriage on two ground ways carries three gauge standards 18, 14 and 10 tall. A cast column holds a dial whose anvil rides on the standard under it, and the face is graduated 0 to 20 in millimetres, so the needle turns one full revolution for every 20 units of anvil travel and points at the height of the standard below it.",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Height gauge: slide the carriage to bring a standard under the anvil" aria-valuemin="0" aria-valuemax="20" aria-valuenow="14">${figure}</div>`,
});

const model = readFileSync(join(HERE, "model.mjs"), "utf8").replace(/^export /gm, "");
const page = k.pageHtml({
  title: "Height gauge",
  theme: THEME,
  body: card,
  script: kitScript() + model + `const P = ${JSON.stringify(P)};`,
  width: 700,
});

const file = join(HERE, THEME === "light" ? "height-gauge-light.html" : "height-gauge.html");
writeFileSync(file, page);
console.log("wrote", file.split(/[\\/]/).pop(), `${(page.length / 1024).toFixed(0)} KB`, `${R.items.length} items`);

A.auditOrExit(R, P);
