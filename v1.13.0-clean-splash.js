/* V1.13.0 — Clean Splash Foundation
 * Single responsibility: boot the cinematic splash, load one artwork asset,
 * provide Enter / Skip / keyboard / timeout exit, then reveal the app shell.
 * No navigation ownership. No Music Lab ownership. No startup validation layer.
 */
(function(){
  'use strict';
  var FALLBACK='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif';
  var EXIT_MS=10000;
  function boot(){
    var phone=document.getElementById('app-phone');
    var splash=document.getElementById('gei-splash');
    var hero=document.getElementById('splashHero');
    var enter=document.getElementById('splashEnter');
    var skip=document.getElementById('splashSkip');
    if(!phone||!splash||phone.dataset.geiCleanSplash==='1')return;
    phone.dataset.geiCleanSplash='1';
    var style=document.getElementById('geiCleanSplashV130')||document.createElement('style');
    style.id='geiCleanSplashV130';
    style.textContent=''+
      '#app-phone:not(.splash-done)> .screen{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}'+
      '#app-phone:not(.splash-done)> #gei-splash{display:flex!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:2147483647!important;background:#06070d!important;background-color:#06070d!important;}'+
      '#app-phone.splash-done> .screen{visibility:visible!important;opacity:1!important;}'+
      '#app-phone.splash-done> #gei-splash{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;}';
    if(!style.parentNode)document.head.appendChild(style);
    var closed=false;
    function close(){
      if(closed)return;
      closed=true;
      phone.classList.add('splash-done');
      splash.setAttribute('aria-hidden','true');
    }
    splash.setAttribute('aria-hidden','false');
    [enter,skip].forEach(function(button){
      if(!button)return;
      button.hidden=false;
      button.style.pointerEvents='auto';
      button.onclick=close;
    });
    document.addEventListener('keydown',function(e){
      if(closed)return;
      if(e.key==='Escape'||e.key==='Enter'||e.key===' '){
        e.preventDefault();
        close();
      }
    },true);
    setTimeout(close,EXIT_MS);
    var pool=(window.GEI_V16_SPLASH_ASSETS&&window.GEI_V16_SPLASH_ASSETS.length)?window.GEI_V16_SPLASH_ASSETS.slice():[FALLBACK];
    var chosen=FALLBACK;
    try{
      chosen=(window.GEI_V16_SPLASH_ROTATION&&window.GEI_V16_SPLASH_ROTATION.select(pool))||pool[Math.floor(Math.random()*pool.length)]||FALLBACK;
    }catch(_){chosen=pool[Math.floor(Math.random()*pool.length)]||FALLBACK;}
    function show(url){
      if(!hero||!url)return;
      hero.src=url;
      hero.style.opacity='1';
      hero.classList.add('is-ready');
    }
    if(hero){
      var img=new Image();
      img.onload=function(){
        if(img.naturalWidth>0&&img.naturalHeight>0){
          show(chosen);
          try{if(window.GEI_V16_SPLASH_ROTATION)window.GEI_V16_SPLASH_ROTATION.commit(chosen);}catch(_){ }
        }else show(FALLBACK);
      };
      img.onerror=function(){show(FALLBACK);};
      img.src=chosen;
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
