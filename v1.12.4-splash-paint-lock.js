/* V1.12.4 — Splash Paint Lock
 * Prevents the dashboard from visually bleeding through the cinematic splash
 * during initial browser paint. The existing splash controller still owns exit.
 */
(function(){
  'use strict';
  function boot(){
    var splash=document.getElementById('gei-splash');
    var phone=document.getElementById('app-phone');
    if(!splash||!phone)return;
    var style=document.getElementById('geiSplashPaintLockV124')||document.createElement('style');
    style.id='geiSplashPaintLockV124';
    style.textContent=''+
      '#gei-splash{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483646!important;background:#06070d!important;isolation:isolate!important;overflow:hidden!important;}'+
      '#gei-splash::after{content:"";position:absolute;inset:0;background:#06070d;z-index:-1!important;pointer-events:none!important;}'+
      '.phone:not(.splash-done) #gei-splash{display:flex!important;visibility:visible!important;opacity:1!important;}'+
      '.phone.splash-done #gei-splash{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    if(!style.parentNode)document.head.appendChild(style);
    splash.style.position='absolute';
    splash.style.inset='0';
    splash.style.width='100%';
    splash.style.height='100%';
    splash.style.zIndex='2147483646';
    splash.style.display='flex';
    splash.style.visibility='visible';
    splash.style.opacity='1';
    splash.style.pointerEvents='auto';
    splash.style.backgroundColor='#06070d';
    phone.classList.add('splash-gated');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
