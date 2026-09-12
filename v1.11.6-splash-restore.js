/* V1.11.6 — Splash Restore
 * Restores the GEI cinematic splash as the startup gateway without replacing
 * the current application architecture. Uses the existing V1.6 asset pool.
 */
(function(){
  'use strict';
  var FALLBACK='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-beaver-rhhiVplt1GMykxV8.png';
  var DURATION=10000;
  function boot(){
    var phone=document.getElementById('app-phone');
    var splash=document.getElementById('gei-splash');
    if(!phone||!splash)return;
    if(phone.dataset.geiSplashRestore==='1')return;
    try{phone.dataset.geiSplashRestore='1'}catch(e){}
    var hero=document.getElementById('splashHero'),enter=document.getElementById('splashEnter'),skip=document.getElementById('splashSkip'),status=document.getElementById('splashStatus'),progress=document.getElementById('splashProgress'),loading=document.getElementById('splashLoadingLabel'),closed=false;
    function close(){if(closed)return;closed=true;phone.classList.add('splash-done');if(progress)progress.style.width='100%';}
    [enter,skip].forEach(function(button){if(!button)return;button.hidden=false;button.style.pointerEvents='auto';button.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();close();},true);});
    document.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key==='Escape'||e.key===' '){e.preventDefault();close();}},true);
    var pool=(window.GEI_V16_SPLASH_ASSETS&&window.GEI_V16_SPLASH_ASSETS.length)?Array.from(window.GEI_V16_SPLASH_ASSETS):[FALLBACK],chosen='';
    try{chosen=(window.GEI_V16_SPLASH_ROTATION&&window.GEI_V16_SPLASH_ROTATION.select)?window.GEI_V16_SPLASH_ROTATION.select(pool):pool[Math.floor(Math.random()*pool.length)];}catch(e){chosen=pool[Math.floor(Math.random()*pool.length)];}
    chosen=chosen||FALLBACK;
    function show(src){if(!hero)return;hero.src=src;hero.classList.add('is-ready');hero.style.opacity='1';}
    function preload(url,done){var img=new Image(),settled=false,timer=setTimeout(function(){if(settled)return;settled=true;done(false);},3000);img.onload=function(){if(settled)return;settled=true;clearTimeout(timer);done(!!img.naturalWidth&&!!img.naturalHeight);};img.onerror=function(){if(settled)return;settled=true;clearTimeout(timer);done(false);};img.src=url;}
    if(status)status.textContent='Preparing cinematic asset…';
    if(loading)loading.textContent='PREPARING INTERPRETATIONS';
    if(progress)progress.style.width='8%';
    preload(chosen,function(ok){if(ok){show(chosen);try{if(window.GEI_V16_SPLASH_ROTATION)window.GEI_V16_SPLASH_ROTATION.commit(chosen);}catch(e){}if(status)status.textContent='Gateway ready.';if(progress)progress.style.width='100%';}else{show(FALLBACK);if(status)status.textContent='Using resilient fallback.';if(progress)progress.style.width='100%';}});
    var start=Date.now(),tick=setInterval(function(){if(closed){clearInterval(tick);return;}var elapsed=Date.now()-start,pct=Math.min(100,Math.round((elapsed/DURATION)*100));if(progress)progress.style.width=pct+'%';if(elapsed>=DURATION){clearInterval(tick);close();}},100);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
