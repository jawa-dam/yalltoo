/* V1.12.3 — Splash Opaque Layer
 * Ensures the cinematic splash fully covers the app shell.
 * Keeps splash ownership with splash-images-v1.6.js and does not alter exit timing.
 */
(function(){
  'use strict';
  function boot(){
    var splash=document.getElementById('gei-splash');
    var phone=document.getElementById('app-phone');
    if(!splash||!phone)return;
    var style=document.getElementById('geiSplashOpaqueV123')||document.createElement('style');
    style.id='geiSplashOpaqueV123';
    style.textContent=''+
      '#gei-splash{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:2147483000!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;background:#06070d!important;isolation:isolate!important;overflow:hidden!important;}'+
      '#gei-splash::before{content:"";position:absolute;inset:0;background:#06070d;z-index:0!important;pointer-events:none!important;}'+
      '#gei-splash>.splash-bg,#gei-splash>.splash-rays,#gei-splash>.splash-glow,#gei-splash>.splash-core,#gei-splash>.splash-water,#gei-splash>.splash-ripple{z-index:1!important;}'+
      '#gei-splash>.splash-copy,#gei-splash>.splash-hero,#gei-splash>.splash-loading,#gei-splash>.splash-status,#gei-splash>.splash-progress,#gei-splash>.splash-enter,#gei-splash>.splash-skip{position:relative!important;z-index:20!important;}'+
      '#gei-splash>.splash-hero{pointer-events:none!important;}'+
      '.phone.splash-done #gei-splash{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    if(!style.parentNode)document.head.appendChild(style);
    splash.style.position='absolute';
    splash.style.inset='0';
    splash.style.width='100%';
    splash.style.height='100%';
    splash.style.zIndex='2147483000';
    splash.style.display='flex';
    splash.style.visibility='visible';
    splash.style.opacity='1';
    splash.style.pointerEvents='auto';
    splash.style.backgroundColor='#06070d';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
