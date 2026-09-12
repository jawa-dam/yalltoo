/* V1.11.1 — Video Lab Scroll Recovery
 * Restores independent vertical touch scrolling inside the Video Lab body.
 * The app shell stays fixed; only Video Lab content scrolls behind the fixed nav.
 */
(function(){
  'use strict';
  function run(){
    var screen=document.getElementById('screen-video');
    if(!screen)return;
    var body=screen.querySelector('.video-body');
    if(!body)return;
    body.style.overflowY='auto';
    body.style.overflowX='hidden';
    body.style.webkitOverflowScrolling='touch';
    body.style.touchAction='pan-y';
    body.style.overscrollBehaviorY='contain';
    body.style.minHeight='0';
    body.style.paddingBottom='calc(16px + env(safe-area-inset-bottom, 0px))';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
