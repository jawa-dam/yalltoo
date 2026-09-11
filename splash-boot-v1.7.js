/* V1.7 — Splash Boot Recovery helper
 * Loaded inline by index.html when possible. Safe, self-contained, and
 * intentionally independent of the optional V1.6 asset helper.
 */
(function(){
  const FALLBACK='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif';
  const FALLBACKS=[
    FALLBACK,
    'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png',
    'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png'
  ];
  function q(id){return document.getElementById(id)}
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}
  ready(function(){
    const splash=q('gei-splash'),hero=q('splashHero'),status=q('splashStatus'),loading=q('splashLoading'),label=q('splashLoadingLabel'),progress=q('splashProgress'),skip=q('splashSkip'),enter=q('splashEnter'),phone=q('app-phone');
    if(!splash||!hero||!phone)return;
    let closed=false, started=performance.now();
    const set=(el,text)=>{if(el)el.textContent=text};
    const pct=n=>{if(progress)progress.style.width=Math.max(0,Math.min(100,n))+'%'};
    function close(){if(closed)return;closed=true;phone.classList.add('splash-done');setTimeout(()=>{try{splash.remove()}catch(_){ }},720)}
    if(skip)skip.addEventListener('click',close,{passive:true});
    if(enter)enter.addEventListener('click',close,{passive:true});
    window.addEventListener('keydown',function(e){if(e.key==='Escape'||e.key==='Enter'||e.key===' '){e.preventDefault();close()}},{passive:false});

    function load(url,timeout){return new Promise(resolve=>{let done=false;const t=setTimeout(()=>finish(false),timeout||5000);const img=new Image();function finish(ok){if(done)return;done=true;clearTimeout(t);resolve({ok,url,img})}img.onload=()=>finish(img.naturalWidth>0&&img.naturalHeight>0);img.onerror=()=>finish(false);img.src=url;if(img.complete&&img.naturalWidth>0)queueMicrotask(()=>finish(true))})}
    async function boot(){
      set(status,'Preparing cinematic image…');set(label,'LOADING SPLASH');pct(8);
      let pool=[];
      try{if(Array.isArray(window.GEI_V16_SPLASH_ASSETS))pool=window.GEI_V16_SPLASH_ASSETS.slice()}catch(_){ }
      if(!pool.length)pool=FALLBACKS.slice();
      const last=(()=>{try{return localStorage.getItem('gei_splash_last_asset_v1')||''}catch(_){return ''}})();
      const candidates=pool.filter(x=>x&&x!==last); const source=candidates.length?candidates:pool;
      const selected=source[Math.floor(Math.random()*source.length)]||FALLBACK;
      const result=await load(selected,6000);
      if(result.ok){hero.src=result.url;hero.classList.add('is-ready');try{localStorage.setItem('gei_splash_last_asset_v1',result.url)}catch(_){ }set(status,'Image ready — welcome to GEI.');set(label,'SPLASH READY');pct(100);}
      else {
        set(status,'Primary image unavailable — activating Adam.');set(label,'RECOVERING GATEWAY');pct(55);
        let fallbackResult=null;
        for(const url of FALLBACKS){fallbackResult=await load(url,3000);if(fallbackResult.ok)break}
        if(fallbackResult&&fallbackResult.ok){hero.src=fallbackResult.url;hero.classList.add('is-ready');set(status,'Adam verified — gateway ready.');set(label,'ADAM READY');pct(100)}
        else {hero.removeAttribute('src');set(status,'Visual unavailable — safe entry enabled.');set(label,'SAFE ENTRY');pct(100)}
      }
      if(loading)loading.hidden=true;
      const elapsed=performance.now()-started;setTimeout(close,Math.max(150,10000-elapsed));
    }
    try{boot()}catch(_){set(label,'SAFE ENTRY');pct(100);setTimeout(close,250)}
  });
})();
