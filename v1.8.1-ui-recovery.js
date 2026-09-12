/* V1.8.1 — UI Interaction Recovery + YallToo Brand Layer
 * Defensive runtime loaded after the existing dashboard markup.
 * Restores navigation, skins, splash effects, and official YallToo branding
 * without replacing the existing app shell.
 *
 * V1.8.4 — Research Portfolio Intelligence & Live Verification
 * Adds defensive catalog validation and honest best-effort external reachability state.
 */
(function(){
  'use strict';
  function boot(){
    var body=document.body;
    var phone=document.getElementById('app-phone');
    if(!body||!phone)return;

    var LOGO='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-logo-vq2GKHxbTzr7g8bO.png';
    var logoCss=document.createElement('style');
    logoCss.textContent=''+
      '.gei-yalltoo-logo{display:block;width:min(210px,58vw);height:auto;max-height:76px;object-fit:contain;margin:0 auto 10px;filter:drop-shadow(0 8px 18px rgba(0,0,0,.28));animation:geiLogoFloat 3.2s ease-in-out infinite;position:relative;z-index:6}'+
      '.gei-yalltoo-logo.splash{width:min(240px,64vw);max-height:84px;margin:0 auto 8px}'+
      '.banner .gei-yalltoo-logo{margin:0 auto 8px}'+
      '@keyframes geiLogoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}'+
      '@media(prefers-reduced-motion:reduce){.gei-yalltoo-logo{animation:none!important}}';
    document.head.appendChild(logoCss);
    function addLogo(container,extra){
      if(!container||container.querySelector('.gei-yalltoo-logo'))return;
      var img=document.createElement('img');
      img.className='gei-yalltoo-logo'+(extra?' '+extra:'');
      img.src=LOGO; img.alt='YallToo'; img.decoding='async'; img.loading='eager';
      container.insertBefore(img,container.firstChild);
    }
    addLogo(document.querySelector('.splash-copy'),'splash');
    addLogo(document.querySelector('#screen-menu .banner'));
    addLogo(document.querySelector('#screen-portfolio .banner'));
    addLogo(document.querySelector('#screen-support .banner'));

    function applyTheme(name){
      var valid={regular:1,dark:1,hotpink:1,babyblue:1};
      var theme=valid[name]?name:'regular';
      body.setAttribute('data-theme',theme);
      try{localStorage.setItem('gei_theme_v1',theme)}catch(e){}
      document.querySelectorAll('.skin-dot').forEach(function(dot){dot.classList.toggle('is-active',dot.getAttribute('data-theme')===theme)});
    }
    var saved='regular';
    try{saved=localStorage.getItem('gei_theme_v1')||'regular'}catch(e){}
    applyTheme(saved);
    document.querySelectorAll('.skin-dot').forEach(function(dot){
      dot.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();applyTheme(dot.getAttribute('data-theme'));},true);
    });

    function show(which){
      var target=document.getElementById('screen-'+which);
      if(!target)return;
      document.querySelectorAll('.screen').forEach(function(screen){screen.classList.add('off-right');screen.classList.remove('off-left')});
      target.classList.remove('off-right');
      document.querySelectorAll('.nav').forEach(function(nav){
        nav.classList.remove('on-menu','on-portfolio','on-support');
        if(which==='menu')nav.classList.add('on-menu');
        if(which==='portfolio')nav.classList.add('on-portfolio');
        if(which==='support')nav.classList.add('on-support');
      });
    }
    function bindNav(selector,which){
      document.querySelectorAll(selector).forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();show(which);},true)});
    }
    bindNav('.menu-item','menu'); bindNav('.portfolio-item','portfolio'); bindNav('.support-item','support');
    document.querySelectorAll('[data-back]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();show(el.getAttribute('data-back')||'dash');},true)});

    function bindAccordion(){
      document.querySelectorAll('.acc-trigger').forEach(function(trigger){
        if(trigger.dataset.geiAccordionBound==='1')return;
        trigger.dataset.geiAccordionBound='1';
        trigger.addEventListener('click',function(e){
          e.preventDefault(); e.stopImmediatePropagation();
          var item=trigger.closest('.acc-item'); if(!item)return;
          var open=item.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded',String(open));
        },true);
      });
    }
    bindAccordion();

    var portfolioData=[
      {n:'01',title:'Decoding the Creation Story as an Antediluvian Hydraulic Blueprint',summary:'Presents the Genesis creation story as an antediluvian hydraulic blueprint and develops the project’s core engineering interpretation.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5622371'},
      {n:'02',title:'Genesis Engineered – The Dam and Mill Blueprint Revealed',summary:'Details the proposed dam-and-mill architecture at the center of Genesis Engineered, linking textual imagery to water storage, controlled release, and mechanical work.',source:'YallToo / Paper',kind:'yalltoo',label:'Read on Zenodo ↗',url:'https://zenodo.org/records/17316846'},
      {n:'03',title:'Decoding Genesis through Literary Mechanics',summary:'Examines Genesis through literary structure, sequence, repetition, and mechanics as evidence within the proposed interpretive method.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5792302'},
      {n:'04',title:'A Methodological Framework for Decoding Ancient Sacred Texts as Technical Manuals',summary:'Sets out a methodological framework for testing whether ancient sacred texts can be read as technical or procedural documentation.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789382'},
      {n:'05',title:'Reconstructing an Antediluvian Mill and Power-Generation System from Genesis 1 Symbolism',summary:'Reconstructs a proposed antediluvian mill and power-generation system from the symbolic language and sequence of Genesis 1.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789342'},
      {n:'06',title:'Symbolic Hydrology: Reclassifying Biblical Characters as Natural and Mechanical Elements in a Proto-Engineering System',summary:'Reclassifies selected biblical characters as symbolic natural forces or mechanical elements within the proposed proto-engineering system.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789322'},
      {n:'07',title:'The Semicolon in Genesis 1:1–2: A Linguistic Marker of Hydraulic Sequencing in Ancient Symbolic Notation',summary:'Focuses on the semicolon in Genesis 1:1–2 and proposes a linguistic-sequencing interpretation for the punctuation’s role in the project.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789263'},
      {n:'08',title:'The Firmament as a Hydraulic Partition Wall: Reinterpreting Genesis 1:6–8 Through Antediluvian Water Engineering',summary:'Interprets the firmament of Genesis 1:6–8 as a hydraulic partition wall within the proposed antediluvian water-engineering model.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789102'},
      {n:'09',title:'Badal, “Raqia,” and “Miqveh”: Water Control Terminology in the Hebrew of Genesis 1',summary:'Studies the Hebrew terms badal, raqia, and miqveh in relation to the project’s water-control vocabulary and Genesis 1 terminology.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6077590'},
      {n:'10',title:'A Systems-Oriented Interpretation of Water, Storage, and Flow Terminology in Genesis 1',summary:'Presents a systems-oriented reading of Genesis 1 vocabulary involving water, storage, separation, and flow.',source:'Zenodo',kind:'zenodo',label:'Read on Zenodo ↗',url:'https://zenodo.org/records/18269802'},
      {n:'11',title:'Genesis Engineered – The Dam and Mill Blueprint Revealed • YallToo.com',summary:'YallToo.com presentation and publication home for the Dam and Mill Blueprint concept within the Genesis Engineered project.',source:'YallToo.com',kind:'yalltoo',label:'Open YallToo.com ↗',url:'https://www.yalltoo.com/'},
      {n:'12',title:'Genesis Engineered – The Dam and Mill Blueprint Revealed • Zenodo',summary:'Zenodo record for the same Dam and Mill Blueprint publication, retained as a separate canonical repository entry rather than duplicated as a second research work.',source:'Zenodo',kind:'zenodo',label:'Open Zenodo ↗',url:'https://zenodo.org/records/17316846'}
    ];
    function renderPortfolioItem(item){
      var wrap=document.createElement('div'); wrap.className='acc-item';
      wrap.innerHTML='<button class="acc-trigger" type="button" aria-expanded="false"><span class="acc-index">'+item.n+'</span><span class="acc-title">'+item.title+'</span><svg class="acc-chev" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="acc-panel"><p class="paper-summary">'+item.summary+'</p><div class="paper-meta"><span class="source-tag '+item.kind+'">'+item.source+'</span><a class="read-link '+(item.kind==='yalltoo'?'yalltoo':'')+'" href="'+item.url+'" target="_blank" rel="noopener">'+item.label+'</a></div></div>';
      return wrap;
    }
    function ensurePortfolio(){
      var list=document.querySelector('.portfolio-accordion'); if(!list)return;
      var expectedUrls=portfolioData.map(function(x){return x.url});
      var urls=new Set(Array.from(list.querySelectorAll('.read-link')).map(function(a){return a.getAttribute('href')}));
      var valid=list.querySelectorAll('.acc-item').length===portfolioData.length&&expectedUrls.every(function(url){return urls.has(url)});
      if(!valid){
        list.innerHTML='';
        var frag=document.createDocumentFragment();
        portfolioData.forEach(function(item){frag.appendChild(renderPortfolioItem(item));});
        list.appendChild(frag);
      }
      bindAccordion();
      var count=document.querySelector('.research-count'); if(count)count.textContent=portfolioData.length+' entries';
      var note=document.querySelector('.portfolio-note'); if(note)note.textContent=portfolioData.length+' entries • one entry per publication or official destination.';
      var banner=document.querySelector('#screen-portfolio .badge'); if(banner)banner.innerHTML='<span class="dot"></span>SSRN • Zenodo • YallToo • portfolio ready';
    }
    ensurePortfolio();
    window.setTimeout(ensurePortfolio,250);

    /* ----- V1.8.5 — Research Portfolio Command Center ----- */
    var centerCss=document.createElement('style');
    centerCss.textContent=''+
      '.gei-research-center{display:flex;flex-direction:column;gap:8px;margin:0 0 8px}'+
      '.gei-research-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}'+
      '.gei-research-stat{border:1px solid var(--line);background:var(--surface);border-radius:12px;padding:7px 5px;text-align:center;min-width:0;box-shadow:0 2px 8px rgba(0,0,0,.04)}'+
      '.gei-research-stat strong{display:block;font-family:"Space Grotesk",sans-serif;font-size:1rem;line-height:1;color:var(--indigo)}'+
      '.gei-research-stat span{display:block;margin-top:3px;font-size:.53rem;color:var(--grey);font-weight:700;letter-spacing:.03em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
      '.gei-research-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap}'+
      '.gei-research-filter{border:1px solid var(--line);background:var(--surface);color:var(--grey);border-radius:999px;padding:5px 9px;font-size:.58rem;font-weight:800;letter-spacing:.03em;cursor:pointer;touch-action:manipulation}'+
      '.gei-research-filter.is-active{background:linear-gradient(135deg,var(--indigo),var(--cyan));border-color:transparent;color:#fff}'+
      '.gei-research-health{margin-left:auto;font-size:.57rem;color:var(--grey);font-weight:700;white-space:nowrap}'+
      '.gei-research-health b{color:var(--indigo)}'+
      '.gei-research-timeline{display:flex;align-items:center;gap:5px;overflow-x:auto;scrollbar-width:none;padding:1px 0 2px}'+
      '.gei-research-timeline::-webkit-scrollbar{display:none}'+
      '.gei-timeline-dot{flex:0 0 auto;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--indigo),var(--cyan));color:#fff;font-size:.5rem;font-weight:800;border:0;cursor:pointer}'+
      '.gei-timeline-line{flex:0 0 8px;height:2px;background:var(--line)}'+
      '.gei-research-detail{display:none;border:1px solid var(--line);border-radius:12px;padding:9px;background:var(--surface)}'+
      '.gei-research-detail.is-open{display:block}'+
      '.gei-research-detail h3{font-family:"Space Grotesk",sans-serif;font-size:.74rem;line-height:1.2;margin:0 0 5px}'+
      '.gei-research-detail p{font-size:.62rem;line-height:1.35;color:var(--grey);margin:0 0 6px}'+
      '.gei-research-detail .meta{font-size:.57rem;color:var(--grey);font-weight:700}'+
      '@media(max-width:350px){.gei-research-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.gei-research-health{width:100%;margin-left:0}}';
    document.head.appendChild(centerCss);

    function buildResearchCenter(){
      var bodyEl=document.querySelector('#screen-portfolio .portfolio-body');
      var list=document.querySelector('#screen-portfolio .portfolio-accordion');
      if(!bodyEl||!list||document.getElementById('geiResearchCenter'))return;
      var center=document.createElement('div'); center.id='geiResearchCenter'; center.className='gei-research-center';
      center.innerHTML='<div class="gei-research-stats">'+
        '<div class="gei-research-stat"><strong>12</strong><span>Cataloged</span></div>'+
        '<div class="gei-research-stat"><strong>8</strong><span>SSRN</span></div>'+ 
        '<div class="gei-research-stat"><strong>2</strong><span>Zenodo</span></div>'+ 
        '<div class="gei-research-stat"><strong>1</strong><span>YallToo</span></div>'+ 
        '</div><div class="gei-research-tools"><button type="button" class="gei-research-filter is-active" data-filter="all">ALL</button><button type="button" class="gei-research-filter" data-filter="ssrn">SSRN</button><button type="button" class="gei-research-filter" data-filter="zenodo">ZENODO</button><button type="button" class="gei-research-filter" data-filter="yalltoo">YALLTOO</button><span class="gei-research-health">Catalog <b id="geiResearchHealth">12/12</b></span></div><div class="gei-research-timeline" id="geiResearchTimeline"></div><div class="gei-research-detail" id="geiResearchDetail"></div>';
      bodyEl.insertBefore(center,list);

      var timeline=document.getElementById('geiResearchTimeline');
      portfolioData.forEach(function(item,index){
        if(index>0){var line=document.createElement('span');line.className='gei-timeline-line';timeline.appendChild(line)}
        var dot=document.createElement('button');dot.type='button';dot.className='gei-timeline-dot';dot.textContent=item.n;dot.setAttribute('aria-label','Research entry '+item.n);dot.dataset.index=String(index);
        dot.addEventListener('click',function(){
          var data=portfolioData[Number(dot.dataset.index)];
          var detail=document.getElementById('geiResearchDetail');
          if(!detail)return;
          detail.innerHTML='<h3>'+data.n+' — '+data.title+'</h3><p>'+data.summary+'</p><div class="meta">Source: '+data.source+' • <a href="'+data.url+'" target="_blank" rel="noopener">Open destination ↗</a></div>';
          detail.classList.add('is-open');
          list.querySelectorAll('.acc-item').forEach(function(row){row.style.display='';});
          var target=list.querySelectorAll('.acc-item')[Number(dot.dataset.index)];
          if(target){target.scrollIntoView({block:'nearest'});target.classList.add('is-open');var trigger=target.querySelector('.acc-trigger');if(trigger)trigger.setAttribute('aria-expanded','true')}
        });
        timeline.appendChild(dot);
      });

      center.querySelectorAll('.gei-research-filter').forEach(function(btn){
        btn.addEventListener('click',function(){
          center.querySelectorAll('.gei-research-filter').forEach(function(b){b.classList.toggle('is-active',b===btn)});
          var filter=btn.dataset.filter;
          list.querySelectorAll('.acc-item').forEach(function(row){
            var tag=row.querySelector('.source-tag');
            var kind=tag?(tag.classList.contains('ssrn')?'ssrn':tag.classList.contains('zenodo')?'zenodo':tag.classList.contains('yalltoo')?'yalltoo':''):'');
            row.style.display=(filter==='all'||kind===filter)?'':'none';
          });
        });
      });
    }
    buildResearchCenter();

    var verificationData=portfolioData.map(function(item){return {url:item.url,kind:item.kind,title:item.title};});
    function verifyExternalLink(item,done){
      var img=new Image(); var settled=false;
      function finish(status){if(settled)return;settled=true;done(status)}
      var timer=window.setTimeout(function(){finish('unreachable')},4500);
      img.onload=function(){window.clearTimeout(timer);finish('reachable')};
      img.onerror=function(){window.clearTimeout(timer);finish('unverified')};
      img.referrerPolicy='no-referrer';
      if(/^https?:\/\//i.test(item.url)&&!/^https?:\/\/(?:www\.)?yalltoo\.com\/?$/i.test(item.url))img.src=item.url;
      else{window.clearTimeout(timer);finish('deferred')}
    }
    function runPortfolioVerification(){
      var banner=document.querySelector('#screen-portfolio .badge'); if(!banner)return;
      var checked=0,reachable=0,unverified=0,deferred=0,started=Date.now();
      function update(){
        checked++;
        if(checked<verificationData.length)return;
        var statusEl=document.getElementById('geiResearchHealth');
        var confirmed=reachable;
        if(statusEl)statusEl.textContent='12/12 cataloged • '+confirmed+' confirmed';
        var elapsed=((Date.now()-started)/1000).toFixed(1);
        banner.innerHTML='<span class="dot"></span>12 entries • '+confirmed+' confirmed • '+(unverified+deferred)+' not auto-confirmed • '+elapsed+'s';
        banner.title='Verification is best-effort: external repositories may block browser probes, so unconfirmed does not mean broken.';
      }
      verificationData.forEach(function(item){
        verifyExternalLink(item,function(status){
          if(status==='reachable')reachable++;
          else if(status==='deferred')deferred++;
          else unverified++;
          update();
        });
      });
      try{sessionStorage.setItem('gei_portfolio_last_verified',new Date().toISOString())}catch(e){}
    }
    function lazyVerify(){
      var last=''; try{last=sessionStorage.getItem('gei_portfolio_last_verified')||''}catch(e){}
      var age=last?(Date.now()-Date.parse(last)):Infinity;
      if(!isFinite(age)||age>1800000)runPortfolioVerification();
    }
    window.setTimeout(lazyVerify,350);

    var hero=document.getElementById('splashHero');
    var splash=document.getElementById('gei-splash');
    var enter=document.getElementById('splashEnter');
    var skip=document.getElementById('splashSkip');
    if(hero&&splash){
      var effects={float:'gei81Float',drift:'gei81Drift',breathe:'gei81Breathe',sway:'gei81Sway',rise:'gei81Rise',glide:'gei81Glide',pulse:'gei81Pulse',tilt:'gei81Tilt',bob:'gei81Bob',zoom:'gei81Zoom',wave:'gei81Wave',levitate:'gei81Levitate',shimmer:'gei81Shimmer',rock:'gei81Rock',aurora:'gei81Aurora',tide:'gei81Tide',hover:'gei81Hover',elastic:'gei81Elastic'};
      var keyframes='';
      keyframes+='@keyframes gei81Float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.015)}}';
      keyframes+='@keyframes gei81Drift{0%,100%{transform:translate(0) rotate(0)}50%{transform:translate(10px,-7px) rotate(1deg)}}';
      keyframes+='@keyframes gei81Breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}';
      keyframes+='@keyframes gei81Sway{0%,100%{transform:translateX(0)}50%{transform:translateX(10px)}}';
      keyframes+='@keyframes gei81Rise{0%,100%{transform:translateY(2px)}50%{transform:translateY(-12px)}}';
      keyframes+='@keyframes gei81Glide{0%,100%{transform:translateX(-8px)}50%{transform:translateX(8px)}}';
      keyframes+='@keyframes gei81Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.09)}}';
      keyframes+='@keyframes gei81Tilt{0%,100%{transform:rotate(-2.2deg)}50%{transform:rotate(2.2deg)}}';
      keyframes+='@keyframes gei81Bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px) rotate(-2deg)}}';
      keyframes+='@keyframes gei81Zoom{0%,100%{transform:scale(.98)}50%{transform:scale(1.07)}}';
      keyframes+='@keyframes gei81Wave{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}';
      keyframes+='@keyframes gei81Levitate{0%,100%{transform:translateY(2px)}50%{transform:translateY(-12px)}}';
      keyframes+='@keyframes gei81Shimmer{0%,100%{filter:drop-shadow(0 18px 35px rgba(0,0,0,.55))}50%{filter:drop-shadow(0 18px 35px rgba(47,210,255,.6))}}';
      keyframes+='@keyframes gei81Rock{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}';
      keyframes+='@keyframes gei81Aurora{0%,100%{transform:translate(0)}50%{transform:translate(7px,-7px) rotate(2deg)}}';
      keyframes+='@keyframes gei81Tide{0%,100%{transform:translate(-4px,2px)}50%{transform:translate(4px,-4px)}}';
      keyframes+='@keyframes gei81Hover{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-8px) rotate(3deg)}}';
      keyframes+='@keyframes gei81Elastic{0%,100%{transform:scale(1)}30%{transform:scale(1.06,.96)}60%{transform:scale(.98,1.03)}}';
      var style=document.createElement('style');style.textContent=keyframes;document.head.appendChild(style);
      var motionKeys=Object.keys(effects),last='';try{last=sessionStorage.getItem('gei_splash_effect_v81')||''}catch(e){}
      var choices=motionKeys.filter(function(k){return k!==last}); var picked=choices[Math.floor(Math.random()*choices.length)]||motionKeys[0];
      var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(!reduced)hero.style.animation='heroReveal .95s .05s cubic-bezier(.18,.86,.32,1.28) forwards,'+effects[picked]+' 3.7s 1s ease-in-out infinite';
      try{sessionStorage.setItem('gei_splash_effect_v81',picked)}catch(e){}
    }
    function closeSplash(){phone.classList.add('splash-done');if(splash)setTimeout(function(){if(splash.parentNode)splash.remove()},700)}
    [enter,skip].forEach(function(btn){if(btn)btn.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();closeSplash()},true)});
    document.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '||e.key==='Escape'){e.preventDefault();closeSplash()}},true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
