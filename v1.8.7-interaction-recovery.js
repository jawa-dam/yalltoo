/* V1.8.7 — Interaction Recovery Layer
 * Installs critical UI controls independently from the legacy recovery boot.
 * Purpose: keep Menu / Portfolio / Support / Back / skins / splash exit working
 * even when another enhancement throws a runtime exception.
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
      var theme=validThemes[name]?' '+name:'';
      theme=(theme||' regular').trim();
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
    bindAccordion();

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
