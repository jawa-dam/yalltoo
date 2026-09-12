/* V1.13.0 — Clean Splash Foundation
 * One controller. One startup gate. One exit state.
 * The splash is expected to be present in index.html before app screens.
 */
(function(){
  'use strict';
  var FALLBACK='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif';
  function boot(){
    var phone=document.getElementById('app-phone');
    var splash=document.getElementById('gei-splash');
    var hero=document.getElementById('splashHero');
    var enter=document.getElementById('splashEnter');
    var skip=document.getElementById('splashSkip');
    if(!phone||!splash)return;
    if(phone.dataset.geiCleanSplash==='1')return;
    phone.dataset.geiCleanSplash='1';

    var style=document.createElement('style');
    style.id='geiCleanSplashV130';
    style.textContent=''+
      '#app-phone:not(.splash-done)> .screen{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}'+
      '#app-phone:not(.splash-done)> #gei-splash{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:2147483647!important;background:#06070d!important;}'+
      '#app-phone.splash-done> .screen{visibility:visible!important;opacity:1!important;}'+
      '#app-phone.splash-done> #gei-splash{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    document.head.appendChild(style);

    var closed=false;
    function close(){
      if(closed)return;
      closed=true;
      phone.classList.add('splash-done');
      splash.setAttribute('aria-hidden','true');
    }
    [enter,skip].forEach(function(button){
      if(!button)return;
      button.hidden=false;
      button.style.pointerEvents='auto';
      button.addEventListener('click',close,{once:true});
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'||e.key==='Enter'||e.key===' '){e.preventDefault();close();}
    },true);
    setTimeout(close,10000);

    var pool=(window.GEI_V16_SPLASH_ASSETS&&window.GEI_V16_SPLASH_ASSETS.length)?window.GEI_V16_SPLASH_ASSETS.slice():[FALLBACK];
    var chosen=pool[Math.floor(Math.random()*pool.length)]||FALLBACK;
    if(hero){
      var img=new Image();
      img.onload=function(){hero.src=chosen;hero.classList.add('is-ready');hero.style.opacity='1';};
      img.onerror=function(){hero.src=FALLBACK;hero.classList.add('is-ready');hero.style.opacity='1';};
      img.src=chosen;
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
