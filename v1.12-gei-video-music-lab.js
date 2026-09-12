/* V1.12 — GEI Video & Music Lab
 * Adds a compact music player inside the existing Video Lab.
 * No new bottom-nav destination is created.
 */
(function(){
  'use strict';
  var TRACKS=[
    {title:"The Master's Build",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_maker_s_blueprint-pQPS2KhHLu40bkMw.mp3"},
    {title:"Scooped From Red Clay",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/scooped_from_red_clay-cp5MYH0Sn0PTPcl4.mp3"},
    {title:"Adam the Dam (Remix)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-2-40oMmbqZQpFB6AXR.mp3"},
    {title:"Red Clay Schematics",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/red_clay_schematics-4cizONYTebzvCu8s.mp3"},
    {title:"Rich Red Clay",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/rich_red_clay-hOrQng2IaF9xegoy.mp3"},
    {title:"Heaven's Heavy Wall",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_s_heavy_wall-rej0aEWKHvqZUHMI.mp3"},
    {title:"The Mighty Design",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_mighty_design-5IpqSpR8yDBNMT1h.mp3"},
    {title:"Dam Components",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/dam_component-YRC46yLMxZvvLBiN.mp3"},
    {title:"Heaven Built",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_built-11ywTE4EpE0TP85E.mp3"},
    {title:"Divide the Tide",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/divide_the_tide-1ZT1DJb3dA5PeI64.mp3"},
    {title:"Adam the Dam",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-rEp4qpBtaVYxzO3s.mp3"},
    {title:"Adam the Dam (Original Version)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-1-0u5vbFyekCuGOoFG.mp3"},
    {title:"Claim the Water Line",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/claim_the_water_line-Zc2mFNYfkoYWO9vr.mp3"},
    {title:"Adam the Dam (Version 3)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-3-1W4Avd8LbfLfiNPA.mp3"},
    {title:"Adam the Dam (Version 4)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-4-cbzzomHtsQMygpT8.mp3"},
    {title:"Adam the Dam (Version 5)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-5-xZJ522flPAejr5gY.mp3"},
    {title:"The Sinking Rail",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_sinking_rail-tU4YW5vORErih6EE.mp3"},
    {title:"The Damming of Adam",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_damming_of_adam-31l59oHxbScaXOGo.mp3"},
    {title:"Reservoir Divide",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/reservoir_divide-XhHetuumzth5TAHe.mp3"},
    {title:"Split the Sky",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/split_the_sky-4TrLc2cMTePBMvh4.mp3"},
    {title:"Lock the Gate",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/lock_the_gate-oT9zJzmfpolvKuoV.mp3"},
    {title:"Reservoir High",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/reservoir_high-e7T4xQqV7i9TnkCC.mp3"},
    {title:"Reservoir High (Version 1)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/reservoir_high-1-uPRvKCA5AupRS52v.mp3"},
    {title:"Reservoir High (Version 2)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/reservoir_high-2-hj5XLbLtO91pFmrB.mp3"},
    {title:"Heaven Divide",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_divide-apeGks6EjEnEgkGx.mp3"},
    {title:"Heaven Divide (Version 1)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_divide-1-UekvCaauzWJNSTk6.mp3"},
    {title:"Heaven Divide (Version 2)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_divide-2-KxtzyDh8natZ7uGD.mp3"},
    {title:"Hold the Flow",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/hold_the_flow-87tD9qHzvczkszYq.mp3"},
    {title:"Earth Aligned",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/earth_aligned-eLeQHKnqY7F5jYtF.mp3"},
    {title:"Still Raisin' Cane",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/still_raisin_cane-ASXFAucnNNkof9AV.mp3"},
    {title:"Divide the Deep",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/divide_the_deep-IXVQCct7oKD9gJ86.mp3"},
    {title:"The Face of the Deep",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_face_of_the_deep-N6sWD6GfpwCGqh5N.mp3"},
    {title:"The Face of the Deep (Version 1)",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_face_of_the_deep-1-8z6KKEPV3RFQ5Z2A.mp3"},
    {title:"The Finest Fella",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_finest_fella-mLZDhkIyJT3rLLzI.mp3"},
    {title:"The Adam Component",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_adam_component-0ncw0TU5WcU8hxLa.mp3"},
    {title:"The Timber Frame",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_timber_frame-fsJnbCT2l8zHEGZs.mp3"},
    {title:"Nature's Hydraulic Law",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/nature_s_hydraulic_law-rHm0eT4hBWs93wfb.mp3"},
    {title:"Semantic Clay",artist:"Y'all Too",src:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/semantic_clay-xVfpWRFar6RgjOaz.mp3"}
  ];
  function icon(path){return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">'+path+'</svg>'}
  function boot(){
    var screen=document.getElementById('screen-video');
    if(!screen||screen.dataset.geiMusicV12==='1'||!TRACKS.length)return;
    screen.dataset.geiMusicV12='1';
    var feature=screen.querySelector('.video-feature');
    var body=screen.querySelector('.video-body');
    if(!body)return;
    var player=document.createElement('section');
    player.className='gei-music-player';
    player.innerHTML='<div class="gei-music-top"><div><span class="gei-music-kicker">ADAM\'S AUDIO LAB</span><h3 class="gei-music-title">GEI Music Lab</h3></div><span class="gei-music-count">'+TRACKS.length+' tracks</span></div><div class="gei-music-now"><div class="gei-music-disc" aria-hidden="true">'+icon('<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 4v4M4.8 8l3.5 2M19.2 8l-3.5 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>')+'</div><div class="gei-music-meta"><strong id="geiMusicTitle">'+TRACKS[0].title+'</strong><span id="geiMusicArtist">'+TRACKS[0].artist+'</span></div></div><div class="gei-music-progress"><input id="geiMusicSeek" type="range" min="0" max="1000" value="0" step="1" aria-label="Track progress"><div class="gei-music-times"><span id="geiMusicCurrent">0:00</span><span id="geiMusicDuration">0:00</span></div></div><div class="gei-music-controls"><button type="button" id="geiMusicPrev" aria-label="Previous track">'+icon('<path d="M6 5v14M18 7l-8 5 8 5V7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>')+'</button><button type="button" id="geiMusicPlay" class="gei-music-play" aria-label="Play music">'+icon('<path d="M9 7l8 5-8 5z" fill="currentColor"/>')+'</button><button type="button" id="geiMusicNext" aria-label="Next track">'+icon('<path d="M18 5v14M6 7l8 5-8 5V7z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>')+'</button><button type="button" id="geiMusicMute" aria-label="Mute music">'+icon('<path d="M5 10v4h3l4 3V7l-4 3H5zM16 9l4 6M20 9l-4 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>')+'</button><button type="button" id="geiMusicPlaylist" class="gei-music-list-btn" aria-expanded="false">'+icon('<path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>')+'<span>Playlist</span></button></div><div class="gei-music-playlist" id="geiMusicPlaylistPanel" hidden><div class="gei-music-list-head"><span>Y'all Too Sound Library</span><button id="geiMusicCloseList" type="button" aria-label="Close playlist">×</button></div><div class="gei-music-list" id="geiMusicList"></div></div><audio id="geiMusicAudio" preload="metadata"></audio></section>';
    if(feature&&feature.parentNode===body)body.insertBefore(player,feature.nextSibling);else body.insertBefore(player,body.firstChild);
    var style=document.createElement('style');
    style.textContent=''+
      '#screen-video .gei-music-player{flex:0 0 auto;border:1px solid var(--line);border-radius:20px;background:linear-gradient(145deg,var(--surface),var(--mist));padding:13px;box-shadow:0 12px 26px rgba(13,20,40,.08)}'+
      '#screen-video .gei-music-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:10px}'+
      '#screen-video .gei-music-kicker{display:block;font-size:.56rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--grey)}'+
      '#screen-video .gei-music-title{margin:2px 0 0;font-family:Space Grotesk,sans-serif;font-size:1rem;line-height:1.1}'+
      '#screen-video .gei-music-count{font-size:.58rem;font-weight:800;color:var(--indigo);background:rgba(61,61,234,.08);padding:5px 7px;border-radius:999px;white-space:nowrap}'+
      '#screen-video .gei-music-now{display:flex;align-items:center;gap:10px;margin-bottom:9px}'+
      '#screen-video .gei-music-disc{width:42px;height:42px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--magenta),var(--cyan));box-shadow:0 8px 18px rgba(61,61,234,.2)}'+
      '#screen-video .gei-music-disc svg{width:22px;height:22px}'+
      '#screen-video .gei-music-meta{min-width:0}'+
      '#screen-video .gei-music-meta strong{display:block;font-family:Space Grotesk,sans-serif;font-size:.86rem;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
      '#screen-video .gei-music-meta span{display:block;font-size:.64rem;color:var(--grey);margin-top:2px}'+
      '#screen-video .gei-music-progress input{width:100%;margin:2px 0 0;accent-color:var(--magenta);touch-action:manipulation}'+
      '#screen-video .gei-music-times{display:flex;justify-content:space-between;font-size:.55rem;color:var(--grey);margin-top:-2px}'+
      '#screen-video .gei-music-controls{display:flex;align-items:center;gap:6px;margin-top:7px}'+
      '#screen-video .gei-music-controls button{border:1px solid var(--line);background:var(--surface);color:var(--ink);width:36px;height:36px;border-radius:12px;display:grid;place-items:center;cursor:pointer;touch-action:manipulation}'+
      '#screen-video .gei-music-controls button:active{transform:scale(.94)}'+
      '#screen-video .gei-music-controls button svg{width:18px;height:18px}'+
      '#screen-video .gei-music-controls .gei-music-play{width:44px;height:44px;color:#fff;border-color:transparent;background:linear-gradient(135deg,var(--magenta),var(--cyan));box-shadow:0 7px 14px rgba(61,61,234,.2)}'+
      '#screen-video .gei-music-list-btn{flex:1;display:flex!important;align-items:center;justify-content:center;gap:6px;font-size:.61rem;font-weight:800}'+
      '#screen-video .gei-music-playlist{margin-top:9px;border-top:1px solid var(--line);padding-top:8px}'+
      '#screen-video .gei-music-list-head{display:flex;align-items:center;justify-content:space-between;font-size:.62rem;font-weight:800;margin-bottom:5px}'+
      '#screen-video .gei-music-list-head button{border:0;background:none;font-size:1.2rem;line-height:1;color:var(--grey);cursor:pointer}'+
      '#screen-video .gei-music-list{max-height:230px;overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}'+
      '#screen-video .gei-music-track{width:100%;display:flex;align-items:center;gap:8px;padding:8px 5px;border:0;border-bottom:1px solid var(--line);background:transparent;color:var(--ink);text-align:left;cursor:pointer}'+
      '#screen-video .gei-music-track:last-child{border-bottom:0}'+
      '#screen-video .gei-music-track.is-current{background:rgba(243,16,186,.08);border-radius:10px}'+
      '#screen-video .gei-music-track-num{width:22px;height:22px;flex:0 0 auto;border-radius:7px;display:grid;place-items:center;background:rgba(61,61,234,.1);font-size:.55rem;font-weight:800;color:var(--indigo)}'+
      '#screen-video .gei-music-track-copy{min-width:0}'+
      '#screen-video .gei-music-track-copy strong{display:block;font-size:.65rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
      '#screen-video .gei-music-track-copy span{display:block;font-size:.51rem;color:var(--grey);margin-top:1px}'+
      '@media(prefers-reduced-motion:reduce){#screen-video .gei-music-player *{scroll-behavior:auto}}';
    document.head.appendChild(style);
    var audio=player.querySelector('#geiMusicAudio'),titleEl=player.querySelector('#geiMusicTitle'),artistEl=player.querySelector('#geiMusicArtist'),seek=player.querySelector('#geiMusicSeek'),currentEl=player.querySelector('#geiMusicCurrent'),durationEl=player.querySelector('#geiMusicDuration'),playBtn=player.querySelector('#geiMusicPlay'),muteBtn=player.querySelector('#geiMusicMute'),listBtn=player.querySelector('#geiMusicPlaylist'),panel=player.querySelector('#geiMusicPlaylistPanel'),list=player.querySelector('#geiMusicList'),idx=0;
    function fmt(sec){if(!isFinite(sec)||sec<0)return '0:00';var m=Math.floor(sec/60),s=Math.floor(sec%60);return m+':'+String(s).padStart(2,'0');}
    function renderList(){list.innerHTML=TRACKS.map(function(t,i){return '<button type="button" class="gei-music-track'+(i===idx?' is-current':'')+'" data-index="'+i+'"><span class="gei-music-track-num">'+String(i+1).padStart(2,'0')+'</span><span class="gei-music-track-copy"><strong>'+t.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</strong><span>'+t.artist+'</span></span></button>';}).join('');
      Array.from(list.querySelectorAll('[data-index]')).forEach(function(b){b.addEventListener('click',function(){load(Number(b.dataset.index),true);});});
    }
    function load(i,autoplay){idx=(i+TRACKS.length)%TRACKS.length;var t=TRACKS[idx];audio.src=t.src;titleEl.textContent=t.title;artistEl.textContent=t.artist;seek.value=0;currentEl.textContent='0:00';durationEl.textContent='0:00';renderList();if(autoplay){var p=audio.play();if(p&&p.catch)p.catch(function(){});} }
    function updatePlay(){playBtn.innerHTML=audio.paused?icon('<path d="M9 7l8 5-8 5z" fill="currentColor"/>'):icon('<path d="M8 7h3v10H8zM13 7h3v10h-3z" fill="currentColor"/>');playBtn.setAttribute('aria-label',audio.paused?'Play music':'Pause music');}
    function updateMute(){muteBtn.innerHTML=audio.muted?icon('<path d="M5 10v4h3l4 3V7l-4 3H5zM17 9l4 4M21 9l-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'):icon('<path d="M5 10v4h3l4 3V7l-4 3H5zM16 10c1.6 1 1.6 3 0 4M18 8c3 2 3 6 0 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>');}
    playBtn.addEventListener('click',function(){if(audio.paused){var p=audio.play();if(p&&p.catch)p.catch(function(){});}else audio.pause();});
    player.querySelector('#geiMusicPrev').addEventListener('click',function(){load(idx-1,true);});
    player.querySelector('#geiMusicNext').addEventListener('click',function(){load(idx+1,true);});
    muteBtn.addEventListener('click',function(){audio.muted=!audio.muted;updateMute();});
    seek.addEventListener('input',function(){if(audio.duration)audio.currentTime=(Number(seek.value)/1000)*audio.duration;});
    audio.addEventListener('timeupdate',function(){if(audio.duration){seek.value=Math.round((audio.currentTime/audio.duration)*1000);durationEl.textContent=fmt(audio.duration);}currentEl.textContent=fmt(audio.currentTime);});
    audio.addEventListener('loadedmetadata',function(){durationEl.textContent=fmt(audio.duration);});
    audio.addEventListener('play',updatePlay);audio.addEventListener('pause',updatePlay);audio.addEventListener('ended',function(){load(idx+1,true);});
    listBtn.addEventListener('click',function(){var open=panel.hidden;panel.hidden=!open;listBtn.setAttribute('aria-expanded',String(open));});
    player.querySelector('#geiMusicCloseList').addEventListener('click',function(){panel.hidden=true;listBtn.setAttribute('aria-expanded','false');});
    load(0,false);updatePlay();updateMute();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
