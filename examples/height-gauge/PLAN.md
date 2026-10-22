# Height gauge — task list

Repo: `C:/Users/denni/OneDrive/Documents/anatomy-physics` (fork `pleabargain/anatomy`, upstream `wheresryan22/anatomy`).
Target: new example `examples/height-gauge/` in the fork. Push only on explicit approval.

## Why the plan lives here

This file is the handover and it is tracked in git, so it survives a lost session or a compaction.
Every task below is small enough to finish in one step, and each one ends in a commit, so a lost
session costs at most one task. Read this file first, then read the git log: the log names the task
that was last landed.

## Strategy

- One task per commit. The commit message names the task id (S1, S2, …).
- A task is finished when its check passes **and** the commit lands.
- If a check fails, the task stays open; do not start the next one.
- The todo list below is the source of truth. Tick a box when its commit lands, and add one
  line to the log with the command that was run and what it printed.
- Rules for every task: no comments in code, no number written twice, every drawn solid
  recorded with its true shape, `stand.`-prefixed names are the audit's ground, lines end on
  something, both themes rebuild byte-identical.
- Keep the tasks small. A task that needs more than one tool call to land is two tasks.

## The figure

A bench height gauge. A granite surface plate on four leveling feet, two ground ways on the
plate, and a carriage riding those ways with three gauge standards 18, 14 and 10 mm tall.
A cast stand behind carries a dial case over the carriage; the case's bored bottom guides a
spring-loaded plunger whose anvil rests on the standard currently under it. The dial is
graduated 0–20 in 1 mm divisions and turns one full revolution per 20 mm of plunger travel,
so the needle points at the height of the standard it is reading.

Numbers are the contract: standards 18/14/10 mm, 20 mm per revolution, 20 divisions, needle
turn = travel / 20. The readout, the needle and the caption all read from `model.mjs`.

## Audit strategy

`A.recorder(P)`, no explode order, so only the rest pose is checked.

- One `R.put` per drawn part with its true shapes. `A.settle(R, P)` then sort items by key
  and draw in that order, so the painter's order is measured rather than guessed.
- Chain to ground: stand.plate is ground; ways sit on the plate; shoes on the ways; carriage
  on the shoes; standards on the deck; anvil on a standard top; stem on the anvil; case on the
  arm; arm on the column; column on the base; base on the plate.
- The case is a bored ring (BORE_R 2.2) so the stem slides in it without an interlock.
- `coverage` bites: an item's recorded shapes must cover 60 % of what it draws. One part per
  item, never a whole assembly in one shape.

## Todo

### Open

| # | Task | Check | Done |
|---|---|---|---|
| S12 | Case: bored barrel, shoulder and knurled grip band | build runs, audit clean | [x] |
| S13 | Face: the dial disc on the case | build runs, audit clean | [x] |
| S14 | Face: chapter ring, 20 graduations, zero mark | build runs, audit clean | [x] |
| S15 | Face: hub boss and the mm label | build runs, audit clean | [x] |
| S16 | Face: the needle at the rest angle | build runs, audit clean | [x] |
| S18 | Carriage: body and deck | build runs, audit clean | [ ] |
| S19 | Carriage: 4 shoes on the ways | build runs, audit clean | [ ] |
| S20 | Carriage: standard 1, 18 mm | build runs, audit clean | [ ] |
| S21 | Carriage: standard 2, 14 mm | build runs, audit clean | [ ] |
| S22 | Carriage: standard 3, 10 mm | build runs, audit clean | [ ] |
| S23 | Carriage: index blade on the scale strip | build runs, audit clean | [ ] |
| S24 | Carriage: west knob on the end face | build runs, audit clean | [ ] |
| S25 | Plunger: anvil resting on the standard | build runs, audit clean | [ ] |
| S26 | Plunger: stem in the bore | build runs, audit clean | [ ] |
| S27 | `node build.mjs --audit` | prints `audit passed` | [ ] |
| S28 | Live: page script, carriage moves in x | carriage follows the model | [ ] |
| S29 | Live: needle angle from the model | needle points at the travel | [ ] |
| S30 | Live: readout text from the model | readout shows the standard | [ ] |
| S31 | Live: pointer drag on the carriage | drag moves the carriage | [ ] |
| S32 | Live: arrow keys step between the stops | readout changes | [ ] |
| S33 | Live: idle tour cycles the stops | carriage cycles on its own | [ ] |
| S34 | Live: reduced motion still, offscreen stops | capture is static | [ ] |
| S35 | Line ends, dark page | `node scripts/lines.mjs examples/height-gauge/height-gauge.html --out shots/hg-lines.png` prints `line ends: 0` | [ ] |
| S36 | Line ends, light page | same for `height-gauge-light.html` | [ ] |
| S37 | Capture: desktop, dark | PNG read | [ ] |
| S38 | Capture: desktop, light | PNG read | [ ] |
| S39 | Capture: 390 wide, both themes | PNG read | [ ] |
| S40 | Close-up: the face and the needle | PNG read | [ ] |
| S41 | Close-up: the anvil and the standard | PNG read | [ ] |
| S42 | Close-up: the case and the yoke | PNG read | [ ] |
| S43 | Close-up: the stand and the ways | PNG read | [ ] |
| S44 | Fix what the close-ups show, re-capture | PNG read | [ ] |
| S45 | README: example table row | `git diff` shows README | [ ] |
| S46 | README: note that small tasks help the model | `git diff` shows README | [ ] |
| S47 | SKILL.md: height gauge in the example list | `git diff` shows SKILL.md | [ ] |
| S48 | CHANGELOG: entry under Unreleased | `git diff` shows CHANGELOG | [ ] |
| S49 | CI: add the height gauge to the build list | `git diff` shows the workflow | [ ] |
| S50 | Final rebuild of both themes, commit the pages | `git status --short` clean after rebuild | [ ] |
| S51 | Copy the example into `C:/Users/denni/.agents/skills/anatomy/examples/height-gauge/` | the installed skill has the folder | [ ] |
| S52 | Push to the fork | explicit approval first | [ ] |

### Done

- S1 `model.mjs`: final numbers and the model's four functions. `node -e "…contactAt(0)…"` printed
  `{ top: 27, block: { id: 2, x: 0, h: 14 } }` at cx=0, `{ top: 31, block: { id: 1, x: -19, h: 18 } }`
  at cx=19 and `{ top: 23, block: { id: 3, x: 19, h: 10 } }` at cx=-19.
- S2 `build.mjs` shell: projection, recorder, page, writes both themes. Build runs and writes
  both `height-gauge.html` and `height-gauge-light.html`.
- S3 Bench: plate with a halo, four leveling feet, name plate with three rules and two screws.
- S4 Bench: scale strip with minor and major ticks.
- S5 Bench: two ground ways, each with two countersunk screws.
- S6 Bench: the way stop block at the east end of the near way.
- S7 Stand: cast base with four socket screws.
- S8 Stand: column with a flute.
- S9 Stand: two clamp cheeks with bolts, gripping the arm.
- S10 Stand: the arm and its underside rib.
- S11 Stand: the knurled thumb screw on the east cheek.
  `node examples/height-gauge/build.mjs --audit` printed `audit passed` (11 items, 23 solids).
- S12–S16 The dial: the bored case with its knurled grip band, the dial disc, the chapter ring
  with twenty graduations and the zero mark, the hub boss and the needle at the rest angle.
  `node examples/height-gauge/build.mjs --audit` printed `audit passed` (14 items, 27 solids).
  A close-up of the dial shows the needle on graduation 14 with the carriage at rest.

## Log

- S0: plan written and re-cut into small tasks. Read the kit: `audit.mjs` exports and the
  `supports`, `coverage`, `depthOrder` rules; `lathe.mjs` exports; `line-ends.mjs` end rules;
  the CI build list; the house rules in CONTRIBUTING. The upstream `examples/dial-indicator` is
  the reference for the same prompt and for the ride-over idiom.
- S2–S11: `node examples/height-gauge/build.mjs --audit` printed `audit passed`.
- S12–S16: `node examples/height-gauge/build.mjs --audit` printed `audit passed`.
  `node scripts/capture.mjs examples/height-gauge/height-gauge.html --out shots/hg-02.png` and
  `--zoom 180,40,200,140 --zoom-scale 4` read the dial: the needle points at graduation 14.
