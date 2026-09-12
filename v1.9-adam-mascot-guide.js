/* V1.9 — Adam Mascot Guide
 * Brings the YallToo beaver mascot into the Video Lab as the named GEI guide.
 * Safe-by-default: uses the supplied transparent mascot asset and does not
 * alter the video source or navigation model.
 */
(function(){
  'use strict';
  var MASCOT='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-beaver-rhhiVplt1GMykxV8.png';
  function run(){
    var screen=document.getElementById('screen-video');
    if(!screen || screen.querySelector('.adam-guide'))return;
    var body=screen.querySelector('.video-body');
    var feature=screen.querySelector('.video-feature');
    if(!body || !feature)return;
    var guide=document.createElement('aside');
    guide.className='adam-guide';
    guide.setAttribute('aria-label','Adam, the YallToo GEI Guide');
    guide.innerHTML='<div class="adam-art-wrap"><img class="adam-art" src="'+MASCOT+'" alt="Adam, the YallToo beaver guide"></div><div class="adam-copy"><span class="adam-kicker">MEET YOUR GEI GUIDE</span><h2 class="adam-title">Hi, I’m Adam.</h2><p class="adam-text">Let’s explore the water system behind Genesis Engineered Interpretations.</p></div>';
    body.insertBefore(guide,feature);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
