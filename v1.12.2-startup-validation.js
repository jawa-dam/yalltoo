/* V1.12.2 — Startup Validation
 * Verifies the GEI splash gateway is present before app interaction is exposed,
 * keeps the existing cinematic splash authoritative, and provides a safe,
 * capture-phase route handler for the four app destinations + Back controls.
 */
(function(){
  'use strict';
  function boot(){
    var body=document.body,phone=document.getElementById('app-phone');
    if(!body||!phone||body.dataset.geiStartupV122==='1')return;
    body.dataset.geiStartupV122='1';

    var splash=document.getElementById('gei-splash');
    if(splash){
      splash.style.display='flex';
      splash.style.visibility='visible';
      splash.style.opacity='1';
      splash.style.pointerEvents='auto';
      splash.style.zIndex='99999';
    }

    function show(which){
      var target=document.getElementById('screen-'+which);
      if(!target)return;
      document.querySelectorAll('.screen').forEach(function(screen){
        screen.classList.add('off-right');
        screen.classList.remove('off-left');
      });
      target.classList.remove('off-right');
      document.querySelectorAll('.nav').forEach(function(nav){
        nav.classList.remove('on-menu','on-portfolio','on-video','on-support');
        if(which==='menu')nav.classList.add('on-menu');
        if(which==='portfolio')nav.classList.add('on-portfolio');
        if(which==='video')nav.classList.add('on-video');
        if(which==='support')nav.classList.add('on-support');
      });
    }

    function route(el){
      if(!el)return null;
      if(el.classList.contains('menu-item'))return 'menu';
      if(el.classList.contains('portfolio-item')||el.classList.contains('portfolio-nav-portfolio'))return 'portfolio';
      if(el.classList.contains('video-item'))return 'video';
      if(el.classList.contains('support-item'))return 'support';
      return null;
    }

    document.addEventListener('click',function(e){
      var target=e.target&&e.target.closest?e.target.closest('.nav a,.nav button,.portfolio-nav a,.portfolio-nav button,[data-back]'):null;
      if(!target||target.classList.contains('cart-link')||target.closest('#gei-splash'))return;
      var which=route(target);
      if(which){
        e.preventDefault();
        e.stopImmediatePropagation();
        show(which);
        return;
      }
      if(target.hasAttribute('data-back')){
        e.preventDefault();
        e.stopImmediatePropagation();
        show(target.getAttribute('data-back')||'dash');
      }
    },true);

    /* Never let this validation layer own the splash exit. */
    document.addEventListener('click',function(e){
      if(!splash||!e.target)return;
      var target=e.target.closest?e.target.closest('#splashEnter,#splashSkip'):null;
      if(target){ return; }
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
