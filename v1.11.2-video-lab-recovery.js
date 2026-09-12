/* V1.11.2 — Video Lab Scroll + Adam Loop Recovery
 * Restores touch-friendly vertical scrolling inside the Video Lab and adds
 * a subtle looping animation to Adam without changing the mascot's size.
 */
(function(){
  'use strict';
  function boot(){
    var screen=document.getElementById('screen-video');
    if(!screen)return;
    var body=screen.querySelector('.video-body');
    if(body){
      body.classList.add('video-body-scroll-recovery');
    }
    var style=document.createElement('style');
    style.textContent=''+
      '#screen-video .video-body.video-body-scroll-recovery{flex:1 1 auto;min-height:0;height:auto;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;touch-action:pan-y;scrollbar-width:thin;padding-bottom:max(18px,env(safe-area-inset-bottom,18px));}'+
      '#screen-video .video-body.video-body-scroll-recovery::-webkit-scrollbar{width:4px}'+
      '#screen-video .video-body.video-body-scroll-recovery::-webkit-scrollbar-thumb{background:rgba(122,127,146,.45);border-radius:99px}'+
      '#screen-video .adam-guide .adam-art{animation:geiAdamGuideLoop 4.2s ease-in-out infinite;transform-origin:50% 92%;will-change:transform,filter}'+
      '@keyframes geiAdamGuideLoop{0%,100%{transform:translate3d(0,0,0) rotate(0deg);filter:drop-shadow(0 8px 14px rgba(0,0,0,.20))}24%{transform:translate3d(0,-3px,0) rotate(-1.2deg);filter:drop-shadow(0 11px 16px rgba(0,0,0,.18))}50%{transform:translate3d(0,-6px,0) rotate(0deg);filter:drop-shadow(0 14px 18px rgba(0,0,0,.15))}74%{transform:translate3d(0,-3px,0) rotate(1.2deg);filter:drop-shadow(0 11px 16px rgba(0,0,0,.18))}}'+
      '@media(prefers-reduced-motion:reduce){#screen-video .adam-guide .adam-art{animation:none!important}}';
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
