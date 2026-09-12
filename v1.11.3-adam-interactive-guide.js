/* V1.11.3 — Adam Interactive Guide
 * Turns the existing Adam guide into a lightweight, accessible learning companion.
 * No external services, no video-source changes, and no navigation changes.
 */
(function(){
  'use strict';

  var TIPS=[
    {title:'Observe the water',text:'Start with the source, flow, boundaries, and destination. Notice the system before naming it.'},
    {title:'Ask the engineering question',text:'What is being separated, contained, released, moved, or transformed in the scene?'},
    {title:'Trace the flow',text:'Follow the path from source to downstream. A useful interpretation should make the movement easier to see.'},
    {title:'Compare the pattern',text:'Look for repeated structures, functions, and relationships before drawing a larger conclusion.'}
  ];

  function boot(){
    var screen=document.getElementById('screen-video');
    if(!screen)return;
    var guide=screen.querySelector('.adam-guide');
    if(!guide || guide.dataset.geiV1113==='1')return;
    try{guide.dataset.geiV1113='1'}catch(e){}

    var copy=guide.querySelector('.adam-copy');
    if(!copy)return;

    var panel=document.createElement('div');
    panel.className='adam-interactive';
    panel.innerHTML='<button type="button" class="adam-ask" aria-expanded="false"><span class="adam-ask-dot" aria-hidden="true"></span><span>ASK ADAM</span><span class="adam-ask-chevron" aria-hidden="true">⌄</span></button><div class="adam-tip" hidden><strong class="adam-tip-title">Observe the water</strong><p class="adam-tip-text">Start with the source, flow, boundaries, and destination. Notice the system before naming it.</p><button type="button" class="adam-next">NEXT TIP</button></div>';
    copy.appendChild(panel);

    var ask=panel.querySelector('.adam-ask');
    var tip=panel.querySelector('.adam-tip');
    var next=panel.querySelector('.adam-next');
    var title=panel.querySelector('.adam-tip-title');
    var text=panel.querySelector('.adam-tip-text');
    var index=0;

    function render(){
      var item=TIPS[index];
      title.textContent=item.title;
      text.textContent=item.text;
    }

    function toggle(){
      var open=!tip.hidden;
      tip.hidden=open;
      ask.setAttribute('aria-expanded',String(!open));
      panel.classList.toggle('is-open',!open);
      if(!open)render();
    }

    ask.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      toggle();
    },true);

    next.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      index=(index+1)%TIPS.length;
      render();
    },true);

    render();

    var style=document.createElement('style');
    style.textContent=''+
      '#screen-video .adam-interactive{margin-top:9px;width:100%}'+
      '#screen-video .adam-ask{width:100%;display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid rgba(47,210,255,.28);border-radius:12px;background:linear-gradient(135deg,rgba(47,210,255,.10),rgba(243,16,186,.08));color:var(--ink);font:800 .62rem/1 Inter,sans-serif;letter-spacing:.08em;cursor:pointer;touch-action:manipulation;text-align:left}'+
      '#screen-video .adam-ask:focus-visible{outline:3px solid var(--cyan);outline-offset:2px}'+
      '#screen-video .adam-ask-dot{width:7px;height:7px;flex:0 0 auto;border-radius:50%;background:linear-gradient(135deg,var(--cyan),var(--magenta));box-shadow:0 0 9px rgba(47,210,255,.55)}'+
      '#screen-video .adam-ask-chevron{margin-left:auto;font-size:.82rem;line-height:1;transition:transform .2s ease}'+
      '#screen-video .adam-interactive.is-open .adam-ask-chevron{transform:rotate(180deg)}'+
      '#screen-video .adam-tip{margin-top:7px;padding:10px;border:1px solid var(--line);border-radius:12px;background:var(--surface);box-shadow:0 8px 18px rgba(13,20,40,.06)}'+
      '#screen-video .adam-tip-title{display:block;font-family:Space Grotesk,sans-serif;font-size:.82rem;line-height:1.1;margin-bottom:4px}'+
      '#screen-video .adam-tip-text{margin:0;color:var(--grey);font-size:.67rem;line-height:1.42}'+
      '#screen-video .adam-next{margin-top:8px;padding:6px 8px;border:1px solid rgba(243,16,186,.22);border-radius:999px;background:rgba(243,16,186,.06);color:var(--magenta);font:800 .56rem/1 Inter,sans-serif;letter-spacing:.07em;cursor:pointer;touch-action:manipulation}'+
      '#screen-video .adam-next:focus-visible{outline:3px solid var(--magenta);outline-offset:2px}'+
      '#screen-video .adam-tip[hidden]{display:none!important}'+
      '@media(prefers-reduced-motion:reduce){#screen-video .adam-ask-chevron{transition:none!important}}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
