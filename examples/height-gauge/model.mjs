export const PLATE = { x: -150, y: -64, w: 300, d: 128, r: 8 };
export const PLATE_H = 14;
export const FOOT_AT = [[-124, -40], [124, -40], [-124, 40], [124, 40]];
export const FOOT_PAD_R = 9;
export const FOOT_PAD_H = 3;
export const FOOT_SHANK_R = 6;
export const FOOT_SHANK_H = 4;
export const NAME_PLATE = { x: -19, y: 30, w: 38, d: 12, r: 1 };
export const NAME_H = 1.6;
export const WAY = { x: -120, w: 240, d: 10, r: 1 };
export const WAY_Y = [-22, 22];
export const WAY_H = 5;
export const WAY_STOP = { x: 120, y: -7, w: 8, d: 14, r: 1 };
export const CARRIAGE = { w: 76, d: 50, r: 3 };
export const CARRIAGE_BOTTOM = 8;
export const DECK = 13;
export const SHOE = { w: 14, d: 10, h: 3, x: 26, y: 22 };
export const BLOCK_W = 15;
export const BLOCK_D = 26;
export const BLOCKS = [
  { id: 1, x: -19, h: 18 },
  { id: 2, x: 0, h: 14 },
  { id: 3, x: 19, h: 10 },
];
export const ANVIL = { x: 0, y: 0, r: 3, h: 1.6 };
export const ROD_R = 1.5;
export const ROD_L = 33;
export const CASE = { x: 0, y: 0, r: 21, z: 46, h: 20 };
export const CASE_WAIST = { z0: 52, z1: 62, r: 17 };
export const FACE_R = 18;
export const FACE_H = 1;
export const BEZEL_R = 21;
export const BEZEL_H = 2;
export const GRAD_R = 17.6;
export const DIVISIONS = 20;
export const NEEDLE = { r0: 2.4, r1: 17.6, z: 67.4 };
export const HUB = { r: 2.4, h: 0.8 };
export const STAND_BASE = { x: -16, y: -62, w: 32, d: 24, r: 4 };
export const STAND_BASE_H = 10;
export const COLUMN = { x: -9, y: -60, w: 18, d: 16, r: 2 };
export const COLUMN_TOP = 52;
export const ARM = { x: -7, y: -65, w: 14, d: 24, r: 1.5 };
export const ARM_Z = 52;
export const ARM_H = 12;
export const RING = { y0: -41, y1: -31, ri: 6.4, ro: 10, z: 58 };
export const SHOULDER = { y0: -27, y1: -14, r: 9, z: 58 };
export const STEM = { y0: -41, y1: -27, r: 6, z: 58 };
export const NUT = { y0: -31, y1: -27, r: 11, z: 58 };
export const REST = 0;
export const STOPS = [19, 0, -19];
export const TRAVEL = { from: -19, to: 19 };

export function contactAt(cx) {
  let z = DECK;
  let block = null;
  for (const item of BLOCKS) {
    const from = cx + item.x - BLOCK_W / 2;
    const to = cx + item.x + BLOCK_W / 2;
    if (to > ANVIL.x - ANVIL.r && from < ANVIL.x + ANVIL.r) {
      const top = DECK + item.h;
      if (top > z) {
        z = top;
        block = item;
      }
    }
  }
  return { z, block };
}

export const travelOf = (z) => z - DECK;
export const turnOf = (travel) => travel / DIVISIONS;

export function readoutAt(cx) {
  const state = contactAt(cx);
  const travel = travelOf(state.z);
  const name = state.block ? `standard ${state.block.id}` : "the carriage deck";
  return `${name} · ${travel.toFixed(1)} mm`;
}

export function wordsAt(cx) {
  const state = contactAt(cx);
  const travel = travelOf(state.z);
  if (!state.block) return `the anvil rests on the carriage deck, reading ${travel.toFixed(1)} millimetres`;
  return `standard ${state.block.id}, ${state.block.h} millimetres tall, reads ${travel.toFixed(1)} millimetres`;
}
