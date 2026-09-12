/* V1.8.7 — Interaction Recovery Layer
 * Installs critical UI controls independently from the legacy recovery boot.
 * Purpose: keep Menu / Portfolio / Support / Back / skins / splash exit working
 * even when another enhancement throws a runtime exception.
 *
 * V1.8.7.1 — Portfolio Preservation Hotfix
 * Makes the recovery layer responsible for restoring the complete 12-entry
 * portfolio whenever the DOM has been reduced to an incomplete starter item.
 */
(function(){
  'use strict';
  function run(){
    var body=document.body;
    if(!body)return;

    function show(which){
      var target=document.getElementById('screen-'+which);
      if(!target)return;
      document.querySelectorAll('.screen').forEach(function(screen){
        screen.classList.add('off-right');
        screen.classList.remove('off-left');
      });
      target.classList.remove('off-right');
      document.querySelectorAll('.nav').forEach(function(nav){
        nav.classList.remove('on-menu','on-portfolio','on-support');
        if(which==='menu')nav.classList.add('on-menu');
        if(which==='portfolio')nav.classList.add('on-portfolio');
        if(which==='support')nav.classList.add('on-support');
      });
    }

    function safeBind(selector,handler,key){
      document.querySelectorAll(selector).forEach(function(el){
        if(el.dataset && el.dataset[key]==='1')return;
        try{el.dataset[key]='1'}catch(e){}
        el.addEventListener('click',function(e){
          try{e.preventDefault();e.stopPropagation();}catch(err){}
          try{handler(el,e)}catch(err){}
        },true);
      });
    }

    safeBind('.menu-item',function(){show('menu')},'geiV187Bound');
    safeBind('.portfolio-item',function(){show('portfolio')},'geiV187Bound');
    safeBind('.support-item',function(){show('support')},'geiV187Bound');
    safeBind('[data-back]',function(el){show(el.getAttribute('data-back')||'dash')},'geiV187BackBound');

    var validThemes={regular:1,dark:1,hotpink:1,babyblue:1};
    function applyTheme(name){
      var theme=validThemes[name]?name:'regular';
      body.setAttribute('data-theme',theme);
      try{localStorage.setItem('gei_theme_v1',theme)}catch(e){}
      document.querySelectorAll('.skin-dot').forEach(function(dot){
        dot.classList.toggle('is-active',dot.getAttribute('data-theme')===theme);
      });
    }
    var saved='regular';
    try{saved=localStorage.getItem('gei_theme_v1')||'regular'}catch(e){}
    applyTheme(saved);
    safeBind('.skin-dot',function(el){applyTheme(el.getAttribute('data-theme')||'regular')},'geiV187SkinBound');

    function bindAccordion(){
      document.querySelectorAll('.acc-trigger').forEach(function(trigger){
        if(trigger.dataset && trigger.dataset.geiV187Accordion==='1')return;
        try{trigger.dataset.geiV187Accordion='1'}catch(e){}
        trigger.addEventListener('click',function(e){
          try{e.preventDefault();e.stopPropagation()}catch(err){}
          var item=trigger.closest('.acc-item');
          if(!item)return;
          var open=item.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded',String(open));
        },true);
      });
    }

    var portfolioData=[
      {n:'01',title:'Decoding the Creation Story as an Antediluvian Hydraulic Blueprint',summary:'Presents the Genesis creation story as an antediluvian hydraulic blueprint and develops the project’s core engineering interpretation.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5622371',identifier:'SSRN 5622371',repository:'SSRN',role:'Core Genesis hydraulic blueprint thesis.'},
      {n:'02',title:'Genesis Engineered – The Dam and Mill Blueprint Revealed',summary:'Details the proposed dam-and-mill architecture at the center of Genesis Engineered, linking textual imagery to water storage, controlled release, and mechanical work.',source:'YallToo / Paper',kind:'yalltoo',label:'Read on Zenodo ↗',url:'https://zenodo.org/records/17316846',identifier:'Zenodo 17316846',repository:'Zenodo',role:'Dam and Mill Blueprint publication record.'},
      {n:'03',title:'Decoding Genesis through Literary Mechanics',summary:'Examines Genesis through literary structure, sequence, repetition, and mechanics as evidence within the proposed interpretive method.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5792302',identifier:'SSRN 5792302',repository:'SSRN',role:'Literary-mechanics support for the interpretive method.'},
      {n:'04',title:'A Methodological Framework for Decoding Ancient Sacred Texts as Technical Manuals',summary:'Sets out a methodological framework for testing whether ancient sacred texts can be read as technical or procedural documentation.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789382',identifier:'SSRN 5789382',repository:'SSRN',role:'Methodological framework for technical-text interpretation.'},
      {n:'05',title:'Reconstructing an Antediluvian Mill and Power-Generation System from Genesis 1 Symbolism',summary:'Reconstructs a proposed antediluvian mill and power-generation system from the symbolic language and sequence of Genesis 1.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789342',identifier:'SSRN 5789342',repository:'SSRN',role:'Mill and power-generation reconstruction within GEI.'},
      {n:'06',title:'Symbolic Hydrology: Reclassifying Biblical Characters as Natural and Mechanical Elements in a Proto-Engineering System',summary:'Reclassifies selected biblical characters as symbolic natural forces or mechanical elements within the proposed proto-engineering system.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789322',identifier:'SSRN 5789322',repository:'SSRN',role:'Symbolic hydrology and system-element mapping.'},
      {n:'07',title:'The Semicolon in Genesis 1:1–2: A Linguistic Marker of Hydraulic Sequencing in Ancient Symbolic Notation',summary:'Focuses on the semicolon in Genesis 1:1–2 and proposes a linguistic-sequencing interpretation for the punctuation’s role in the project.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789263',identifier:'SSRN 5789263',repository:'SSRN',role:'Linguistic sequencing evidence focused on Genesis 1:1–2.'},
      {n:'08',title:'The Firmament as a Hydraulic Partition Wall: Reinterpreting Genesis 1:6–8 Through Antediluvian Water Engineering',summary:'Interprets the firmament of Genesis 1:6–8 as a hydraulic partition wall within the proposed antediluvian water-engineering model.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5789102',identifier:'SSRN 5789102',repository:'SSRN',role:'Firmament and hydraulic partition-wall interpretation.'},
      {n:'09',title:'Badal, “Raqia,” and “Miqveh”: Water Control Terminology in the Hebrew of Genesis 1',summary:'Studies the Hebrew terms badal, raqia, and miqveh in relation to the project’s water-control vocabulary and Genesis 1 terminology.',source:'SSRN',kind:'ssrn',label:'Read on SSRN ↗',url:'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6077590',identifier:'SSRN 6077590',repository:'SSRN',role:'Hebrew terminology layer for the GEI water-control vocabulary.'},
      {n:'10',title:'A Systems-Oriented Interpretation of Water, Storage, and Flow Terminology in Genesis 1',summary:'Presents a systems-oriented reading of Genesis 1 vocabulary involving water, storage, separation, and flow.',source:'Zenodo',kind:'zenodo',label:'Read on Zenodo ↗',url:'https://zenodo.org/records/18269802',identifier:'Zenodo 18269802',repository:'Zenodo',role:'Systems-oriented water, storage, and flow research record.'},
      {n:'11',title:'Genesis Engineered – The Dam and Mill Blueprint Revealed • YallToo.com',summary:'YallToo.com presentation and publication home for the Dam and Mill Blueprint concept within the Genesis Engineered project.',source:'YallToo.com',kind:'yalltoo',label:'Open YallToo.com ↗',url:'https://www.yalltoo.com/',identifier:'YallToo.com',repository:'YallToo',role:'Official GEI presentation and project destination.'},
      {n:'12',title:'Genesis Engineered – The Dam and Mill Blueprint Revealed • Zenodo',summary:'Zenodo record for the same Dam and Mill Blueprint publication, retained as a separate canonical repository entry rather than duplicated as a second research work.',source:'Zenodo',kind:'zenodo',label:'Open Zenodo ↗',url:'https://zenodo.org/records/17316846',identifier:'Zenodo 17316846',repository:'Zenodo',role:'Canonical repository entry for the Dam and Mill Blueprint.'}
    ];

    function renderPortfolioItem(item){
      var wrap=document.createElement('div');
      wrap.className='acc-item';
      wrap.innerHTML='<button class="acc-trigger" type="button" aria-expanded="false"><span class="acc-index">'+item.n+'</span><span class="acc-title">'+item.title+'</span><svg class="acc-chev" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="acc-panel"><p class="paper-summary">'+item.summary+'</p><div class="paper-intel"><div><span class="intel-label">Identifier</span><strong>'+item.identifier+'</strong></div><div><span class="intel-label">Repository</span><strong>'+item.repository+'</strong></div><div class="intel-role"><span class="intel-label">GEI Role</span><strong>'+item.role+'</strong></div></div><div class="paper-meta"><span class="source-tag '+item.kind+'">'+item.source+'</span><a class="read-link '+(item.kind==='yalltoo'?'yalltoo':'')+'" href="'+item.url+'" target="_blank" rel="noopener">'+item.label+'</a></div></div>';
      return wrap;
    }

    function restorePortfolio(){
      var list=document.querySelector('#screen-portfolio .portfolio-accordion');
      if(!list)return;
      var existing=Array.from(list.querySelectorAll('.acc-item'));
      var existingUrls=new Set(Array.from(list.querySelectorAll('.read-link')).map(function(a){return a.getAttribute('href')||''}));
      var complete=existing.length===12&&portfolioData.every(function(item){return existingUrls.has(item.url)});
      if(!complete){
        list.innerHTML='';
        var frag=document.createDocumentFragment();
        portfolioData.forEach(function(item){frag.appendChild(renderPortfolioItem(item));});
        list.appendChild(frag);
      }else{
        list.querySelectorAll('.acc-item').forEach(function(row,index){
          var item=portfolioData[index];
          if(!row.querySelector('.paper-intel')){
            var panel=row.querySelector('.acc-panel');
            if(panel){
              var intel=document.createElement('div');
              intel.className='paper-intel';
              intel.innerHTML='<div><span class="intel-label">Identifier</span><strong>'+item.identifier+'</strong></div><div><span class="intel-label">Repository</span><strong>'+item.repository+'</strong></div><div class="intel-role"><span class="intel-label">GEI Role</span><strong>'+item.role+'</strong></div>';
              var meta=panel.querySelector('.paper-meta');
              if(meta)panel.insertBefore(intel,meta);else panel.appendChild(intel);
            }
          }
        });
      }
      bindAccordion();
      var count=document.querySelector('#screen-portfolio .research-count');
      if(count)count.textContent='12 entries';
      var note=document.querySelector('#screen-portfolio .portfolio-note');
      if(note)note.textContent='12 entries • one entry per publication or official destination.';
    }

    try{restorePortfolio()}catch(e){}
    window.setTimeout(function(){try{restorePortfolio()}catch(e){}},50);
    window.setTimeout(function(){try{restorePortfolio()}catch(e){}},300);
    window.setTimeout(function(){try{restorePortfolio()}catch(e){}},1000);

    function closeSplash(){
      var phone=document.getElementById('app-phone')||document.querySelector('.phone');
      var splash=document.getElementById('gei-splash');
      if(phone)phone.classList.add('splash-done');
      if(splash)window.setTimeout(function(){
        try{if(splash.parentNode)splash.remove()}catch(e){}
      },700);
    }
    safeBind('#splashEnter',closeSplash,'geiV187SplashBound');
    safeBind('#splashSkip',closeSplash,'geiV187SplashBound');
    document.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '||e.key==='Escape'){
        try{e.preventDefault()}catch(err){}
        closeSplash();
      }
    },true);

    try{
      var splash=document.getElementById('gei-splash');
      if(splash && !splash.dataset.geiV187Auto){
        splash.dataset.geiV187Auto='1';
        window.setTimeout(closeSplash,10000);
      }
    }catch(e){}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
