/* V1.12.1 — Navigation Recovery + Splash Guard
 * Restores all primary and internal navigation after the Video Music Lab mount.
 * Uses capture-phase handlers so dynamically mounted media controls cannot
 * interfere with app routing.
 */
(function(){
  'use strict';
  function boot(){
    var body=document.body,phone=document.getElementById('app-phone');
    if(!body||!phone||body.dataset.geiNavV121==='1')return;
    body.dataset.geiNavV121='1';

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
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        show(which);
        return;
      }
      if(target.hasAttribute('data-back')){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        show(target.getAttribute('data-back')||'dash');
      }
    },true);

    /* Splash guard: keep the cinematic gateway visible until its own controller closes it. */
    var splash=document.getElementById('gei-splash');
    if(splash){
      splash.style.zIndex='99999';
      splash.style.pointerEvents='auto';
      splash.style.display='flex';
      splash.setAttribute('aria-hidden','false');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
