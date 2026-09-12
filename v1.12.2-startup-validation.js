/* V1.12.6 — Single Splash Authority
 * Startup validation no longer styles or controls the splash.
 * The cinematic splash controller owns splash startup/exit.
 * This layer only restores the app routes after the splash is done.
 */
(function(){
  'use strict';
  function boot(){
    var body=document.body;
    var phone=document.getElementById('app-phone');
    if(!body||!phone||body.dataset.geiStartupV126==='1')return;
    body.dataset.geiStartupV126='1';

    function appReady(){
      return phone.classList.contains('splash-done');
    }

    function show(which){
      if(!appReady())return;
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
        if(!appReady())return;
        e.preventDefault();
        e.stopImmediatePropagation();
        show(which);
        return;
      }
      if(target.hasAttribute('data-back')){
        if(!appReady())return;
        e.preventDefault();
        e.stopImmediatePropagation();
        show(target.getAttribute('data-back')||'dash');
      }
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
