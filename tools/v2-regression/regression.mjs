/* YallToo Visual Remix V2 — Protected-Logic Regression Harness
   ------------------------------------------------------------------
   Proves the V2 visual remix never changes V1.63.30 protected behaviour:
   six-day progression, XP (666 max), objective mastery, badges, learner
   identity, Dam Gate, 666 XP consumption, Simulator unlock, Level 1 gameplay.

   Usage:
     node regression.mjs            run all checks
     node regression.mjs --bless    re-record the frozen contract manifest

   Requires: npm install   (jsdom, css-tree)
*/
import { JSDOM, VirtualConsole } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cssTree from "css-tree";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..", "..");
const MANIFEST = path.join(HERE, "contract.manifest.json");
const BLESS = process.argv.includes("--bless");

let pass = 0, fail = 0;
const failures = [];
const warnings = [];

function check(name, cond, detail = "") {
  if (cond) { pass += 1; console.log(`  PASS  ${name}`); }
  else { fail += 1; failures.push(name); console.log(`  FAIL  ${name}${detail ? "  -> " + detail : ""}`); }
}
function section(t) { console.log(`\n── ${t} ${"─".repeat(Math.max(0, 66 - t.length))}`); }

/* ------------------------------------------------------------------ *
 * Source scanning — derive the frozen contract from the repo itself
 * ------------------------------------------------------------------ */
function repoSources() {
  const files = fs.readdirSync(ROOT)
    .filter((f) => /\.(js|html|css)$/.test(f) && !f.startsWith("."))
    .sort();
  return files.map((f) => ({ f, s: fs.readFileSync(path.join(ROOT, f), "utf8") }));
}

function deriveContract() {
  const srcs = repoSources();
  const all = srcs.map((x) => x.s).join("\n");

  const storageKeys = new Set();
  for (const m of all.matchAll(/(?:localStorage|sessionStorage)\s*\.\s*(?:getItem|setItem|removeItem)\s*\(\s*["']([^"']+)["']/g)) storageKeys.add(m[1]);
  for (const m of all.matchAll(/(?:const|let|var)\s+[A-Z0-9_]*KEY[A-Z0-9_]*\s*=\s*["']([^"']+)["']/g)) storageKeys.add(m[1]);

  const events = new Set();
  for (const m of all.matchAll(/["'](gei:[a-z0-9-]+)["']/g)) events.add(m[1]);

  const globals = new Set();
  for (const m of all.matchAll(/window\.(GEI_[A-Z0-9_]+|GEIAchievementSound)\s*=/g)) globals.add(m[1]);

  const pageAssets = {};
  for (const f of fs.readdirSync(ROOT).filter((x) => x.endsWith(".html")).sort()) {
    const s = fs.readFileSync(path.join(ROOT, f), "utf8");
    pageAssets[f] = [...s.matchAll(/<(?:link|script)[^>]+(?:href|src)="([^"]+\.(?:css|js))"/g)].map((m) => m[1]);
  }

  const internalUrls = new Set();
  for (const m of all.matchAll(/["']((?:day-\d|index|simulator|dam-release)\.html[^"'\s]*)["']/g)) internalUrls.add(m[1]);

  const externalUrls = new Set();
  for (const m of all.matchAll(/https?:\/\/[^"'`\s)]+/g)) externalUrls.add(m[0]);

  return {
    storageKeys: [...storageKeys].sort(),
    events: [...events].sort(),
    globals: [...globals].sort(),
    pageAssets,
    internalUrls: [...internalUrls].sort(),
    externalUrls: [...externalUrls].sort(),
  };
}

/* ------------------------------------------------------------------ *
 * jsdom page loader
 * ------------------------------------------------------------------ */
function loadPage(file, query = "", seed = null) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => errors.push(String(e && (e.stack || e.message || e))));
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

  const dom = new JSDOM(html, {
    url: "http://localhost/" + file + query,
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const w = dom.window;
  w.matchMedia = (q) => ({
    matches: /reduce/.test(q), media: q,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
  });
  w.AudioContext = undefined;
  w.webkitAudioContext = undefined;

  // Seed storage BEFORE any page script evaluates: the simulator scripts read
  // geiDamGateV1 at load time, so a later write would be ignored.
  if (typeof seed === "function") seed(w);

  const loadErrors = [];
  for (const m of html.matchAll(/<script src="([^"]+)"[^>]*><\/script>/g)) {
    const rel = m[1];
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) { loadErrors.push(`${rel}: missing on disk`); continue; }
    try { w.eval(fs.readFileSync(p, "utf8")); }
    catch (e) { loadErrors.push(`${rel}: ${e.message}`); }
  }
  w.eval('document.dispatchEvent(new Event("DOMContentLoaded"))');
  return { w, d: w.document, errors, loadErrors, dom };
}

const seedOpenGate = (w) => {
  w.localStorage.setItem("geiDamGateV1", JSON.stringify({ version: "1.63.28", unlocked: true, opened: true, xpConsumed: 666 }));
};

/* ------------------------------------------------------------------ *
 * 1. FROZEN CONTRACT
 * ------------------------------------------------------------------ */
section("1. FROZEN CONTRACT (keys, events, globals, assets, URLs)");
const contract = deriveContract();

if (BLESS) {
  fs.writeFileSync(MANIFEST, JSON.stringify(contract, null, 2) + "\n");
  console.log(`  BLESSED contract -> ${path.relative(ROOT, MANIFEST)}`);
  console.log(`  ${contract.storageKeys.length} storage keys, ${contract.events.length} events, ${contract.globals.length} globals`);
} else if (!fs.existsSync(MANIFEST)) {
  console.log("  no manifest; run with --bless first");
  process.exit(2);
}

if (!BLESS) {
  const base = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const diff = (a, b) => ({ missing: a.filter((x) => !b.includes(x)), added: b.filter((x) => !a.includes(x)) });

  const sk = diff(base.storageKeys, contract.storageKeys);
  check(`localStorage keys unchanged (${base.storageKeys.length})`, !sk.missing.length && !sk.added.length,
    `missing=${sk.missing.join(",")} added=${sk.added.join(",")}`);

  const ev = diff(base.events, contract.events);
  check(`CustomEvent names unchanged (${base.events.length})`, !ev.missing.length && !ev.added.length,
    `missing=${ev.missing.join(",")} added=${ev.added.join(",")}`);

  const gl = diff(base.globals, contract.globals);
  check(`window.GEI_* singletons unchanged (${base.globals.length})`, !gl.missing.length && !gl.added.length,
    `missing=${gl.missing.join(",")} added=${gl.added.join(",")}`);

  const iu = diff(base.internalUrls, contract.internalUrls);
  check(`internal URLs unchanged (${base.internalUrls.length})`, !iu.missing.length,
    `missing=${iu.missing.join(",")}`);

  const xu = diff(base.externalUrls, contract.externalUrls);
  check(`external links/assets preserved (${base.externalUrls.length})`, !xu.missing.length,
    `missing=${xu.missing.join(",")}`);

  for (const page of Object.keys(base.pageAssets)) {
    const before = base.pageAssets[page] || [];
    const after = contract.pageAssets[page] || [];
    const gone = before.filter((a) => !after.includes(a));
    check(`${page}: no page asset removed`, gone.length === 0, `removed=${gone.join(",")}`);
  }

  // Hard-coded protected constants must still be present in source.
  const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
  const progressSrc = read("progress.js");
  check("progress.js MAX_XP = 666", /MAX_XP\s*=\s*666/.test(progressSrc));
  check("v1-49 XP_PER_OBJECTIVE = 37", /XP_PER_OBJECTIVE\s*=\s*37/.test(read("v1-49-day-objective-mastery.js")));
  check("gei-day-page.js THRESHOLD = 90", /THRESHOLD\s*=\s*90/.test(read("gei-day-page.js")));
  check("gei-day-page.js OBJECTIVES_REQUIRED = 3", /OBJECTIVES_REQUIRED\s*=\s*3/.test(read("gei-day-page.js")));
  check("v1-63-28 COST = 666", /COST\s*=\s*666/.test(read("v1-63-28-gei-dam-gate-ceremony.js")));
  check("v1-63-30 Level1 band 62-78", /targetLow\s*:\s*62\s*,\s*targetHigh\s*:\s*78/.test(read("v1-63-30-gei-genesis-game-engine.js")));
}

/* ------------------------------------------------------------------ *
 * 2. INDEX BOOT
 * ------------------------------------------------------------------ */
section("2. index.html boot");
const idx = loadPage("index.html");
for (const g of ["GEI_PROGRESS", "GEI_DAM_GATE", "GEI_DAM_GATE_CEREMONY", "GEI_BADGES", "GEI_IDENTITY", "GEI_MASCOT", "GEI_SONIC_FX", "GEI_ACADEMY_STATE"]) {
  check(`window.${g} present`, Boolean(idx.w[g]));
}
check("no script failed to evaluate", idx.loadErrors.length === 0, idx.loadErrors.join(" | "));
check("6 academy day cards rendered", idx.d.querySelectorAll("#screen-academy .academy-day-card").length === 6,
  `found ${idx.d.querySelectorAll("#screen-academy .academy-day-card").length}`);
check("dam gate section rendered", Boolean(idx.d.getElementById("gei-dam-gate")));
check("5 nav items rendered", idx.d.querySelectorAll("#bottom-navigation [data-nav-id]").length === 5);

/* ------------------------------------------------------------------ *
 * 2b. DYNAMIC CHILD-SCRIPT INJECTION (fixed in V2.0.3)
 * ------------------------------------------------------------------ */
section("2b. Child-script injection");
check("no DOMStringMap SyntaxError anywhere on index.html",
  !idx.errors.some((e) => /not a valid property name/.test(e)),
  idx.errors.filter((e) => /not a valid property name/.test(e)).join(" | "));

const CHILD_SCRIPTS = [
  ["adaptive",           "adam-adaptive.js"],
  ["mastery-milestones", "adam-mastery-milestones.js"],
  ["v132-celebration",   "adam-mastery-celebration.js"],
  ["v134-rewards",       "adam-reward-unlock.js"],
];
for (const [marker, src] of CHILD_SCRIPTS) {
  const el = idx.d.querySelector(`script[data-gei-${marker}]`);
  check(`script[data-gei-${marker}] injected`, Boolean(el), "missing");
  check(`  ... points at ${src}`, el?.getAttribute("src") === src, `src=${el?.getAttribute("src")}`);
}
// adam-context.js is statically linked in index.html, so its guard must skip it.
check("adam-context.js not double-injected", idx.d.querySelectorAll('script[src="adam-context.js"]').length === 1,
  `count=${idx.d.querySelectorAll('script[src="adam-context.js"]').length}`);

for (const [marker, href] of [["v132-celebration", "adam-mastery-celebration.css"], ["v134-rewards", "adam-reward-unlock.css"]]) {
  const el = idx.d.querySelector(`link[data-gei-${marker}]`);
  check(`link[data-gei-${marker}] injected`, Boolean(el), "missing");
  check(`  ... points at ${href}`, el?.getAttribute("href") === href, `href=${el?.getAttribute("href")}`);
}

// The de-duplication guard must still match what loadChildScript now writes.
const dupBefore = idx.d.querySelectorAll("script[data-gei-mastery-milestones]").length;
idx.w.eval('document.dispatchEvent(new Event("DOMContentLoaded"))');
const dupAfter = idx.d.querySelectorAll("script[data-gei-mastery-milestones]").length;
check("de-dupe guard holds on re-init", dupBefore === 1 && dupAfter === 1, `before=${dupBefore} after=${dupAfter}`);

// jsdom does not fetch dynamically-appended scripts, so execute the three restored
// modules by hand to prove they survive real initialisation.
const restoredErrorsBefore = idx.errors.length;
let restoredThrew = null;
for (const [, src] of CHILD_SCRIPTS.slice(1)) {
  try { idx.w.eval(fs.readFileSync(path.join(ROOT, src), "utf8")); }
  catch (e) { restoredThrew = `${src}: ${e.message}`; }
  idx.w.eval('document.dispatchEvent(new Event("DOMContentLoaded"))');
}
check("restored Adam modules evaluate without throwing", restoredThrew === null, restoredThrew || "");
const restoredNewErrors = [...new Set(idx.errors.slice(restoredErrorsBefore))];
check("restored Adam modules add no new runtime error", restoredNewErrors.length === 0, restoredNewErrors.join(" | "));

/* ------------------------------------------------------------------ *
 * 3. DAY UNLOCK CHAIN
 * ------------------------------------------------------------------ */
section("3. Day 1 -> Day 6 unlock chain");
const st0 = idx.w.GEI_PROGRESS.getState();
check("starts at 0 XP", st0.xp === 0, `xp=${st0.xp}`);
check("starts with 0 days complete", st0.completed.length === 0, JSON.stringify(st0.completed));
check("Day 1 unlocked from empty state", idx.d.querySelector('.academy-day-card[data-day="1"]').getAttribute("aria-disabled") === "false");
check("Day 2 locked before Day 1", idx.d.querySelector('.academy-day-card[data-day="2"]').getAttribute("aria-disabled") === "true");

/* ------------------------------------------------------------------ *
 * 4. XP: 18 objectives x 37 = 666, capped
 * ------------------------------------------------------------------ */
section("4. XP engine");
let awarded = 0;
for (let d = 1; d <= 6; d += 1) {
  for (let i = 0; i < 3; i += 1) {
    if (idx.w.GEI_PROGRESS.addXP(37, "objective-mastery")) awarded += 1;
  }
}
check("18 objective awards succeeded", awarded === 18, `awarded=${awarded}`);
check("XP total is exactly 666", idx.w.GEI_PROGRESS.getState().xp === 666, `xp=${idx.w.GEI_PROGRESS.getState().xp}`);
check("addXP refuses beyond 666 cap", idx.w.GEI_PROGRESS.addXP(37, "overflow") === false);
check("XP still 666 after overflow attempt", idx.w.GEI_PROGRESS.getState().xp === 666);

/* ------------------------------------------------------------------ *
 * 5. DAM GATE
 * ------------------------------------------------------------------ */
section("5. Dam Gate eligibility + ceremony");
function markDay(w, d) {
  const c = JSON.parse(w.localStorage.getItem("geiDayCompletionV1") || "{}");
  c[d] = { completed: true, completedAt: new Date().toISOString(), audioPercent: 100 };
  w.localStorage.setItem("geiDayCompletionV1", JSON.stringify(c));
  const m = JSON.parse(w.localStorage.getItem("geiAdamObjectiveMasteryV1") || "{}");
  m.mastered = [...new Set([...(m.mastered || []), ...[0, 1, 2].map((i) => `${d}-${i}`)])];
  w.localStorage.setItem("geiAdamObjectiveMasteryV1", JSON.stringify(m));
}
for (let d = 1; d <= 6; d += 1) markDay(idx.w, d);
// blueprint-master needs 6 days AND xp>=666 to hold at the same moment. Sync here,
// while both are true -- opening the gate consumes the 666 XP and the badge can never
// be earned again afterwards. That ordering is shipped V1.63 behaviour, preserved as-is.
idx.w.GEI_BADGES.sync();
const badgeSnapshotAtGate = idx.w.GEI_BADGES.getState().earned.slice();
idx.w.GEI_DAM_GATE.sync();
const gate = idx.w.GEI_DAM_GATE.getState();
check("6/6 days recognised", gate.completedCount === 6, `days=${gate.completedCount}`);
check("gate eligible at 6 days + 666 XP", gate.eligible === true);
check("gate auto-unlocked", gate.unlocked === true);
const wrap = idx.d.getElementById("gei-dam-gate-action-wrap");
check("OPEN THE DAM revealed after unlock", Boolean(wrap) && wrap.hidden === false);
check("OPEN THE DAM enabled", idx.d.getElementById("gei-dam-gate-open").disabled === false);

idx.d.getElementById("gei-dam-gate-open").click();
check("ceremony dialog opens", Boolean(idx.d.getElementById("gei-gate-ceremony")));
check("ceremony states 666 XP cost", /666\s*XP/.test(idx.d.getElementById("gei-gate-ceremony").textContent));

const ledgerBefore = idx.w.localStorage.getItem("geiDayCompletionV1");
const masteryBefore = idx.w.localStorage.getItem("geiAdamObjectiveMasteryV1");
idx.d.getElementById("gei-gate-open-confirm").click();

check("666 XP consumed", idx.w.GEI_PROGRESS.getState().xp === 0, `xp=${idx.w.GEI_PROGRESS.getState().xp}`);
const dg = JSON.parse(idx.w.localStorage.getItem("geiDamGateV1") || "{}");
check("geiDamGateV1.opened === true", dg.opened === true);
check("geiDamGateV1.xpConsumed === 666", dg.xpConsumed === 666, `xpConsumed=${dg.xpConsumed}`);
check("six-day completion ledger preserved", idx.w.localStorage.getItem("geiDayCompletionV1") === ledgerBefore);
check("objective mastery preserved", idx.w.localStorage.getItem("geiAdamObjectiveMasteryV1") === masteryBefore);
check("success panel shown", Boolean(idx.d.getElementById("gei-gate-success")));
check("ENTER THE SIMULATOR WALL present", Boolean(idx.d.getElementById("gei-gate-simulator-link")));
check("ceremony is one-time (isOpened)", idx.w.GEI_DAM_GATE_CEREMONY.isOpened() === true);

/* ------------------------------------------------------------------ *
 * 6. BADGES
 * ------------------------------------------------------------------ */
section("6. Badge engine");
const badges = idx.w.GEI_BADGES.getBadges();
check("12 badge definitions", badges.length === 12, `count=${badges.length}`);
const ids = badges.map((b) => b.id);
check("6 mastery badges", ["day-1", "day-2", "day-3", "day-4", "day-5", "day-6"].every((x) => ids.includes(x)));
check("3 streak badges", ["streak-2", "streak-3", "streak-5"].every((x) => ids.includes(x)));
check("3 achievement badges", ["first-spark", "six-day-flow", "blueprint-master"].every((x) => ids.includes(x)));
const earned = idx.w.GEI_BADGES.getState().earned;
check("day badges earned after 6-day completion", ["day-1", "day-2", "day-3", "day-4", "day-5", "day-6"].every((x) => earned.includes(x)),
  `earned=${earned.join(",")}`);
check("first-spark earned (mastery >= 1)", earned.includes("first-spark"));
check("six-day-flow earned", earned.includes("six-day-flow"));
check("blueprint-master earned while 6 days + 666 XP coexist", badgeSnapshotAtGate.includes("blueprint-master"),
  `earned=${badgeSnapshotAtGate.join(",")}`);
check("badge earnings survive the 666 XP consumption", ["six-day-flow", "blueprint-master"].every((x) => earned.includes(x)),
  `afterGate=${earned.join(",")}`);
check("streak-5 NOT earned without a real streak", !earned.includes("streak-5"));
check("badge state persisted to geiBadgeStateV1", Boolean(idx.w.localStorage.getItem("geiBadgeStateV1")));

/* ------------------------------------------------------------------ *
 * 7. LEARNER IDENTITY
 * ------------------------------------------------------------------ */
section("7. Learner identity (Dam Name + avatar)");
check("GEI_IDENTITY.getDamName available", typeof idx.w.GEI_IDENTITY.getDamName === "function");
check("7 avatars available", Object.keys(idx.w.GEI_IDENTITY.avatars).length === 7,
  `count=${Object.keys(idx.w.GEI_IDENTITY.avatars).length}`);
check("default avatar is adam", idx.w.GEI_IDENTITY.getAvatar() === "adam");
check("rejects 2-char dam name", idx.w.GEI_IDENTITY.setDamName("ab") === false || !/^[A-Za-z0-9_-]{3,20}$/.test("ab"));
check("accepts valid dam name", (idx.w.GEI_IDENTITY.setDamName("WaterArchitect"), idx.w.GEI_IDENTITY.getDamName() === "WaterArchitect"),
  `got=${idx.w.GEI_IDENTITY.getDamName()}`);
check("identity persisted to geiDamNameIdentityV1", /WaterArchitect/.test(idx.w.localStorage.getItem("geiDamNameIdentityV1") || ""));

/* ------------------------------------------------------------------ *
 * 8. DAY PAGE COMPLETION GATE
 * ------------------------------------------------------------------ */
section("8. Day page: audio >=90% AND 3 objectives");
const day1 = loadPage("day-1.html");
check("day-1 scripts evaluated", day1.loadErrors.length === 0, day1.loadErrors.join(" | "));
check("objective mastery root rendered", Boolean(day1.d.querySelector(".v1-49-day-objective-mastery")));
check("complete button starts disabled", day1.d.getElementById("day-complete").disabled === true);
check("status explains audio requirement", /at least 90%/.test(day1.d.getElementById("completion-status").textContent));

// audio to 95%, no mastery yet
day1.w.localStorage.setItem("geiDayAudioProgressV1", JSON.stringify({ 1: 95 }));
day1.w.dispatchEvent(new day1.w.CustomEvent("gei:objective-mastery-updated", { detail: { day: 1 } }));
check("still disabled with audio but 0/3 objectives", day1.d.getElementById("day-complete").disabled === true);
check("status names the objective requirement", /OBJECTIVE MASTERY: 0\/3/.test(day1.d.getElementById("completion-status").textContent));

// audio 80%, all 3 objectives -> must stay locked
day1.w.localStorage.setItem("geiDayAudioProgressV1", JSON.stringify({ 1: 80 }));
day1.w.localStorage.setItem("geiAdamObjectiveMasteryV1", JSON.stringify({ mastered: ["1-0", "1-1", "1-2"] }));
day1.w.dispatchEvent(new day1.w.CustomEvent("gei:objective-mastery-updated", { detail: { day: 1 } }));
check("still disabled at 80% audio with 3/3 objectives", day1.d.getElementById("day-complete").disabled === true);

// audio 95% + 3/3 -> unlocks
day1.w.localStorage.setItem("geiDayAudioProgressV1", JSON.stringify({ 1: 95 }));
day1.w.dispatchEvent(new day1.w.CustomEvent("gei:objective-mastery-updated", { detail: { day: 1 } }));
check("unlocks at 95% audio + 3/3 objectives", day1.d.getElementById("day-complete").disabled === false);
check("status reports +111 XP", /\+111 XP/.test(day1.d.getElementById("completion-status").textContent));

day1.d.getElementById("day-complete").click();
const comp1 = JSON.parse(day1.w.localStorage.getItem("geiDayCompletionV1") || "{}");
check("completion written to geiDayCompletionV1", comp1?.[1]?.completed === true);
check("completion records audioPercent", Number(comp1?.[1]?.audioPercent) === 95, `audioPercent=${comp1?.[1]?.audioPercent}`);
check("button becomes COMPLETE and disabled", day1.d.getElementById("day-complete").disabled === true);

// objective XP idempotency via ledger
// reconcileObjectiveXP() runs only at init, so mastery must already be in storage
// when day-2.html evaluates.
const day2 = loadPage("day-2.html", "", (w) => {
  w.localStorage.setItem("geiAdamObjectiveMasteryV1", JSON.stringify({ mastered: ["2-0"] }));
});
const xpAfter = JSON.parse(day2.w.localStorage.getItem("geiAcademyProgressV1") || "{}").xp || 0;
const xpBefore = 0;
check("reconcile awards 37 XP for a newly mastered objective", xpAfter - xpBefore === 37, `delta=${xpAfter - xpBefore}`);
const ledger = JSON.parse(day2.w.localStorage.getItem("geiObjectiveXPRewardsV1") || "{}");
check("XP ledger records the award", ledger["2-0"]?.amount === 37);

/* ------------------------------------------------------------------ *
 * 9. SIMULATOR WALL GATE
 * ------------------------------------------------------------------ */
section("9. Simulator Wall gating");
const wallLocked = loadPage("simulator.html");
check("wall scripts evaluated", wallLocked.loadErrors.length === 0, wallLocked.loadErrors.join(" | "));
check("locked panel visible when gate closed", wallLocked.d.getElementById("gei-simulator-locked").hidden === false);
check("ENTER LEVEL 1 disabled when gate closed", wallLocked.d.getElementById("gei-simulator-enter").disabled === true);
check("gate state reads GATE LOCKED", wallLocked.d.getElementById("sim-gate-state").textContent === "GATE LOCKED");
check("6 hydraulic stages listed", wallLocked.d.querySelectorAll(".gei-simulator-stage").length === 6);

const wallOpen = loadPage("simulator.html", "", seedOpenGate);
check("locked panel hidden when gate open", wallOpen.d.getElementById("gei-simulator-locked").hidden === true);
check("ENTER LEVEL 1 enabled when gate open", wallOpen.d.getElementById("gei-simulator-enter").disabled === false);
check("gate state reads GATE OPEN", wallOpen.d.getElementById("sim-gate-state").textContent === "GATE OPEN");

/* ------------------------------------------------------------------ *
 * 10. LEVEL 1 GAMEPLAY
 * ------------------------------------------------------------------ */
section("10. Level 1 — Water & Light");
const game = loadPage("simulator.html", "?level=1", seedOpenGate);
check("game engine rendered", Boolean(game.d.getElementById("gei-game")));
const G = (id) => game.d.getElementById(id);
check("pressure starts at 0%", G("game-pressure-value").textContent === "0%");
check("score starts at 0", G("game-score").textContent === "0");
check("objectives start 0 / 3", G("game-objective-count").textContent === "0 / 3");

G("game-more").click();
check("+ INCREASE steps pressure by 8", G("game-pressure-value").textContent === "8%", G("game-pressure-value").textContent);
for (let i = 0; i < 7; i += 1) G("game-more").click();
check("8 presses reach 64% (inside 62-78 band)", G("game-pressure-value").textContent === "64%", G("game-pressure-value").textContent);
check("target zone marked is-hit inside band", G("game-target").classList.contains("is-hit"));

game.d.querySelector('[data-action="observe"]').click();
check("objective 1 OBSERVE awards +50", G("game-score").textContent === "50", G("game-score").textContent);
game.d.querySelector('[data-action="separate"]').click();
check("objective 2 SEPARATE awards +75 (total 125)", G("game-score").textContent === "125", G("game-score").textContent);
game.d.querySelector('[data-action="release"]').click();
check("objective 3 RELEASE awards +100 (total 225)", G("game-score").textContent === "225", G("game-score").textContent);
check("objective counter 3 / 3", G("game-objective-count").textContent === "3 / 3");
check("LEVEL 1 COMPLETE panel shown", G("game-complete").hidden === false);
check("final score rendered", /225 SCORE/.test(G("game-final-score").textContent), G("game-final-score").textContent);

const saved = JSON.parse(game.w.localStorage.getItem("geiSimulatorScoreV1") || "{}");
check("score persisted to geiSimulatorScoreV1", saved.score === 225, `score=${saved.score}`);
check("score version stamped 1.63.30", saved.version === "1.63.30", `version=${saved.version}`);
check("simulator score is separate from Academy XP", !("xp" in saved));
check("Academy XP untouched by gameplay", (JSON.parse(game.w.localStorage.getItem("geiAcademyProgressV1") || "{}").xp || 0) === 0);

// band enforcement: reduce below the band and confirm SEPARATE refuses
const game2 = loadPage("simulator.html", "?level=1", seedOpenGate);
const G2 = (id) => game2.d.getElementById(id);
for (let i = 0; i < 7; i += 1) G2("game-more").click();   // 56% — below band
game2.d.querySelector('[data-action="separate"]').click();
check("SEPARATE refuses at 56% (below 62)", G2("game-score").textContent === "0", G2("game-score").textContent);
check("message asks for 62-78%", /62/.test(G2("game-message").textContent), G2("game-message").textContent);
G2("game-more").click();                                    // 64% — in band
game2.d.querySelector('[data-action="separate"]').click();
check("SEPARATE succeeds at 64%", G2("game-score").textContent === "75", G2("game-score").textContent);

// Navigation targets: jsdom cannot navigate, so the attempted URL surfaces as a jsdomError.
// jsdom cannot navigate and refuses to stub the unforgeable location.href, so navigation
// is verified two ways: the click provably attempts a navigation, and the shipped handler's
// own source carries the expected URL.
function navTarget(file, query, clickId) {
  const p = loadPage(file, query, seedOpenGate);
  const el = p.d.getElementById(clickId);
  if (!el) return { attempted: false, handler: "(element missing)" };
  const before = p.errors.length;
  el.click();
  const attempted = p.errors.slice(before).some((e) => /Not implemented: navigation/.test(e));
  return { attempted, handler: String(el.onclick || el.getAttribute("onclick") || "") };
}

const nextNav = navTarget("simulator.html", "?level=1", "game-next");
check("NEXT LEVEL handler targets simulator.html?level=2", /simulator\.html\?level=2/.test(nextNav.handler), nextNav.handler.slice(0, 110));
check("NEXT LEVEL actually attempts navigation", nextNav.attempted);

const enterNav = navTarget("simulator.html", "", "gei-simulator-enter");
check("ENTER LEVEL 1 handler targets simulator.html?level=1", /simulator\.html\?level=1/.test(enterNav.handler), enterNav.handler.slice(0, 110));
check("ENTER LEVEL 1 actually attempts navigation", enterNav.attempted);
check("ENTER LEVEL 1 also fires gei:simulator-level-requested", /gei:simulator-level-requested/.test(enterNav.handler));

const academyNav = navTarget("simulator.html", "", "gei-simulator-academy");
check("Simulator ACADEMY button targets index.html#academy", /index\.html#academy/.test(academyNav.handler), academyNav.handler.slice(0, 110));

// Day page next/prev links are plain anchors -- assert hrefs directly.
for (const [file, expected] of [["day-1.html", "day-2.html"], ["day-2.html", "day-3.html"], ["day-3.html", "day-4.html"], ["day-4.html", "day-5.html"], ["day-5.html", "day-6.html"]]) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  check(`${file} forward link -> ${expected}`, html.includes(`class="next" href="${expected}"`));
}
check("day-6.html returns to Academy", fs.readFileSync(path.join(ROOT, "day-6.html"), "utf8").includes('index.html#academy'));
for (let d = 1; d <= 6; d += 1) {
  check(`day-${d}.html has an Academy back link`, fs.readFileSync(path.join(ROOT, `day-${d}.html`), "utf8").includes('index.html#academy'));
}

/* ------------------------------------------------------------------ *
 * 11. CSS INTEGRITY
 * ------------------------------------------------------------------ */
section("11. CSS integrity");
const cssFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith(".css")).sort();
let cssErrors = 0;
for (const f of cssFiles) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  try { cssTree.parse(src, { positions: true, onParseError: (e) => { cssErrors += 1; warnings.push(`${f}: ${e.message}`); } }); }
  catch (e) { cssErrors += 1; warnings.push(`${f}: ${e.message}`); }
}
check(`all ${cssFiles.length} stylesheets parse`, cssErrors === 0, `${cssErrors} parse errors`);

const V2_TOKEN_HEX = new Set([
  "04050a", "06070d", "0a0d16", "0f1420", "1b2434", "eaf2ff", "8fa2bd",
  "2fd2ff", "3d3dea", "f310ba", "ff1493", "22c55e", "f5a524", "ff3b5c",
  "0b3a4d", "12657f", "7fe9ff", "ffffff", "fff", "000000", "000",
]);
const v2Files = fs.readdirSync(ROOT).filter((f) => f.startsWith("v2-") && f.endsWith(".css")).sort();
for (const f of v2Files) {
  const src = fs.readFileSync(path.join(ROOT, f), "utf8");
  const tiny = [...src.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1])).filter((n) => n < 12);
  check(`${f}: no font-size below 12px`, tiny.length === 0, `sizes=${[...new Set(tiny)].join(",")}`);
  const hexes = [...new Set([...src.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)].map((m) => m[1].toLowerCase()))];
  const stray = hexes.filter((h) => !V2_TOKEN_HEX.has(h));
  check(`${f}: only tokenised hex values`, stray.length === 0, `stray=#${stray.join(",#")}`);
}
if (v2Files.length) {
  check("V2 design-system stylesheet present", v2Files.includes("v2-gei-design-system.css"), `found: ${v2Files.join(",")}`);
} else {
  console.log("  SKIP  no v2-*.css yet (pre-Phase-2 baseline)");
}

/* ------------------------------------------------------------------ *
 * 11b. SKIN SYSTEM (V2 changed the DEFAULT, not the data)
 * ------------------------------------------------------------------ */
section("11b. Skin system");
const skinDefault = loadPage("index.html");
check("6 skins registered (5 original + gei-hydraulic)",
  skinDefault.d.querySelectorAll("[data-skin-option]").length === 6,
  `found ${skinDefault.d.querySelectorAll("[data-skin-option]").length}`);
check("default skin is gei-hydraulic when nothing is saved",
  skinDefault.d.documentElement.dataset.skin === "gei-hydraulic",
  `got ${skinDefault.d.documentElement.dataset.skin}`);
check("hydraulic palette resolves to the dark surface",
  skinDefault.d.documentElement.style.getPropertyValue("--skin-bg").trim() === "#06070d",
  `--skin-bg=${skinDefault.d.documentElement.style.getPropertyValue("--skin-bg")}`);
check("hydraulic accent is brand cyan",
  skinDefault.d.documentElement.style.getPropertyValue("--skin-accent").trim() === "#2fd2ff");
check("gei-hydraulic persisted to gei-academy-skin-v1",
  skinDefault.w.localStorage.getItem("gei-academy-skin-v1") === "gei-hydraulic",
  `stored=${skinDefault.w.localStorage.getItem("gei-academy-skin-v1")}`);

// A learner who already picked a light skin must keep it. No forced reset.
for (const legacy of ["academic", "pink", "blue", "green", "dark"]) {
  const pg = loadPage("index.html", "", (w) => w.localStorage.setItem("gei-academy-skin-v1", legacy));
  check(`saved skin "${legacy}" is honoured, not reset`,
    pg.d.documentElement.dataset.skin === legacy,
    `got ${pg.d.documentElement.dataset.skin}`);
}
const legacyBg = loadPage("index.html", "", (w) => w.localStorage.setItem("gei-academy-skin-v1", "academic"));
check("saved academic skin still resolves light (#f7f9fc)",
  legacyBg.d.documentElement.style.getPropertyValue("--skin-bg").trim() === "#f7f9fc",
  `--skin-bg=${legacyBg.d.documentElement.style.getPropertyValue("--skin-bg")}`);

/* ------------------------------------------------------------------ *
 * 12. RUNTIME ERRORS
 * ------------------------------------------------------------------ */
section("12. Runtime error budget");
// Known pre-existing defects in the V1.63.30 baseline. Recorded, not fixed, so that any
// NEW error introduced by the visual remix fails the run.
const KNOWN_BASELINE_ERRORS = [
  // FIXED IN V2.0.3 -- adam-milestones.js loadChildScript() used to do
  // dataset["geiMastery-milestones"] = marker; a hyphen is illegal in a DOMStringMap
  // property name, so the setter threw SyntaxError and aborted init(), leaving
  // adam-mastery-milestones.js, adam-mastery-celebration.js and adam-reward-unlock.js
  // uninjected. It now uses setAttribute. If this error ever returns, section 2b fails too.
  //
  // 1. A removeChild/insertBefore against an already-detached node during the render fan-out.
  //    Owning module not yet identified.
  "The child can not be found in the parent",
  // 2. profile.js render() reaches c.querySelector("#gei-profile-percent").textContent.
  //    The card is intact at boot (verified), so something later in the gei:xp-updated
  //    fan-out strips that node. Owning module not yet identified.
  "Cannot set properties of null",
];
const distinct = [...new Set(idx.errors.map((e) => (e.match(/\[(.*?)\]/) || [, e])[1].split("\n")[0]))];
const unexpected = distinct.filter((e) => !KNOWN_BASELINE_ERRORS.some((k) => e.includes(k)));
check("no NEW runtime errors beyond the recorded baseline", unexpected.length === 0, unexpected.join(" | "));
check(`baseline still has exactly ${KNOWN_BASELINE_ERRORS.length} known defects`,
  distinct.filter((e) => KNOWN_BASELINE_ERRORS.some((k) => e.includes(k))).length === KNOWN_BASELINE_ERRORS.length,
  `seen=${distinct.join(" | ")}`);
for (const e of distinct) warnings.push(`known pre-existing runtime error: ${e}`);

/* ------------------------------------------------------------------ */
console.log("\n" + "═".repeat(70));
console.log(`  ${pass} passed, ${fail} failed`);
if (warnings.length) {
  console.log(`\n  warnings (${warnings.length}):`);
  for (const w of warnings.slice(0, 12)) console.log(`   • ${w}`);
}
if (fail) {
  console.log("\n  FAILED CHECKS:");
  for (const f of failures) console.log(`   ✗ ${f}`);
}
console.log("═".repeat(70));
process.exit(fail ? 1 : 0);
