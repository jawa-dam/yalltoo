/* V1.8.8.2 — Portfolio Navigation Recovery */
(function(){
  'use strict';
  function boot(){
    var portfolio=document.getElementById('screen-portfolio');
    if(!portfolio)return;
    if(portfolio.querySelector('.portfolio-nav-recovery'))return;
    var nav=portfolio.querySelector('.nav');
    if(!nav){
      nav=document.createElement('nav');
      nav.className='nav on-portfolio portfolio-nav-recovery';
      nav.setAttribute('aria-label','Primary');
      nav.innerHTML='<a href="#" class="menu-item"><svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke-width="2" stroke-linecap="round"/></svg><span>Start</span></a><a href="#" class="portfolio-item active"><svg viewBox="0 0 24 24" fill="none"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" stroke-width="1.8" stroke-linejoin="round"/></svg><span>Portfolio</span></a><a href="#" class="support-item"><svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v12H4zM8 21h8M12 17v4" stroke-width="1.8"/></svg><span>Support</span></a><a class="cart-link" href="https://www.yalltoo.com/gei-discovery-guide-" target="_blank" rel="noopener" aria-label="Shop GEI Discovery Guide"><svg class="cart" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 1.9-1.4L20 8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg><span>Shop</span></a>';
      portfolio.appendChild(nav);
    }else{
      nav.classList.add('on-portfolio','portfolio-nav-recovery');
      var shop=nav.querySelector('.cart-link');
      if(!shop)nav.insertAdjacentHTML('beforeend','<a class="cart-link" href="https://www.yalltoo.com/gei-discovery-guide-" target="_blank" rel="noopener" aria-label="Shop GEI Discovery Guide"><svg class="cart" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 1.9-1.4L20 8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg><span>Shop</span></a>');
      var p=nav.querySelector('.portfolio-item');
      if(p)p.classList.add('active');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
