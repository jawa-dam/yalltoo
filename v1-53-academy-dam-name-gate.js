/* V3.2.6 — GEI Academy Dam Name Gate
   Keeps the gate resilient to Academy DOM rebuilds and explicitly requests
   a fresh Academy render after a valid Dam Name is saved.
*/
(()=>{"use strict";
if(window.GEI_V153)return;
const api=()=>window.GEI_IDENTITY;

function getScreen(){return document.getElementById("screen-academy")}

function mount(){
  const screen=getScreen();
  if(!screen||screen.querySelector(".v1-53-academy-gate"))return;
  const gate=document.createElement("div");
  gate.className="v1-53-academy-gate";
  gate.hidden=api()?.hasIdentity?.()??false;
  gate.setAttribute("aria-hidden",String(gate.hidden));
  gate.innerHTML='<div class="v1-53-gate-backdrop"></div><section class="v1-53-gate-card" role="dialog" aria-modal="true" aria-labelledby="v1-53-gate-title"><img class="v1-53-gate-mascot" src="'+(window.GEI_MASCOT?.url||"")+'" alt="Adam, the YallToo mascot"/><span class="v1-53-gate-kicker">GEI ACADEMY • LEARNER IDENTITY</span><h2 id="v1-53-gate-title">Set your Dam Name.</h2><p>Your Dam Name is required before you can begin the GEI Academy blueprint.</p><label for="v1-53-gate-input">DAM NAME</label><div class="v1-53-gate-input-row"><span>@</span><input id="v1-53-gate-input" type="text" inputmode="text" maxlength="20" autocomplete="nickname" placeholder="WaterArchitect" spellcheck="false"/></div><button id="v1-53-gate-save" type="button">ENTER ACADEMY</button><small>3–20 characters • letters, numbers, _ or -</small><div class="v1-53-gate-error" id="v1-53-gate-error" role="alert" hidden></div></section></div>';
  screen.appendChild(gate);
}

function show(){
  mount();
  const gate=document.querySelector(".v1-53-academy-gate");
  if(!gate)return;
  gate.hidden=false;
  gate.setAttribute("aria-hidden","false");
  const input=gate.querySelector("#v1-53-gate-input");
  if(input){
    input.value=api()?.getDamName?.()||"";
    requestAnimationFrame(()=>input.focus());
  }
}

function hide(){
  const gate=document.querySelector(".v1-53-academy-gate");
  if(!gate)return;
  gate.hidden=true;
  gate.setAttribute("aria-hidden","true");
}

function requestAcademyRender(){
  window.dispatchEvent(new CustomEvent("gei:academy-render",{detail:{source:"v3.2.6-dam-name-unlock"}}));
  if(window.location.hash!=="#academy"){
    window.history.replaceState(window.history.state,"",window.location.pathname+window.location.search+"#academy");
  }
}

function submit(){
  const input=document.querySelector("#v1-53-gate-input");
  const err=document.querySelector("#v1-53-gate-error");
  if(!input)return;
  const raw=input.value;
  if(!api()?.setDamName?.(raw,"academy-gate")){
    const cleaned=raw.trim().replace(/^@+/,"");
    if(err){
      err.textContent=cleaned.length<3?"Dam Name must be at least 3 characters.":"Use 3–20 characters: letters, numbers, _ or -.";
      err.hidden=false;
    }
    return;
  }
  hide();
  requestAcademyRender();
  window.dispatchEvent(new CustomEvent("gei:academy-identity-unlocked",{
    detail:{damName:api().getDamName(),source:"v3.2.6"}
  }));
}

function sync(){
  const screen=getScreen();
  if(!screen)return;
  if(api()?.hasIdentity?.())hide();
  else if(location.hash==="#academy")show();
}

function init(){
  mount();
  window.addEventListener("gei:navigation",e=>{if(e.detail?.id==="academy")sync()});
  window.addEventListener("gei:identity-updated",()=>{
    sync();
    if(location.hash==="#academy"&&api()?.hasIdentity?.())requestAcademyRender();
  });
  window.addEventListener("gei:learner-identity-ready",sync);
  window.addEventListener("gei:academy-render",()=>{window.setTimeout(sync,0)});
  window.GEI_V153=Object.freeze({version:"3.2.6",hasDamName:()=>api()?.hasIdentity?.()||false,show,hide});
  if(location.hash==="#academy")show();

  document.addEventListener("keydown",e=>{
    if(e.key==="Enter"&&e.target?.id==="v1-53-gate-input"){e.preventDefault();submit()}
  });

  document.addEventListener("click",e=>{
    if(e.target.closest?.("#v1-53-gate-save")){e.preventDefault();submit()}
  },true);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();