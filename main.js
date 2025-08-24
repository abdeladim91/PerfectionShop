  // --------- Sample Data (replace with your own later) ----------
  const PRODUCTS = [
    {id:1, title:'Running Sneakers', category:'Shoes', price:69.00, image:'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop', desc:'Lightweight sport sneakers with breathable mesh.'},
    {id:2, title:'Casual T-Shirt', category:'Clothing', price:19.50, image:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop', desc:'Soft cotton tee. Regular fit.'},
    {id:3, title:'Wireless Headphones', category:'Electronics', price:129.00, image:'https://images.unsplash.com/photo-1637780852590-8ab27248ec41?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc:'Noise-isolating, 30h battery life.'},
    {id:4, title:'Backpack', category:'Bags', price:49.90, image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', desc:'Water-resistant everyday backpack.'},
    {id:5, title:'Smart Watch', category:'Electronics', price:179.00, image:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc:'Fitness tracking, notifications, heart-rate.'},
    {id:6, title:'Hoodie', category:'Clothing', price:39.00, image:'https://images.unsplash.com/photo-1636831990680-0d088e4cd83c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc:'Cozy fleece hoodie with front pocket.'},
    {id:7, title:'Leather Wallet', category:'Accessories', price:29.00, image:'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc:'Minimal slim wallet.'},
    {id:8, title:'Sunglasses', category:'Accessories', price:24.00, image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop', desc:'UV400 protection polarized lenses.'},
    {id:9, title:'Travel Mug', category:'Home', price:14.90, image:'https://images.unsplash.com/photo-1557344229-de2faa179661?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc:'Insulated stainless steel mug 350ml.'},
    {id:10,title:'Bluetooth Speaker', category:'Electronics', price:59.00, image:'https://plus.unsplash.com/premium_photo-1677159499898-b061fb5bd2d7?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc:'Compact, waterproof, powerful sound.'},
    {id:11,title:'Running Shorts', category:'Clothing', price:21.00, image:'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?q=80&w=1200&auto=format&fit=crop', desc:'Breathable lightweight shorts.'},
    {id:12,title:'Laptop Sleeve', category:'Bags', price:17.50, image:'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop', desc:'Padded sleeve up to 15-inch.'},
  ];
  // -------------------------------------------------------------

  // DOM refs
  const grid = document.getElementById('grid');
  const q = document.getElementById('q');
  const statusBox = document.getElementById('status');
  const cardTpl = document.getElementById('cardTpl');
  const cartItemTpl = document.getElementById('cartItemTpl');
  const cartCount = document.getElementById('cartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  const openCartBtn = document.getElementById('openCart');
  const closeCartBtn = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('subtotal');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');

  // State
  const STORAGE_KEY = 'demo_cart_v1';
  let cart = loadCart();             // { [id]: qty }
  let filters = { q:'', cat:'all' };


  // Render products
  function render(){
    const s = filters.q.toLowerCase();
    const cat = filters.cat;
    const items = PRODUCTS.filter(p =>
      (cat==='all' || p.category===cat) &&
      (p.title.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s))
    );
    grid.innerHTML = '';
    if(items.length===0){
      status('No products found. Try another search.', 'info');
    } else {
      clearStatus(items);
    }


    items.forEach(p=>{
      const node = cardTpl.content.cloneNode(true);
      const img = node.querySelector('img');
      img.src = p.image; img.alt = p.title;
      node.querySelector('h3').textContent = p.title;
      node.querySelector('p').textContent = p.desc;
      node.querySelector('span.font-bold').textContent = formatPrice(p.price);
      const btn = node.querySelector('.addBtn');
      btn.addEventListener('click', ()=> addToCart(p.id));
      grid.appendChild(node);
    });
  }

  // Search & filter events
  q.addEventListener('input', e=>{ filters.q = e.target.value; render(); });
  // Category links
    document.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const cat = link.getAttribute('data-cat');
        filters.cat = cat;
        render();
        document.getElementById('grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
     
    });
    });


  // Cart ops
  function addToCart(id){
    cart[id] = (cart[id]||0) + 1;
    saveCart(); updateBadge(); openCart(); renderCart();
  }
  function decCart(id){
    if(!cart[id]) return;
    cart[id] -= 1; if(cart[id]<=0) delete cart[id];
    saveCart(); updateBadge(); renderCart();
  }
  function removeFromCart(id){
    delete cart[id]; saveCart(); updateBadge(); renderCart();
  }
  function loadCart(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch{ return {}; }
  }
  function saveCart(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
  function updateBadge(){
    const totalQty = Object.values(cart).reduce((a,b)=>a+b,0);
    cartCount.textContent = totalQty;
  }
  function renderCart(){
    cartItemsEl.innerHTML = '';
    const entries = Object.entries(cart);
    let subtotal = 0;

    if(entries.length===0){
      cartItemsEl.innerHTML = `<p class="text-white/70">Your cart is empty.</p>`;
    }

    entries.forEach(([id, qty])=>{
      const p = PRODUCTS.find(x=>x.id==id);
      const node = cartItemTpl.content.cloneNode(true);
      node.querySelector('img').src = p.image;
      node.querySelector('img').alt = p.title;
      node.querySelector('h4').textContent = p.title;
      node.querySelector('.text-sm').textContent = p.category;
      node.querySelector('.qty').textContent = qty;
      node.querySelector('.price').textContent = formatPrice(p.price * qty);

      node.querySelector('.qtyInc').addEventListener('click', ()=> { addToCart(p.id); });
      node.querySelector('.qtyDec').addEventListener('click', ()=> { decCart(p.id); });
      node.querySelector('.rmBtn').addEventListener('click', ()=> { removeFromCart(p.id); });

      subtotal += p.price * qty;
      cartItemsEl.appendChild(node);
    });

    subtotalEl.textContent = formatPrice(subtotal);
  }
  function formatPrice(n){ return '$' + n.toFixed(2); }

  // Drawer controls
  function openCart(){
    cartDrawer.classList.remove('translate-x-full');
    overlay.classList.remove('pointer-events-none');
    overlay.classList.add('opacity-100');
    renderCart();
  }
  function closeCart(){
    cartDrawer.classList.add('translate-x-full');
    overlay.classList.add('pointer-events-none');
    overlay.classList.remove('opacity-100');
  }
  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  // Clear & checkout
  clearCartBtn.addEventListener('click', ()=>{ cart = {}; saveCart(); updateBadge(); renderCart(); });
  checkoutBtn.addEventListener('click', ()=>{
    alert('Demo checkout: implement your flow here.');
  });

  // Status helpers
  function status(msg,type='info'){
    statusBox.textContent = msg;
    statusBox.classList.remove('hidden');
  }
  function clearStatus(){ statusBox.classList.add('hidden'); }

  // Boot
  render(); updateBadge(); renderCart();




    // --------- GSAP ANIMATIONS ----------
    
    // gsap.fromTo('#whyUs', {x:-200, opacity: 0}, {x:0, rotation:0, opacity: 1, duration:3, delay: 1, scrollTrigger: {
    // trigger: '#whyUs',start: 'top 50%'}});
    // gsap.fromTo('.line', {y:200, opacity: 0}, {y:0, rotation:0, opacity: 1, duration:1, scrollTrigger: {
    // trigger: '.line',start: 'top 50%'}});
    // gsap.fromTo('.cause1', {x:-200, opacity: 0}, {x:0, rotation:0, opacity: 1, duration:3, delay: 2, scrollTrigger: {
    // trigger: '.cause1',start: 'top 50%'}});
    // gsap.fromTo('.cause2', {x:-200, opacity: 0}, {x:0, rotation:0, opacity: 1, duration:3, delay: 3, scrollTrigger: {
    // trigger: '.cause1',start: 'top 50%'}});
    // gsap.fromTo('.cause3', {x:-200, opacity: 0}, {x:0, rotation:0, opacity: 1, duration:3, delay: 4, scrollTrigger: {
    // trigger: '.cause1',start: 'top 50%'}});

    // GSAP + ScrollTrigger
// GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// helper to rewind so it can replay on re-enter
const rewind = {
  onLeave:     self => self.animation.progress(0).pause(),
  onLeaveBack: self => self.animation.progress(0).pause()
};


gsap.fromTo('#whyUs',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 1,
    scrollTrigger: {
      trigger: '#whyUs',      
      start: 'top 75%',
      toggleActions: 'restart none restart none',
      invalidateOnRefresh: true,
      ...rewind
    }
  }
);

gsap.fromTo('#Categ',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 1,
    scrollTrigger: {
      trigger: '#Categ',      
      start: 'top 75%',
      toggleActions: 'restart none restart none',
      invalidateOnRefresh: true,
      ...rewind
    }
  }
);

gsap.utils.toArray('.line').forEach(el => {
  gsap.fromTo(el,
    { y: 200, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'restart none restart none',
        ...rewind
      }
    }
  );
});


gsap.fromTo('.cause1',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 2,
    scrollTrigger: {
      trigger: '.cause1',
      start: 'top 80%',
      toggleActions: 'restart none restart none',
      ...rewind
    }
  }
);

gsap.fromTo('.cause2',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 3,
    scrollTrigger: {
      trigger: '.cause1',            // <-- fixed (was .cause1)
      start: 'top 80%',
      toggleActions: 'restart none restart none',
      ...rewind
    }
  }
);

gsap.fromTo('.cause3',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 4,
    scrollTrigger: {
      trigger: '.cause1',            // <-- fixed (was .cause1)
      start: 'top 80%',
      toggleActions: 'restart none restart none',
      ...rewind
    }
  }
);


gsap.fromTo('.tile1',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3,
    scrollTrigger: {
      trigger: '.tile1',
      start: 'top 80%',
      toggleActions: 'restart none restart none',
      ...rewind
    }
  }
);

gsap.fromTo('.tile2',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 1,
    scrollTrigger: {
      trigger: '.tile1',            // <-- fixed (was .cause1)
      start: 'top 80%',
      toggleActions: 'restart none restart none',
      ...rewind
    }
  }
);

gsap.fromTo('.tile3',
  { x: -200, opacity: 0 },
  {
    x: 0, opacity: 1, duration: 3, delay: 2,
    scrollTrigger: {
      trigger: '.tile1',            // <-- fixed (was .cause1)
      start: 'top 80%',
      toggleActions: 'restart none restart none',
      ...rewind
    }
  }
);

// keep triggers accurate after images/fonts load
window.addEventListener('load', () => ScrollTrigger.refresh());






    // --- Testimonials carousel ---
(() => {
  const track = document.getElementById('tTrack');
  if (!track) return; // page safety

  const slides = Array.from(track.children);
  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  const dots = Array.from(document.querySelectorAll('#tDots button'));
  const section = document.getElementById('testimonials');

  let idx = 0;
  function goTo(i) {
    idx = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, j) => d.classList.toggle('bg-orange-500', j === idx));
    dots.forEach((d, j) => d.classList.toggle('bg-stone-300', j !== idx));
  }

  prev.addEventListener('click', () => goTo(idx - 1));
  next.addEventListener('click', () => goTo(idx + 1));
  dots.forEach((d, j) => d.addEventListener('click', () => goTo(j)));

  // autoplay (pause on hover)
  let timer = setInterval(() => goTo(idx + 1), 5000);
  section.addEventListener('mouseenter', () => clearInterval(timer));
  section.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(idx + 1), 5000);
  });

  goTo(0);
})();
    // -----------------------------------


 