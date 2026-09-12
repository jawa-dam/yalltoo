/* V1.12.5 — Splash/App Sequencing Lock
 * The splash is the first visual state. The app shell remains hidden until
 * the existing splash controller marks the phone as splash-done.
 */
(function(){
  'use strict';

  function boot(){
    var splash=document.getElementById('gei-splash');
    var phone=document.getElementById('app-phone');
    if(!splash||!phone)return;

    var style=document.getElementById('geiSplashPaintLockV125')||document.createElement('style');
    style.id='geiSplashPaintLockV125';
    style.textContent=''+
      '#app-phone:not(.splash-done)>.screen{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}'+
      '#app-phone.splash-done>.screen{visibility:visible!important;opacity:1!important;}'+
      '#gei-splash{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;z-index:2147483647!important;background:#06070d!important;background-color:#06070d!important;isolation:isolate!important;overflow:hidden!important;}'+
      '#gei-splash::before{content:"";position:absolute;inset:0;background:#06070d;z-index:0!important;pointer-events:none!important;}'+
      '#gei-splash>.splash-bg{z-index:1!important;opacity:1!important;}'+
      '#gei-splash>.splash-rays,#gei-splash>.splash-glow,#gei-splash>.splash-core,#gei-splash>.splash-water,#gei-splash>.splash-ripple,#gei-splash>.splash-copy{z-index:2!important;}'+
      '#gei-splash>.splash-hero{z-index:3!important;}'+
      '#app-phone.splash-done>#gei-splash{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
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
    splash.style.background='#06070d';
    splash.style.backgroundColor='#06070d';
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
