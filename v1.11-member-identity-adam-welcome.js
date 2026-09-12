/* V1.11 — Member Identity & Adam Welcome */
(function(){
  'use strict';
  var KEY='gei_member_since_v1';
  var VISIT_KEY='gei_member_last_seen_v1';

  function read(key){try{return localStorage.getItem(key)||''}catch(e){return ''}}
  function write(key,value){try{localStorage.setItem(key,value);return true}catch(e){return false}}
  function validIso(value){var d=new Date(value);return !Number.isNaN(d.getTime())}
  function formatDate(iso){
    var d=new Date(iso);
    if(Number.isNaN(d.getTime()))return 'your first visit';
    try{return new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric'}).format(d)}catch(e){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  }
  function ensureMemberSince(){
    var stored=read(KEY);
    if(stored&&validIso(stored))return stored;
    var now=new Date().toISOString();
    write(KEY,now);
    return now;
  }
  function getLastSeen(){
    var value=read(VISIT_KEY);
    return value&&validIso(value)?value:'';
  }
  function isReturning(){
    return !!getLastSeen();
  }
  function renderIdentity(){
    var since=ensureMemberSince();
    var dateEl=document.getElementById('memberSinceDate');
    var proofEl=document.getElementById('memberSinceProof');
    var badgeEl=document.getElementById('memberStatusBadge');
    if(dateEl)dateEl.textContent=formatDate(since);
    if(proofEl)proofEl.textContent='Persistent local member record';
    if(badgeEl){badgeEl.textContent=isReturning()?'RETURNING MEMBER':'NEW MEMBER';badgeEl.classList.toggle('returning',isReturning())}
  }
  function renderAdam(){
    var returning=isReturning();
    var title=document.getElementById('adamWelcomeTitle');
    var text=document.getElementById('adamWelcomeText');
    var kicker=document.getElementById('adamWelcomeKicker');
    var welcome=document.getElementById('adamWelcome');
    if(!title||!text)return;
    if(returning){
      if(kicker)kicker.textContent='WELCOME BACK';
      title.textContent='Good to see you again.';
      text.textContent='Adam remembers your local member record. Continue exploring the water blueprint.';
      if(welcome)welcome.classList.add('returning');
    }else{
      if(kicker)kicker.textContent='WELCOME TO GEI';
      title.textContent='Welcome to the Academy.';
      text.textContent='I’m Adam. I’ll help you explore the water-system interpretation of Genesis Engineered Interpretations.';
      if(welcome)welcome.classList.remove('returning');
    }
  }
  function markSeen(){write(VISIT_KEY,new Date().toISOString())}
  function render(){renderIdentity();renderAdam();markSeen()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
