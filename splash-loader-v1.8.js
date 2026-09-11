/* V1.8 — Emergency splash loader / hard recovery */
(function(){
  'use strict';
  var FALLBACK='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif';
  var IMAGES=['https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png','https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png','https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-starts-here-orQtAS63EOlGh6HB.png','https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-the-mountain-7zeFS6ZCAEhfcma0.png'];
  function boot(){
    var splash=document.getElementById('gei-splash');
    var hero=document.getElementById('splashHero');
    var skip=document.getElementById('splashSkip');
    var enter=document.getElementById('splashEnter');
    var phone=document.getElementById('app-phone');
    if(!splash||!phone)return;
    var closed=false;
    function close(){if(closed)return;closed=true;phone.classList.add('splash-done');}
    [skip,enter].forEach(function(el){if(el){el.hidden=false;el.style.pointerEvents='auto';el.addEventListener('click',close);}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter'||e.key===' '){close();}},true);
    function show(url){if(!hero)return;hero.src=url;hero.classList.add('is-ready');hero.style.opacity='1';}
    var pool=(window.GEI_V16_SPLASH_ASSETS&&window.GEI_V16_SPLASH_ASSETS.length?window.GEI_V16_SPLASH_ASSETS:IMAGES).slice();
    var chosen=pool[Math.floor(Math.random()*pool.length)]||FALLBACK;
    var img=new Image();var done=false;
    function finish(ok){if(done)return;done=true;if(ok){show(chosen);}else{show(FALLBACK);}setTimeout(close,10000);}
    img.onload=function(){finish(img.naturalWidth>0&&img.naturalHeight>0);};img.onerror=function(){finish(false);};
    img.src=chosen;
    setTimeout(function(){if(!done)finish(false);},3200);
    setTimeout(function(){if(!closed)close();},10500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
