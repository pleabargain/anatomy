export const PLATE = { x: -72, y: -64, w: 144, d: 128, r: 8 };
export const PLATE_H = 14;
export const FOOT_AT = [[-56, -48], [56, -48], [-56, 48], [56, 48]];
export const FOOT_SHANK_R = 6;
export const FOOT_SHANK_H = 4;
export const FOOT_PAD_R = 9;
export const FOOT_PAD_H = 3;
export const NAME_PLATE = { x: 22, y: 36, w: 34, d: 12, r: 1 };
export const NAME_H = 1.6;
export const SCALE_STRIP = { x: -26, y: 25, w: 52, d: 6, r: 1 };
export const SCALE_H = 0.8;
export const WAY = { x: -56, w: 112, d: 10, r: 1 };
export const WAY_Y = [-20, 20];
export const WAY_H = 5;
export const WAY_STOP = { x: 53, y: -7, w: 8, d: 14, r: 1 };
export const WAY_STOP_H = 8;
export const CARRIAGE = { x: -34, y: -25, w: 68, d: 50, r: 3 };
export const CARRIAGE_BOTTOM = 8;
export const DECK = 13;
export const SHOE = { w: 14, d: 10, h: 3, x: 26, y: 20 };
export const BLOCK_W = 17;
export const BLOCK_D = 26;
export const BLOCKS = [
  { id: 1, x: -19, h: 18 },
  { id: 2, x: 0, h: 14 },
  { id: 3, x: 19, h: 10 },
];
export const ANVIL = { x: 0, y: 0, r: 1.6, h: 0.8 };
export const STEM_R = 1.6;
export const PLUNGER_L = 34;
export const BORE_R = 2.2;
export const CASE = { x: 0, y: 0, r: 15, z: 48, h: 24 };
export const FACE_R = 12;
export const FACE_H = 1.2;
export const BEZEL_IN = 12;
export const BEZEL_OUT = 15;
export const BEZEL_H = 2.4;
export const GRAD_R = 11;
export const SCALE = 20;
export const MAJOR_EVERY = 5;
export const NEEDLE = { r0: 2, r1: 11, z: 73.4 };
export const HUB = { r: 2, h: 0.8 };
export const STAND_BASE = { x: -16, y: -62, w: 32, d: 24, r: 4 };
export const STAND_BASE_H = 10;
export const COLUMN = { x: -6, y: -56, w: 12, d: 12, r: 2 };
export const COLUMN_TOP = 48;
export const CLAMP = { w: 6, d: 2, z: 34, h: 14, x: 12 };
export const ARM = { x: -6, y: -44, w: 12, d: 36, z: 42, h: 6 };
export const ARM_RIB = { x: -3, y: -40, w: 6, d: 20, r: 1 };
export const THUMB = { r: 3, len: 3.5, z: 40 };
export const REST = 0;
export const REST_TOP = DECK + BLOCKS[1].h;
export const STOPS = [19, 0, -19];
export const TRAVEL = { from: -19, to: 19 };

export function contactAt(cx) {
  let top = DECK;
  let block = null;
  for (const item of BLOCKS) {
    const from = cx + item.x - BLOCK_W / 2;
    const to = cx + item.x + BLOCK_W / 2;
    if (to > ANVIL.x - ANVIL.r && from < ANVIL.x + ANVIL.r) {
      const height = DECK + item.h;
      if (height > top) {
        top = height;
        block = item;
      }
    }
  }
  return { top, block };
}

export const travelOf = (top) => top - DECK;
export const turnOf = (travel) => travel / SCALE;

export function readoutOf(cx) {
  const state = contactAt(cx);
  const travel = travelOf(state.top);
  const name = state.block ? `standard ${state.block.id}` : "the carriage deck";
  return `${name} · ${travel.toFixed(1)} mm`;
}

export function wordsOf(cx) {
  const state = contactAt(cx);
  const travel = travelOf(state.top);
  if (!state.block) return `the anvil rests on the carriage deck, reading ${travel.toFixed(1)} millimetres`;
  return `standard ${state.block.id}, ${state.block.h} millimetres tall, reads ${travel.toFixed(1)} millimetres`;
}
