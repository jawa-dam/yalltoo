/* V1.11.4 — Adam Mission Mode
 * Turns Adam's learning tips into small observation missions.
 * Safe-by-default: no external services, no navigation changes, and no video-source changes.
 */
(function(){
  'use strict';

  var MISSIONS=[
    {label:'FIND THE SOURCE',prompt:'Look at the lesson and identify where the water system begins.',choices:['Mountain / source','Downstream bed','Mill / outlet'],correct:0,success:'Great observation. You identified the source before tracing the flow.'},
    {label:'TRACE THE FLOW',prompt:'Which choice best describes what to follow next?',choices:['The path of the water','Only the surface color','The page title'],correct:0,success:'Exactly. Trace movement from source toward destination.'},
    {label:'SPOT THE BOUNDARY',prompt:'What should you look for when identifying a controlled water system?',choices:['A boundary or wall','A random detail','A decorative color'],correct:0,success:'Nice work. Boundaries help define how water is contained and controlled.'},
    {label:'NAME THE CHANGE',prompt:'What kind of change is most useful to notice in an engineering reading?',choices:['Separated, released, moved, or transformed','Font size changed','Nothing changed'],correct:0,success:'That is the engineering lens: notice the functional change in the system.'}
  ];

  function boot(){
    var screen=document.getElementById('screen-video');
    if(!screen)return;
    var guide=screen.querySelector('.adam-guide');
    if(!guide || guide.dataset.geiV1114==='1')return;
    try{guide.dataset.geiV1114='1'}catch(e){}

    var existing=guide.querySelector('.adam-interactive');
    if(!existing)return;

    var panel=document.createElement('section');
    panel.className='adam-mission';
    panel.innerHTML='<div class="adam-mission-head"><span class="adam-mission-kicker">ADAM’S MISSION</span><span class="adam-mission-count" aria-live="polite">1/4</span></div><h3 class="adam-mission-title">FIND THE SOURCE</h3><p class="adam-mission-prompt">Look at the lesson and identify where the water system begins.</p><div class="adam-mission-choices" role="group" aria-label="Mission choices"></div><p class="adam-mission-feedback" aria-live="polite"></p><button type="button" class="adam-mission-next" hidden>NEXT MISSION</button>';

    var choicesEl=panel.querySelector('.adam-mission-choices');
    var titleEl=panel.querySelector('.adam-mission-title');
    var promptEl=panel.querySelector('.adam-mission-prompt');
    var countEl=panel.querySelector('.adam-mission-count');
    var feedbackEl=panel.querySelector('.adam-mission-feedback');
    var nextEl=panel.querySelector('.adam-mission-next');
    var index=0;
    var answered=false;

    function render(){
      var mission=MISSIONS[index];
      titleEl.textContent=mission.label;
      promptEl.textContent=mission.prompt;
      countEl.textContent=(index+1)+'/'+MISSIONS.length;
      feedbackEl.textContent='';
      feedbackEl.className='adam-mission-feedback';
      nextEl.hidden=true;
      choicesEl.innerHTML='';
      answered=false;
      mission.choices.forEach(function(choice,i){
        var button=document.createElement('button');
        button.type='button';
        button.className='adam-mission-choice';
        button.textContent=choice;
        button.setAttribute('data-choice',String(i));
        choicesEl.appendChild(button);
        button.addEventListener('click',function(){answer(i,button)},true);
      });
    }

    function answer(choice,button){
      if(answered)return;
      answered=true;
      var mission=MISSIONS[index];
      var buttons=choicesEl.querySelectorAll('.adam-mission-choice');
      buttons.forEach(function(btn){btn.disabled=true;});
      if(choice===mission.correct){
        button.classList.add('is-correct');
        feedbackEl.className='adam-mission-feedback is-correct';
        feedbackEl.textContent='✓ '+mission.success;
        nextEl.hidden=false;
      }else{
        button.classList.add('is-wrong');
        feedbackEl.className='adam-mission-feedback is-wrong';
        feedbackEl.textContent='Not quite. Look again at the source, flow, boundary, or functional change.';
        buttons[mission.correct].classList.add('is-reveal');
        nextEl.hidden=false;
        nextEl.textContent='TRY NEXT MISSION';
      }
    }

    nextEl.addEventListener('click',function(){
      index=(index+1)%MISSIONS.length;
      nextEl.textContent='NEXT MISSION';
      render();
    },true);

    existing.appendChild(panel);
    render();

    var style=document.createElement('style');
    style.textContent=''+
      '#screen-video .adam-mission{margin-top:10px;padding:10px;border:1px solid rgba(61,61,234,.16);border-radius:14px;background:linear-gradient(135deg,rgba(61,61,234,.05),rgba(47,210,255,.06));box-shadow:0 8px 18px rgba(13,20,40,.05)}'+
      '#screen-video .adam-mission-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:5px}'+
      '#screen-video .adam-mission-kicker{font-size:.52rem;font-weight:800;letter-spacing:.12em;color:var(--magenta)}'+
      '#screen-video .adam-mission-count{font-size:.52rem;font-weight:800;color:var(--grey)}'+
      '#screen-video .adam-mission-title{margin:0;font-family:Space Grotesk,sans-serif;font-size:.88rem;line-height:1.15}'+
      '#screen-video .adam-mission-prompt{margin:5px 0 8px;color:var(--grey);font-size:.66rem;line-height:1.42}'+
      '#screen-video .adam-mission-choices{display:grid;gap:6px}'+
      '#screen-video .adam-mission-choice{width:100%;padding:7px 9px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font:600 .61rem/1.25 Inter,sans-serif;text-align:left;cursor:pointer;touch-action:manipulation}'+
      '#screen-video .adam-mission-choice:focus-visible{outline:3px solid var(--cyan);outline-offset:2px}'+
      '#screen-video .adam-mission-choice:disabled{cursor:default;opacity:.9}'+
      '#screen-video .adam-mission-choice.is-correct{border-color:rgba(47,210,255,.55);box-shadow:0 0 0 2px rgba(47,210,255,.12)}'+
      '#screen-video .adam-mission-choice.is-wrong{border-color:rgba(243,16,186,.45);box-shadow:0 0 0 2px rgba(243,16,186,.10)}'+
      '#screen-video .adam-mission-choice.is-reveal{border-color:rgba(47,210,255,.35);background:rgba(47,210,255,.06)}'+
      '#screen-video .adam-mission-feedback{margin:8px 0 0;font-size:.62rem;line-height:1.38;min-height:0}'+
      '#screen-video .adam-mission-feedback.is-correct{color:#128bb1;font-weight:700}'+
      '#screen-video .adam-mission-feedback.is-wrong{color:var(--magenta);font-weight:700}'+
      '#screen-video .adam-mission-next{margin-top:8px;padding:7px 10px;border:1px solid rgba(243,16,186,.22);border-radius:999px;background:rgba(243,16,186,.06);color:var(--magenta);font:800 .56rem/1 Inter,sans-serif;letter-spacing:.07em;cursor:pointer;touch-action:manipulation}'+
      '#screen-video .adam-mission-next:focus-visible{outline:3px solid var(--magenta);outline-offset:2px}'+
      '#screen-video .adam-mission-next[hidden]{display:none!important}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
