/* V1.12.5 — Deterministic Splash Startup Gate
 * Keeps the app shell visually locked behind the cinematic splash from first paint.
 * The existing splash controller remains the only owner of splash exit/timing.
 */
(function(){
  'use strict';
  function boot(){
    var phone=document.getElementById('app-phone');
    var splash=document.getElementById('gei-splash');
    if(!phone||!splash)return;
    var style=document.getElementById('geiSplashStartupGateV125')||document.createElement('style');
    style.id='geiSplashStartupGateV125';
    style.textContent=''+
      '.phone.splash-gated>.screen{visibility:hidden!important;opacity:0!important;pointer-events:none!important}'+
      '.phone.splash-gated>.screen:first-child{display:flex!important}'+
      '.phone.splash-gated #gei-splash{visibility:visible!important;opacity:1!important;display:flex!important;pointer-events:auto!important;position:absolute!important;inset:0!important;z-index:2147483647!important;background:#06070d!important}'+
      '.phone:not(.splash-gated).splash-done>.screen{visibility:visible!important;opacity:1!important}'+
      '.phone.splash-done #gei-splash{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important}';
    if(!style.parentNode)document.head.appendChild(style);
    phone.classList.add('splash-gated');
    splash.style.position='absolute';
    splash.style.inset='0';
    splash.style.width='100%';
    splash.style.height='100%';
    splash.style.zIndex='2147483647';
    splash.style.display='flex';
    splash.style.visibility='visible';
    splash.style.opacity='1';
    splash.style.pointerEvents='auto';
    splash.style.backgroundColor='#06070d';
    splash.style.backgroundImage='none';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
