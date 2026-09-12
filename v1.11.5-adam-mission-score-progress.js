/* V1.11.5 — Adam Mission Score & Progress
 * Connects Adam mission success to lightweight local progress tracking.
 * No external services, no navigation changes, and no server account required.
 */
(function(){
  'use strict';

  var STORAGE='gei_adam_mission_progress_v1';
  var XP_PER_MISSION=25;
  var MAX_MISSIONS=4;

  function load(){
    try{
      var raw=localStorage.getItem(STORAGE);
      if(raw){
        var data=JSON.parse(raw);
        if(data && typeof data==='object')return {
          xp:Number(data.xp)||0,
          completed:Array.isArray(data.completed)?data.completed:[],
          correct:Number(data.correct)||0,
          attempts:Number(data.attempts)||0
        };
      }
    }catch(e){}
    return {xp:0,completed:[],correct:0,attempts:0};
  }

  function save(data){
    try{localStorage.setItem(STORAGE,JSON.stringify(data));}catch(e){}
  }

  function boot(){
    var screen=document.getElementById('screen-video');
    if(!screen)return;
    var mission=screen.querySelector('.adam-mission');
    if(!mission || mission.dataset.geiV1115==='1')return;
    try{mission.dataset.geiV1115='1'}catch(e){}

    var data=load();
    var feedback=mission.querySelector('.adam-mission-feedback');
    var next=mission.querySelector('.adam-mission-next');
    var count=mission.querySelector('.adam-mission-count');
    var choices=mission.querySelector('.adam-mission-choices');
    if(!feedback || !next || !count || !choices)return;

    var score=document.createElement('div');
    score.className='adam-mission-progress';
    score.innerHTML='<div class="adam-score-line"><span class="adam-score-label">MISSION XP</span><strong class="adam-score-xp">'+data.xp+' XP</strong></div><div class="adam-progress-track" aria-hidden="true"><span class="adam-progress-fill"></span></div><div class="adam-score-meta"><span class="adam-score-complete">0/'+MAX_MISSIONS+' mastered</span><span class="adam-score-note">+25 XP per new mastery</span></div>';
    mission.insertBefore(score,choices);

    var xpEl=score.querySelector('.adam-score-xp');
    var fillEl=score.querySelector('.adam-progress-fill');
    var completeEl=score.querySelector('.adam-score-complete');
    var noteEl=score.querySelector('.adam-score-note');
    var awarded=false;

    function completionCount(){return Math.min(MAX_MISSIONS,data.completed.length);}
    function render(){
      var completed=completionCount();
      xpEl.textContent=data.xp+' XP';
      completeEl.textContent=completed+'/'+MAX_MISSIONS+' mastered';
      fillEl.style.width=((completed/MAX_MISSIONS)*100)+'%';
      noteEl.textContent=completed===MAX_MISSIONS?'ALL MISSIONS MASTERED':'+'+XP_PER_MISSION+' XP per new mastery';
    }

    function currentKey(){
      var title=mission.querySelector('.adam-mission-title');
      return title?(title.textContent||'').trim().toLowerCase():'';
    }

    function awardMission(){
      if(awarded)return;
      awarded=true;
      var key=currentKey();
      data.attempts+=1;
      if(key && data.completed.indexOf(key)===-1){
        data.completed.push(key);
        data.correct+=1;
        data.xp+=XP_PER_MISSION;
        save(data);
        feedback.innerHTML=feedback.textContent+' <span class="adam-xp-burst">+'+XP_PER_MISSION+' XP</span>';
      }else{
        save(data);
      }
      render();
    }

    function watch(){
      var observer=new MutationObserver(function(){
        var text=(feedback.textContent||'').trim();
        if(text.indexOf('✓')===0){awardMission();}
      });
      observer.observe(feedback,{childList:true,subtree:true,characterData:true});
    }

    next.addEventListener('click',function(){
      awarded=false;
      setTimeout(function(){render();},0);
    },true);

    render();
    watch();

    var style=document.createElement('style');
    style.textContent=''+
      '#screen-video .adam-mission-progress{margin:8px 0 9px;padding:7px 8px;border:1px solid rgba(47,210,255,.16);border-radius:11px;background:rgba(47,210,255,.045)}'+
      '#screen-video .adam-score-line{display:flex;align-items:center;justify-content:space-between;gap:8px}'+
      '#screen-video .adam-score-label{font-size:.5rem;font-weight:800;letter-spacing:.1em;color:var(--grey)}'+
      '#screen-video .adam-score-xp{font-family:Space Grotesk,sans-serif;font-size:.78rem;color:var(--indigo)}'+
      '#screen-video .adam-progress-track{height:5px;margin-top:6px;border-radius:999px;background:rgba(122,127,146,.14);overflow:hidden}'+
      '#screen-video .adam-progress-fill{display:block;height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,var(--cyan),var(--magenta));transition:width .35s ease}'+
      '#screen-video .adam-score-meta{display:flex;justify-content:space-between;gap:8px;margin-top:5px;font-size:.48rem;font-weight:700;color:var(--grey)}'+
      '#screen-video .adam-xp-burst{display:inline-block;margin-left:4px;color:var(--indigo);font-weight:800}';
    document.head.appendChild(style);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
