/* V2.3 — Apply the learner's chosen Academy skin on standalone pages (Day
   lessons) before first paint. Read-only: the skin is chosen in the Academy. */
(function () {
  try {
    var id = window.localStorage.getItem("gei-academy-skin-v1");
    if (/^(gei-hydraulic|academic|pink|blue|green|dark)$/.test(id || "")) {
      document.documentElement.setAttribute("data-skin", id);
    }
  } catch (e) { /* storage unavailable: page stays on GEI Hydraulic */ }
})();
