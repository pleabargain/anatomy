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
| S17 | Carriage: body and deck | build runs, audit clean | [x] |
| S18 | Carriage: 4 shoes on the ways | build runs, audit clean | [x] |
| S19 | Carriage: standard 1, 18 mm | build runs, audit clean | [x] |
| S20 | Carriage: standard 2, 14 mm | build runs, audit clean | [x] |
| S21 | Carriage: standard 3, 10 mm | build runs, audit clean | [x] |
| S22 | Carriage: index blade on the scale strip | build runs, audit clean | [x] |
| S23 | Carriage: west knob on the end face | build runs, audit clean | [x] |
| S24 | Plunger: anvil resting on the standard | build runs, audit clean | [x] |
| S25 | Plunger: stem in the bore | build runs, audit clean | [x] |
| S26 | `node build.mjs --audit` | prints `audit passed` | [x] |
| S27 | Live: page script, carriage moves in x | carriage follows the model | [x] |
| S28 | Live: needle angle from the model | needle points at the travel | [x] |
| S29 | Live: readout text from the model | readout shows the standard | [x] |
| S30 | Live: pointer drag on the carriage | drag moves the carriage | [x] |
| S31 | Live: arrow keys step between the stops | readout changes | [x] |
| S32 | Live: idle tour cycles the stops | carriage cycles on its own | [x] |
| S33 | Live: reduced motion still, offscreen stops | capture is static | [x] |
| S34 | Line ends, dark page | `node scripts/lines.mjs examples/height-gauge/height-gauge.html --out shots/hg-lines.png` prints `line ends: 0` | [x] |
| S35 | Line ends, light page | same for `height-gauge-light.html` | [x] |
| S36 | Capture: desktop, dark | PNG read | [x] |
| S37 | Capture: desktop, light | PNG read | [x] |
| S38 | Capture: 390 wide, both themes | PNG read | [x] |
| S39 | Close-up: the face and the needle | PNG read | [x] |
| S40 | Close-up: the anvil and the standard | PNG read | [x] |
| S41 | Close-up: the case and the yoke | PNG read | [x] |
| S42 | Close-up: the stand and the ways | PNG read | [x] |
| S43 | Fix what the close-ups show, re-capture | PNG read | [x] |
| S44 | README: example table row | `git diff` shows README | [x] |
| S45 | README: note that small tasks help the model | `git diff` shows README | [x] |
| S46 | SKILL.md: height gauge in the example list | `git diff` shows SKILL.md | [x] |
| S47 | CHANGELOG: entry under Unreleased | `git diff` shows CHANGELOG | [x] |
| S48 | CI: add the height gauge to the build list | `git diff` shows the workflow | [x] |
| S49 | Final rebuild of both themes, commit the pages | `git status --short` clean after rebuild | [x] |
| S50 | Copy the example into `C:/Users/denni/.agents/skills/anatomy/examples/height-gauge/` | the installed skill has the folder | [x] |
| S51 | Push to the fork | explicit approval first | [x] |

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
- S17–S26 The carriage and the plunger: the carriage body with two raised lands and four
  countersunk screws, four shoes on the ways, the three standards 18, 14 and 10 mm, the index
  blade riding over the scale strip, the knurled knob on the west end, and the plunger with its
  anvil and its stem inside the case bore.
  The first run failed the depth order: the plunger and the arm interlocked, because the yoke
  prongs crossed the stem on screen while the arm's near face fell behind it. The fix was a cut,
  not a bias: the arm now stops at y=-10 and the prongs sit at x 5..8, so the plunger passes in
  front of the arm. `node examples/height-gauge/build.mjs --audit` printed `audit passed`
  (22 items, 41 solids).
- S27–S33 The live script: the carriage slides in x, the plunger rides a spring, the needle and
  the readout both read the model, the pointer steers, the arrow keys step between the stops, the
  idle tour cycles, reduced motion holds still and the loop stops offscreen.
  `node scripts/drive.mjs examples/height-gauge/height-gauge.html --actions tmp/drive-hg.json`
  printed `standard 2 · 14.0 mm` after ArrowLeft, `standard 1 · 18.0 mm` after Home, and
  `standard 2 · 14.0 mm` after a drag.
- S34–S35 The line-end check found ten ends in the air: the two major graduations on the dial
  were too long to count as marks, the name plate's rules floated, and the scale strip's major
  ticks stopped short. Fixed by an inner graduation circle on the dial, `free` on the name
  plate's rules, and a rule line on the scale strip that the major ticks land on.
  `node scripts/lines.mjs` printed `line ends: 0` for both pages.
- S36–S43 Captures read at desktop and 390 wide in both themes, and at 6× on the dial, 7× on the
  plunger and 5× on the yoke. The close-ups showed the anvil too narrow to read as a measuring
  pad, so it grew from 2.4 to 2.8, and the readout was taken from the carriage instead of the
  spring, so it now reads the height the needle points at.
- S44–S49 The README row, the README note on granularity, the SKILL.md example list, the
  CHANGELOG entry and the CI build step. The build is byte-identical on a rebuild.

## Log

- S0: plan written and re-cut into small tasks. Read the kit: `audit.mjs` exports and the
  `supports`, `coverage`, `depthOrder` rules; `lathe.mjs` exports; `line-ends.mjs` end rules;
  the CI build list; the house rules in CONTRIBUTING. The upstream `examples/dial-indicator` is
  the reference for the same prompt and for the ride-over idiom.
- S2–S11: `node examples/height-gauge/build.mjs --audit` printed `audit passed`.
- S12–S16: `node examples/height-gauge/build.mjs --audit` printed `audit passed`.
  `node scripts/capture.mjs examples/height-gauge/height-gauge.html --out shots/hg-02.png` and
  `--zoom 180,40,200,140 --zoom-scale 4` read the dial: the needle points at graduation 14.
- S17–S26: `node examples/height-gauge/build.mjs --audit` printed `audit passed`.
- S27–S49: the live script, the line-end check (`line ends: 0` on both pages), the captures and
  the documentation all landed. `node examples/height-gauge/build.mjs --audit` printed
  `audit passed` and the two built pages are byte-identical on a rebuild.
- S50: `diff -rq examples/height-gauge ~/.agents/skills/anatomy/examples/height-gauge` printed
  nothing (exit 0): the installed skill already held an identical copy of the example.
- S51: approved, `git push origin main` printed `1482e84..26f5525  main -> main`.
