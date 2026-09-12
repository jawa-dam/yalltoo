/* V1.8.9 — Video Hub Interaction Layer
 * Adds a first-class Video destination to the existing mobile navigation.
 * Safe-by-default: video button opens an accessible video prompt until a real
 * hosted lesson URL is configured. The hub itself never invents a video source.
 */
(function(){
  'use strict';
  function run(){
    var video=document.getElementById('screen-video');
    if(!video)return;

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

    function bind(selector,handler,key){
      document.querySelectorAll(selector).forEach(function(el){
        if(el.dataset && el.dataset[key]==='1')return;
        try{el.dataset[key]='1'}catch(e){}
        el.addEventListener('click',function(e){
          try{e.preventDefault();e.stopPropagation();}catch(err){}
          try{handler(el,e)}catch(err){}
        },true);
      });
    }

    bind('.video-item',function(){show('video')},'geiV189VideoBound');

    var play=document.querySelector('#screen-video .video-play');
    if(play && !(play.dataset && play.dataset.geiV189Play==='1')){
      try{play.dataset.geiV189Play='1'}catch(e){}
      play.addEventListener('click',function(e){
        try{e.preventDefault();e.stopPropagation()}catch(err){}
        var configured=video.getAttribute('data-video-url')||'';
        if(configured){window.open(configured,'_blank','noopener');return;}
        window.alert('Your first GEI video can be connected here. The Video Hub is ready for the lesson URL.');
      },true);
    }

    bind('[data-back]',function(el){
      var back=el.getAttribute('data-back')||'dash';
      if(video.contains(el))show(back);
    },'geiV189BackBound');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
