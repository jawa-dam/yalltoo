# YallToo Visual Remix V2 — Regression Harness

Headless proof that the V2 visual remix does not change V1.63.30 protected logic.

The repository is otherwise **zero-dependency and static**: there is no build step, no
bundler and no test runner. This directory is the only Node code in the project, and it
is a test tool — it ships nothing to the browser.

## Run

```bash
cd tools/v2-regression
npm install
npm test          # 189 checks, exit 0 = all protected behaviour intact
```

`node_modules/` is gitignored. Nothing here is loaded by any page.

## What it proves

| Group | Checks |
|---|---|
| 1. Frozen contract | 27 localStorage keys, 59 CustomEvent names, 31 `window.GEI_*` singletons, 11 internal URLs, 117 external asset/link URLs, per-page asset lists, and the protected constants (`MAX_XP=666`, `XP_PER_OBJECTIVE=37`, `THRESHOLD=90`, `OBJECTIVES_REQUIRED=3`, `COST=666`, Level 1 band `62–78`) |
| 2. Boot | 8 globals present, 6 academy day cards, dam gate section, 5 nav items, no script fails to evaluate |
| 2b. Child-script injection | the four `loadChildScript` markers all produce an injected `<script>` whose attribute matches the de-duplication guard, the two mastery CSS links are injected, `adam-context.js` is not double-injected, re-init does not duplicate, and the three restored modules execute without throwing |
| 3. Progression | 0 XP / 0 days start state, Day 1 unlocked, Day 2 locked |
| 4. XP | 18 awards succeed, total exactly 666, `addXP` refuses past the cap |
| 5. Dam Gate | 6/6 recognised, eligible, auto-unlock, `OPEN THE DAM` revealed and enabled, ceremony dialog, 666 XP consumed, `geiDamGateV1.opened === true`, `xpConsumed === 666`, completion + mastery ledgers byte-identical after the transaction, success panel, one-time ceremony |
| 6. Badges | 12 definitions (6 mastery / 3 streak / 3 achievement), correct qualification, `blueprint-master` earned only while 6 days **and** 666 XP coexist, earnings survive the consumption |
| 7. Identity | Dam Name validation, 7 avatars, `adam` default, persistence |
| 8. Day pages | complete button stays disabled at 95 % audio / 0 objectives **and** at 80 % audio / 3 objectives; unlocks at 95 % + 3/3; writes `geiDayCompletionV1` with `audioPercent`; 37 XP reconcile through `geiObjectiveXPRewardsV1` |
| 9. Simulator Wall | locked panel + disabled `ENTER LEVEL 1` when the gate is closed; unlocked when `geiDamGateV1.opened === true`; 6 stages |
| 10. Level 1 | ±8 pressure step, 62–78 band enforcement both ways, +50 / +75 / +100, `3 / 3`, completion panel, `geiSimulatorScoreV1` = 225 at version `1.63.30`, score separate from Academy XP, navigation targets |
| 11. CSS | all 66 stylesheets parse (css-tree); every `v2-*.css` layer (design system + the six Phase 3-8 remix layers) carries no `font-size` under 12 px and no untokenised hex |
| 2c. Video Lab | the reflection / saved-notes UI mounts, and notes round-trip through `geiVideoLabIntelligenceV1` |
| 11b. Skin system | 6 skins registered, `gei-hydraulic` is the default, and all five saved legacy skins (`academic`, `pink`, `blue`, `green`, `dark`) are honoured rather than reset |
| 12. Runtime errors | no error beyond the one recorded baseline defect |

## Re-recording the contract

Only after an intentional, approved change to keys, events or URLs:

```bash
npm test -- --bless
```

## Known pre-existing defects in the V1.63.30 baseline

Recorded, **not** fixed — fixing them would restore behaviour and is out of scope for a
visual remix. Any *new* error fails the run.

**Fixed in V2.0.3** — `adam-milestones.js` `loadChildScript(src, marker)` used
`s.dataset["gei" + capitalize(marker)] = marker`. For `marker = "mastery-milestones"` that is
`dataset["geiMastery-milestones"]`; a hyphen is not a legal `DOMStringMap` property name, so
the setter threw `SyntaxError`, aborting the rest of `init()` and leaving
`adam-mastery-milestones.js`, `adam-mastery-celebration.js` and `adam-reward-unlock.js`
uninjected. It now uses `setAttribute("data-gei-" + marker, marker)`, which writes the exact
attribute the de-duplication guard already matches. See section 2b.

1. **`NotFoundError: The child can not be found in the parent`** — a `removeChild` /
   `insertBefore` against an already-detached node during the render fan-out. Owning module
   not yet identified.
2. **`profile.js` `render()` → `#gei-profile-percent` is null.** The profile card is intact
   at boot (verified: 1 card, `hasPercent=true`), so something later in the `gei:xp-updated`
   fan-out strips that node. Owning module not yet identified.

## Limits of this harness

jsdom executes the real scripts against a real DOM, but it does not lay out or paint. This
harness **cannot** verify visual appearance, mobile-width rendering, animation, focus rings,
tap-target feel or audio. There is no browser available in this environment.
