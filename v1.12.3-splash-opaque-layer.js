/* V1.12.3 — Splash Opaque Layer
 * Ensures the cinematic splash is visually opaque above the app shell.
 * Keeps splash ownership with splash-images-v1.6.js and does not alter exit timing.
 *
 * V1.12.4 hardening:
 * The splash must fully cover the app before the browser paints the dashboard,
 * while remaining dismissible by the existing splash controller.
 */
(function(){
  'use strict';
  function boot(){
    var splash=document.getElementById('gei-splash');
    if(!splash)return;
    var style=document.getElementById('geiSplashOpaqueV123')||document.createElement('style');
    style.id='geiSplashOpaqueV123';
    style.textContent=''+
      '#gei-splash{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:100000!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;background:#06070d!important;isolation:isolate!important;overflow:hidden!important}'+
      '#gei-splash>.splash-bg{position:absolute!important;inset:0!important;z-index:0!important;background:radial-gradient(circle at 50% 45%,#213f79 0%,#101735 48%,#06070d 100%)!important;opacity:1!important}'+
      '#gei-splash>.splash-rays,#gei-splash>.splash-glow,#gei-splash>.splash-core,#gei-splash>.splash-water,#gei-splash>.splash-ripple{z-index:1!important}'+
      '#gei-splash>.splash-copy,#gei-splash>.splash-hero,#gei-splash>.splash-loading,#gei-splash>.splash-status,#gei-splash>.splash-progress,#gei-splash>.splash-enter,#gei-splash>.splash-skip{position:absolute!important;z-index:10!important}'+
      '#gei-splash>.splash-copy{top:14%!important;left:0!important;right:0!important}'+
      '#gei-splash>.splash-hero{left:50%!important;top:38%!important;transform:translateX(-50%)!important}'+
      '#gei-splash>.splash-loading{left:0!important;right:0!important;bottom:17%!important}'+
      '#gei-splash>.splash-status{left:0!important;right:0!important;bottom:13.5%!important}'+
      '#gei-splash>.splash-progress{left:15%!important;right:15%!important;bottom:10.5%!important}'+
      '#gei-splash>.splash-enter{left:50%!important;bottom:3.6%!important;transform:translateX(-50%)!important}'+
      '#gei-splash>.splash-skip{right:18px!important;bottom:4.2%!important}'+
      '.phone.splash-done #gei-splash{display:none!important;visibility:hidden!important;pointer-events:none!important;opacity:0!important}'+
      '@media(prefers-reduced-motion:reduce){#gei-splash{animation:none!important}}';
    if(!style.parentNode)document.head.appendChild(style);
    splash.style.backgroundColor='#06070d';
    splash.style.backgroundImage='none';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
