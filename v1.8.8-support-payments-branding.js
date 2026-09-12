/* V1.8.8 — Support Payments + Branding Recovery */
(function(){
  'use strict';
  function boot(){
    var support=document.getElementById('screen-support');
    if(!support)return;
    var css=document.createElement('style');
    css.textContent='.gei-support-payments{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.gei-support-pay{display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px 12px;border-radius:14px;text-decoration:none;color:#fff;font-weight:800;font-size:.76rem;text-align:center;box-shadow:0 8px 18px rgba(0,0,0,.12);transition:transform .2s ease,filter .2s ease}.gei-support-pay:active{transform:scale(.97);filter:brightness(.96)}.gei-support-pay.paypal{background:linear-gradient(135deg,var(--indigo),var(--cyan))}.gei-support-pay.cashapp{background:linear-gradient(135deg,var(--magenta),var(--pink))}@media(max-width:350px){.gei-support-payments{grid-template-columns:1fr}}';
    document.head.appendChild(css);
    var logo='https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-logo-vq2GKHxbTzr7g8bO.png';
    document.querySelectorAll('.gei-yalltoo-logo').forEach(function(img){img.src=logo;});
    function addLogo(container,extra){if(!container||container.querySelector('.gei-yalltoo-logo'))return;var img=document.createElement('img');img.className='gei-yalltoo-logo'+(extra?' '+extra:'');img.src=logo;img.alt='YallToo';img.decoding='async';img.loading='eager';container.insertBefore(img,container.firstChild);}
    addLogo(document.querySelector('.splash-copy'),'splash');
    addLogo(document.querySelector('#screen-menu .banner'));
    addLogo(document.querySelector('#screen-portfolio .banner'));
    addLogo(document.querySelector('#screen-support .banner'));
    var body=document.querySelector('#screen-support .support-body');
    if(body&&!document.getElementById('geiSupportPayments')){
      var card=document.createElement('div');card.className='support-card';card.id='geiSupportPayments';
      card.innerHTML='<div class="support-card-icon fund"><svg viewBox="0 0 24 24" fill="none"><path d="M12 4v16M8 8.5C8 6.6 9.6 5 12 5s4 1.4 4 3.5S14.2 12 12 12s-4 1.5-4 3.5S9.6 19 12 19s4-1.4 4-3.5" stroke-width="1.8" stroke-linecap="round"/></svg></div><h2 class="support-card-title">Support GEI Directly</h2><p class="support-card-body">Choose a direct support method to help fund the research, curriculum, and interactive tools.</p><div class="gei-support-payments"><a class="gei-support-pay paypal" href="https://www.paypal.com/ncp/payment/YCVQWR87ZEBFJ" target="_blank" rel="noopener">Support with PayPal</a><a class="gei-support-pay cashapp" href="https://cash.app/$1oh1" target="_blank" rel="noopener">Support with Cash App</a></div>';
      body.appendChild(card);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
