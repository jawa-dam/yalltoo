/* V1.12.3 — Splash Opaque Layer
 * Ensures the cinematic splash is visually opaque above the app shell.
 * Keeps splash ownership with splash-images-v1.6.js and does not alter exit timing.
 */
(function(){
  'use strict';
  function boot(){
    var splash=document.getElementById('gei-splash');
    if(!splash)return;
    var style=document.createElement('style');
    style.id='geiSplashOpaqueV123';
    style.textContent=''+
      '#gei-splash{position:absolute!important;inset:0!important;z-index:100000!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;background:#06070d!important;isolation:isolate!important;overflow:hidden!important}'+
      '#gei-splash>.splash-bg,#gei-splash>.splash-rays,#gei-splash>.splash-glow,#gei-splash>.splash-core,#gei-splash>.splash-water,#gei-splash>.splash-ripple{z-index:0!important}'+
      '#gei-splash>.splash-copy,#gei-splash>.splash-hero,#gei-splash>.splash-loading,#gei-splash>.splash-status,#gei-splash>.splash-progress,#gei-splash>.splash-enter,#gei-splash>.splash-skip{position:relative!important;z-index:10!important}'+
      '#gei-splash::before{content:"";position:absolute;inset:0;background:#06070d;z-index:-1;pointer-events:none}'+
      '.phone.splash-done #gei-splash{display:none!important;visibility:hidden!important;pointer-events:none!important}'+
      '@media(prefers-reduced-motion:reduce){#gei-splash{animation:none!important}}';
    document.head.appendChild(style);
    splash.style.backgroundColor='#06070d';
    splash.style.backgroundImage='none';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
