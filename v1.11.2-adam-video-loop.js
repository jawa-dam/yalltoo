/* V1.11.2 — Adam Video Lab Loop
 * Adds a subtle looping animation to the existing Adam mascot on the Video Lab.
 * Keeps the mascot asset, size, layout, and navigation unchanged.
 */
(function(){
  'use strict';
  function run(){
    var screen=document.getElementById('screen-video');
    if(!screen)return;
    var guide=screen.querySelector('.adam-guide');
    if(!guide)return;
    var art=guide.querySelector('.adam-art');
    if(!art)return;
    if(art.dataset && art.dataset.geiV1112Loop==='1')return;
    try{art.dataset.geiV1112Loop='1'}catch(e){}
    var style=document.createElement('style');
    style.textContent=''+
      '.adam-guide .adam-art{transform-origin:50% 86%;animation:adamVideoLoop 4.2s ease-in-out infinite;will-change:transform,filter}'+
      '@keyframes adamVideoLoop{0%,100%{transform:translate3d(0,1px,0) rotate(0deg);filter:drop-shadow(0 7px 12px rgba(0,0,0,.20))}25%{transform:translate3d(0,-2px,0) rotate(-1.2deg);filter:drop-shadow(0 9px 14px rgba(0,0,0,.22))}50%{transform:translate3d(0,-5px,0) rotate(0deg);filter:drop-shadow(0 11px 16px rgba(0,0,0,.24))}75%{transform:translate3d(0,-2px,0) rotate(1.2deg);filter:drop-shadow(0 9px 14px rgba(0,0,0,.22))}}'+
      '@media(prefers-reduced-motion:reduce){.adam-guide .adam-art{animation:none!important;transform:none!important}}';
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
