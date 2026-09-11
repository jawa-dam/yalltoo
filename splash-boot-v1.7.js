/* V1.7 — Splash Boot Recovery helper */
(function(){
  'use strict';
  var FALLBACK='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif';
  var FALLBACKS=[FALLBACK,'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png','https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png'];
  var splash=document.getElementById('gei-splash'),hero=document.getElementById('splashHero'),skip=document.getElementById('splashSkip'),enter=document.getElementById('splashEnter'),phone=document.getElementById('app-phone'),status=document.getElementById('splashStatus'),label=document.getElementById('splashLoadingLabel'),loading=document.getElementById('splashLoading'),progress=document.getElementById('splashProgress');
  if(!splash||!hero||!skip||!phone)return;
  var closed=false,started=Date.now();
  function text(el,v){if(el)el.textContent=v} function pct(v){if(progress)progress.style.width=Math.max(0,Math.min(100,v))+'%'}
  function closeSplash(){if(closed)return;closed=true;phone.classList.add('splash-done')}
  skip.addEventListener('click',closeSplash);if(enter)enter.addEventListener('click',closeSplash);
  window.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key==='Escape'||e.key===' '){e.preventDefault();closeSplash()}},{passive:false});
  function preload(url,timeout){return new Promise(function(resolve){var img=new Image(),done=false,t=setTimeout(function(){finish(false)},timeout||5000);function finish(ok){if(done)return;done=true;clearTimeout(t);resolve(ok)}img.onload=function(){finish(img.naturalWidth>0&&img.naturalHeight>0)};img.onerror=function(){finish(false)};img.src=url})}
  function choose(pool){var last='';try{last=localStorage.getItem('gei_splash_last_asset_v1')||''}catch(_){ }var list=pool.filter(function(x){return x&&x!==last});if(!list.length)list=pool;return list[Math.floor(Math.random()*list.length)]||FALLBACK}
  async function boot(){
    var pool=Array.isArray(window.GEI_V16_SPLASH_ASSETS)&&window.GEI_V16_SPLASH_ASSETS.length?window.GEI_V16_SPLASH_ASSETS.slice():[FALLBACK];
    var selected=choose(pool);text(label,'LOADING SPLASH');text(status,'Loading cinematic image…');pct(10);
    var ok=await preload(selected,5500);
    if(ok){hero.src=selected;hero.classList.add('is-ready');try{localStorage.setItem('gei_splash_last_asset_v1',selected)}catch(_){ }text(label,'SPLASH READY');text(status,'Image ready — welcome to GEI.');pct(100)}
    else{text(label,'RECOVERING GATEWAY');text(status,'Primary image unavailable — activating Adam.');pct(55);var fallbackOk=false;for(var i=0;i<FALLBACKS.length;i++){fallbackOk=await preload(FALLBACKS[i],3000);if(fallbackOk){hero.src=FALLBACKS[i];hero.classList.add('is-ready');break}}if(fallbackOk){text(label,'ADAM READY');text(status,'Adam verified — gateway ready.')}else{text(label,'SAFE ENTRY');text(status,'Visual unavailable — safe entry enabled.')}pct(100)}
    if(loading)loading.hidden=true;setTimeout(closeSplash,Math.max(250,10000-(Date.now()-started)));
  }
  boot().catch(function(){text(label,'SAFE ENTRY');text(status,'Safe entry enabled.');pct(100);if(loading)loading.hidden=true;setTimeout(closeSplash,250)});
})();
