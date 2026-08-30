/* ==================== DATA ==================== */
const IMG = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=70`;
const PRODUCTS = [
  {id:1,  name:'Cloud Nine Baby Blanket',        cat:'Blankets',  price:48, rating:4.9, reviews:132, tag:'Bestseller', img:IMG('photo-1584992236310-6edddc08acff'), seed:'blankey'},
  {id:2,  name:'Sunny the Sunflower Plushie',    cat:'Plushies',  price:22, rating:4.8, reviews:96,  tag:'New',        img:IMG('photo-1615486511484-92e172cc4fe0'), seed:'sunflower'},
  {id:3,  name:'Lavender Dreams Coaster Set',    cat:'Home',      price:16, rating:4.7, reviews:58,  tag:'',           img:IMG('photo-1544787219-7f47ccb76574'), seed:'coaster'},
  {id:4,  name:'Strawberry Kiss Beanie',         cat:'Wearables', price:28, rating:4.8, reviews:74,  tag:'',           img:IMG('photo-1576871337622-98d48d1cf531'), seed:'beanie'},
  {id:5,  name:'Boo the Bunny Amigurumi',        cat:'Plushies',  price:26, rating:5.0, reviews:141, tag:'Bestseller', img:IMG('photo-1615484477778-ca3b77940c25'), seed:'bunny'},
  {id:6,  name:'Mint Wave Market Tote',          cat:'Bags',      price:34, rating:4.6, reviews:63,  tag:'',           img:IMG('photo-1591561954557-26941169b49e'), seed:'tote'},
  {id:7,  name:'Rainbow Dreams Nursery Mobile',  cat:'Nursery',   price:52, rating:4.9, reviews:87,  tag:'',           img:IMG('photo-1519689680058-324335c77eba'), seed:'mobile'},
  {id:8,  name:'Daisy Granny Square Cardigan',   cat:'Wearables', price:68, rating:4.8, reviews:45,  tag:'Limited',    img:IMG('photo-1620799140408-edc6dcb6d633'), seed:'cardigan'},
  {id:9,  name:'Pippa the Penguin Keychain',     cat:'Plushies',  price:12, rating:4.7, reviews:110, tag:'',           img:IMG('photo-1511556820780-d912e42b4980'), seed:'penguin'},
  {id:10, name:'Sage Nesting Baskets (Set of 3)',cat:'Home',      price:44, rating:4.8, reviews:52,  tag:'',           img:IMG('photo-1586023492125-27b2c045efd7'), seed:'basket'},
  {id:11, name:'Peach Blossom Infinity Scarf',   cat:'Wearables', price:38, rating:4.9, reviews:69,  tag:'New',        img:IMG('photo-1607344645866-009c320b63e0'), seed:'scarf'},
  {id:12, name:'Little Cloud Nursery Pillow',    cat:'Nursery',   price:30, rating:4.7, reviews:41,  tag:'',           img:IMG('photo-1490481651871-ab68de25d43d'), seed:'pillow'}
];
const CATS = ['All','Wearables','Plushies','Home','Nursery','Bags','Blankets'];
const TESTI = [
  {q:'"The baby blanket I ordered is the softest thing I have ever felt. You can tell every single stitch was made with love."', name:'Emma R.', role:'Verified buyer', init:'ER', color:'bg-blush-400'},
  {q:'"My daughter has not put her bunny down since it arrived. The quality is unbelievable for something handmade."', name:'Priya S.', role:'Verified buyer', init:'PS', color:'bg-sage-400'},
  {q:'"Beautiful colours, quick shipping, and the sweetest handwritten note inside the package. Ordering again for sure!"', name:'Dana M.', role:'Verified buyer', init:'DM', color:'bg-lilac-300'}
];
const FREE_SHIP = 60, SHIP_FEE = 6;

let cart = JSON.parse(localStorage.getItem('lb_cart')||'[]').filter(i=>PRODUCTS.some(p=>p.id===i.id));
let wish = new Set();
let activeCat = 'All', searchTerm = '', tIdx = 0, payMethod = 'card';

const $ = id => document.getElementById(id);
const fb = seed => `onerror="this.onerror=null;this.src='https://picsum.photos/seed/${seed}/700/700';"`;
const money = n => '$' + n.toFixed(2);

function stars(r){
  let h='';
  for(let i=1;i<=5;i++) h+=`<svg class="w-3.5 h-3.5 ${i<=Math.round(r)?'text-honey':'text-blush-200'}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.3 4a1 1 0 0 0 .95.69h4.2c.97 0 1.37 1.24.59 1.81l-3.4 2.47a1 1 0 0 0-.36 1.12l1.3 4c.3.92-.76 1.69-1.54 1.12l-3.4-2.47a1 1 0 0 0-1.18 0l-3.4 2.47c-.78.57-1.84-.2-1.54-1.12l1.3-4a1 1 0 0 0-.36-1.12L2 9.43c-.78-.57-.38-1.81.6-1.81h4.2a1 1 0 0 0 .94-.69l1.3-4Z"/></svg>`;
  return h;
}
function totals(){
  const sub = cart.reduce((s,i)=>s + PRODUCTS.find(p=>p.id===i.id).price * i.qty, 0);
  const ship = sub===0 ? 0 : (sub>=FREE_SHIP ? 0 : SHIP_FEE);
  return {sub, ship, total: sub+ship};
}

/* ==================== TOAST ==================== */
function toast(msg){
  const t=document.createElement('div');
  t.className='toast bg-sage-500 text-white';
  t.innerHTML=`<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg><span>${msg}</span>`;
  $('toastWrap').appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),320)},2400);
}

/* ==================== AUTH ==================== */
function authTab(mode){
  const login=$('authTabLogin'), signup=$('authTabSignup');
  if(mode==='login'){
    login.classList.add('bg-white','shadow-sm','text-blush-600'); login.classList.remove('text-cocoa-400');
    signup.classList.remove('bg-white','shadow-sm','text-blush-600'); signup.classList.add('text-cocoa-400');
    $('loginForm').classList.remove('hidden'); $('signupForm').classList.add('hidden');
  } else {
    signup.classList.add('bg-white','shadow-sm','text-blush-600'); signup.classList.remove('text-cocoa-400');
    login.classList.remove('bg-white','shadow-sm','text-blush-600'); login.classList.add('text-cocoa-400');
    $('signupForm').classList.remove('hidden'); $('loginForm').classList.add('hidden');
  }
  $('loginErr').classList.add('hidden'); $('suErr').classList.add('hidden');
}
function togglePass(inputId, btn){
  const i=$(inputId), isPw = i.type==='password';
  i.type = isPw ? 'text' : 'password';
  btn.innerHTML = isPw
    ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><path stroke-linecap="round" d="M3 3l18 18"/></svg>'
    : '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}
function getUsers(){ return JSON.parse(localStorage.getItem('lb_users')||'[]'); }
function saveUsers(u){ localStorage.setItem('lb_users', JSON.stringify(u)); }
function session(){ try{return JSON.parse(localStorage.getItem('lb_session'));}catch(e){return null;} }

function doSignup(e){
  e.preventDefault();
  const name=$('suName').value.trim(), email=$('suEmail').value.trim().toLowerCase(), pass=$('suPass').value;
  const err=$('suErr');
  ['suName','suEmail','suPass'].forEach(id=>$(id).classList.remove('invalid'));
  if(!name){ $('suName').classList.add('invalid'); err.textContent='Please tell me your name!'; err.classList.remove('hidden'); return; }
  if(!/^\S+@\S+\.\S+$/.test(email)){ $('suEmail').classList.add('invalid'); err.textContent='That email looks a little tangled — please check it.'; err.classList.remove('hidden'); return; }
  if(pass.length<6){ $('suPass').classList.add('invalid'); err.textContent='Password needs at least 6 characters.'; err.classList.remove('hidden'); return; }
  const users=getUsers();
  if(users.find(u=>u.email===email)){ err.textContent='An account with this email already exists — try logging in.'; err.classList.remove('hidden'); return; }
  users.push({name,email,pass}); saveUsers(users);
  localStorage.setItem('lb_session', JSON.stringify({name,email}));
  enterApp(); toast(`Welcome to the cozy club, ${name.split(' ')[0]}!`);
}
function doLogin(e){
  e.preventDefault();
  const email=$('loginEmail').value.trim().toLowerCase(), pass=$('loginPass').value;
  const err=$('loginErr');
  ['loginEmail','loginPass'].forEach(id=>$(id).classList.remove('invalid'));
  if(!/^\S+@\S+\.\S+$/.test(email)){ $('loginEmail').classList.add('invalid'); err.textContent='Please enter a valid email.'; err.classList.remove('hidden'); return; }
  if(!pass){ $('loginPass').classList.add('invalid'); err.textContent='Please enter your password.'; err.classList.remove('hidden'); return; }
  const u=getUsers().find(u=>u.email===email && u.pass===pass);
  if(!u){ err.textContent='No account found with those details — check your email and password.'; err.classList.remove('hidden'); return; }
  localStorage.setItem('lb_session', JSON.stringify({name:u.name,email:u.email}));
  enterApp(); toast(`Welcome back, ${u.name.split(' ')[0]}!`);
}
function enterApp(){
  const s=session(); if(!s) return;
  $('authPage').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('navUserName').textContent = s.name.split(' ')[0];
  showPage('home'); updateCartBadge();
}
function logout(){
  localStorage.removeItem('lb_session');
  $('app').classList.add('hidden');
  $('authPage').classList.remove('hidden');
  authTab('login'); $('loginForm').reset(); $('signupForm').reset();
  toast('Logged out — see you soon!');
}

/* ==================== NAVIGATION ==================== */
function showPage(name){
  if(name==='payment' && cart.length===0){ showPage('cart'); toast('Your basket is empty'); return; }
  document.querySelectorAll('.app-page').forEach(s=>s.classList.add('hidden'));
  const el=$('page-'+name);
  el.classList.remove('hidden');
  el.classList.remove('page-enter'); void el.offsetWidth; el.classList.add('page-enter');
  window.scrollTo({top:0});
  document.querySelectorAll('#desktopNav .nav-link').forEach(a=>a.classList.toggle('active', a.dataset.nav===name));
  if(name==='cart') renderCart();
  if(name==='payment'){ resetPayView(); renderPaySummary(); }
  closeMobileMenu();
}
function toggleMobileMenu(){
  const m=$('mobileMenu'); m.classList.toggle('hidden');
  $('hamburger').innerHTML = m.classList.contains('hidden')
    ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 6h18M3 12h18M3 18h18"/></svg>'
    : '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M18 6L6 18M6 6l12 12"/></svg>';
}
function closeMobileMenu(){ $('mobileMenu').classList.add('hidden'); $('hamburger').innerHTML='<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 6h18M3 12h18M3 18h18"/></svg>'; }

/* ==================== PRODUCTS ==================== */
function tagClass(t){
  return t==='Bestseller' ? 'bg-blush-500 text-white' : t==='New' ? 'bg-sage-500 text-white' : 'bg-cocoa-500 text-white';
}
function productCard(p){
  const on = wish.has(p.id);
  return `
  <div class="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 border border-blush-100/70">
    <div class="relative aspect-square overflow-hidden bg-blush-100">
      <img src="${p.img}" ${fb(p.seed)} alt="${p.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
      ${p.tag?`<span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${tagClass(p.tag)} shadow-sm">${p.tag}</span>`:''}
      <button onclick="toggleWish(${p.id},this)" aria-label="Save to wishlist" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition">
        <svg class="w-4.5 h-4.5 w-5 h-5 ${on?'text-blush-500':'text-cocoa-400/40'}" fill="${on?'currentColor':'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
    </div>
    <div class="p-4 md:p-5">
      <div class="flex items-center gap-1 mb-1.5">${stars(p.rating)}<span class="text-[11px] text-cocoa-400 ml-1 font-bold">(${p.reviews})</span></div>
      <h3 class="font-display font-bold text-cocoa-700 leading-snug text-sm md:text-base">${p.name}</h3>
      <p class="text-[11px] text-cocoa-400 font-bold uppercase tracking-wide mt-0.5 mb-3">${p.cat}</p>
      <div class="flex items-center justify-between gap-2">
        <span class="font-display font-bold text-blush-600 text-lg">${money(p.price)}</span>
        <button onclick="addToCart(${p.id},this)" class="px-3.5 md:px-4 py-2 rounded-full bg-blush-500 text-white text-xs md:text-sm font-extrabold hover:bg-blush-600 active:scale-95 transition flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>Add
        </button>
      </div>
    </div>
  </div>`;
}
function buildPills(){
  $('catPills').innerHTML = CATS.map(c=>`<button class="pill ${c===activeCat?'active':''}" data-cat="${c}" onclick="setCat('${c}')">${c}</button>`).join('');
}
function updatePills(){
  document.querySelectorAll('#catPills .pill').forEach(b=>b.classList.toggle('active', b.dataset.cat===activeCat));
}
function setCat(c){ activeCat=c; updatePills(); renderProducts(); }
function goCat(c){ activeCat=c; searchTerm=''; $('searchInput').value=''; updatePills(); renderProducts(); showPage('products'); }
function onSearch(v){ searchTerm=v; renderProducts(); }
function renderProducts(){
  const list = PRODUCTS.filter(p => (activeCat==='All'||p.cat===activeCat) && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  $('productGrid').innerHTML = list.length
    ? list.map(productCard).join('')
    : `<div class="col-span-full text-center py-16">
         <svg viewBox="0 0 48 48" class="w-16 h-16 mx-auto mb-4 opacity-70"><circle cx="24" cy="24" r="18" fill="#F0CED8"/><path d="M9 20c8-6 22-6 30 0M8 27c9 7 23 7 32 0" stroke="#FBF1F3" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>
         <p class="font-display font-bold text-xl text-cocoa-700 mb-1">No cozy things found</p>
         <p class="text-sm font-semibold text-cocoa-400">Try a different search or category.</p>
       </div>`;
  $('resultCount').textContent = list.length ? `${list.length} cozy ${list.length===1?'piece':'pieces'}` : '';
}
function renderFeatured(){
  $('featuredGrid').innerHTML = [5,1,11,7].map(id=>productCard(PRODUCTS.find(p=>p.id===id))).join('');
}
function toggleWish(id, btn){
  if(wish.has(id)){ wish.delete(id); toast('Removed from wishlist'); }
  else { wish.add(id); toast('Saved to your wishlist'); }
  const on = wish.has(id);
  const s = btn.querySelector('svg');
  s.classList.toggle('text-blush-500', on);
  s.classList.toggle('text-cocoa-400/40', !on);
  s.setAttribute('fill', on?'currentColor':'none');
}

/* ==================== CART ==================== */
function saveCart(){ localStorage.setItem('lb_cart', JSON.stringify(cart)); }
function cartCount(){ return cart.reduce((s,i)=>s+i.qty,0); }
function updateCartBadge(){
  const n=cartCount(), b=$('cartBadge');
  if(n===0){ b.classList.add('hidden'); } else { b.classList.remove('hidden'); b.textContent=n; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  const mm=$('mmCartCount'); if(mm) mm.textContent=n;
}
function addToCart(id, btn){
  const item=cart.find(i=>i.id===id);
  if(item) item.qty++; else cart.push({id, qty:1});
  saveCart(); updateCartBadge();
  toast('Added to your basket');
  if(btn){
    const orig=btn.innerHTML;
    btn.innerHTML='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5"/></svg>Added';
    btn.classList.add('!bg-sage-500');
    setTimeout(()=>{btn.innerHTML=orig; btn.classList.remove('!bg-sage-500');},1100);
  }
}
function changeQty(id, d){
  const item=cart.find(i=>i.id===id); if(!item) return;
  item.qty+=d;
  if(item.qty<=0){ removeFromCart(id); return; }
  saveCart(); renderCart(); updateCartBadge();
}
function removeFromCart(id){
  cart=cart.filter(i=>i.id!==id);
  saveCart(); renderCart(); updateCartBadge();
  toast('Removed from basket');
}
function renderCart(){
  const has = cart.length>0;
  $('cartEmpty').classList.toggle('hidden', has);
  $('cartContent').classList.toggle('hidden', !has);
  if(!has) return;
  $('cartItems').innerHTML = cart.map(i=>{
    const p=PRODUCTS.find(x=>x.id===i.id);
    return `
    <div class="bg-white rounded-3xl border border-blush-100 shadow-soft p-4 flex gap-4 items-center">
      <img src="${p.img}" ${fb(p.seed)} class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-blush-100 shrink-0" alt="${p.name}">
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-display font-bold text-cocoa-700 text-sm sm:text-base truncate">${p.name}</h3>
            <p class="text-xs font-bold text-cocoa-400 mt-0.5">${money(p.price)} each</p>
          </div>
          <button onclick="removeFromCart(${p.id})" aria-label="Remove" class="p-2 rounded-full text-cocoa-400 hover:text-blush-600 hover:bg-blush-50 transition shrink-0">
            <svg class="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>
          </button>
        </div>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-1 bg-blush-50 rounded-full p-1">
            <button onclick="changeQty(${p.id},-1)" class="w-8 h-8 rounded-full bg-white text-cocoa-600 font-extrabold flex items-center justify-center shadow-sm hover:text-blush-500 active:scale-90 transition" aria-label="Decrease"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" d="M5 12h14"/></svg></button>
            <span class="w-8 text-center font-extrabold text-sm text-cocoa-700">${i.qty}</span>
            <button onclick="changeQty(${p.id},1)" class="w-8 h-8 rounded-full bg-white text-cocoa-600 font-extrabold flex items-center justify-center shadow-sm hover:text-blush-500 active:scale-90 transition" aria-label="Increase"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg></button>
          </div>
          <span class="font-display font-bold text-blush-600 text-lg">${money(p.price*i.qty)}</span>
        </div>
      </div>
    </div>`;
  }).join('');
  const {sub,ship,total}=totals();
  const remaining=Math.max(0, FREE_SHIP-sub);
  $('shipBar').style.width = Math.min(100, sub/FREE_SHIP*100)+'%';
  $('shipText').textContent = remaining>0
    ? `You're ${money(remaining)} away from free shipping!`
    : `You've unlocked free shipping — yay!`;
  $('cartSub').textContent=money(sub);
  $('cartShip').innerHTML = ship===0 ? '<span class="text-sage-500">Free</span>' : money(ship);
  $('cartTotal').textContent=money(total);
}

/* ==================== PAYMENT ==================== */
function setMethod(m){
  payMethod=m;
  $('optCard').classList.toggle('selected', m==='card');
  $('optCod').classList.toggle('selected', m==='cod');
  $('cardFields').classList.toggle('hidden', m!=='card');
  $('codNote').classList.toggle('hidden', m==='card');
}
function renderPaySummary(){
  $('paySummary').innerHTML = cart.map(i=>{
    const p=PRODUCTS.find(x=>x.id===i.id);
    return `
    <div class="flex items-center gap-3">
      <img src="${p.img}" ${fb(p.seed)} class="w-14 h-14 rounded-xl object-cover bg-blush-100 shrink-0" alt="${p.name}">
      <div class="min-w-0 flex-1">
        <p class="font-bold text-sm text-cocoa-700 truncate">${p.name}</p>
        <p class="text-xs font-bold text-cocoa-400">Qty ${i.qty} &times; ${money(p.price)}</p>
      </div>
      <span class="font-extrabold text-sm text-cocoa-700">${money(p.price*i.qty)}</span>
    </div>`;
  }).join('');
  const {sub,ship,total}=totals();
  $('paySub').textContent=money(sub);
  $('payShip').innerHTML = ship===0 ? '<span class="text-sage-500">Free</span>' : money(ship);
  $('payTotal').textContent=money(total);
  $('payBtnLabel').textContent = (payMethod==='card' ? 'Pay ' : 'Place order — ') + money(total);
}
function resetPayView(){
  $('payContent').classList.remove('hidden');
  $('paySteps').classList.remove('hidden');
  $('confirmBlock').classList.add('hidden');
}
function markIfEmpty(id){ const el=$(id); const ok=el.value.trim()!==''; el.classList.toggle('invalid',!ok); return ok; }
function placeOrder(e){
  e.preventDefault();
  let ok=true;
  ['shName','shAddr','shCity','shZip'].forEach(id=>{ if(!markIfEmpty(id)) ok=false; });
  const email=$('shEmail');
  if(!/^\S+@\S+\.\S+$/.test(email.value.trim())){ email.classList.add('invalid'); ok=false; } else email.classList.remove('invalid');
  if(!markIfEmpty('shPhone')) ok=false;
  if($('shCountry').value===''){ $('shCountry').classList.add('invalid'); ok=false; } else $('shCountry').classList.remove('invalid');
  if(payMethod==='card'){
    if(!markIfEmpty('ccName')) ok=false;
    const digits=$('ccNum').value.replace(/\D/g,'');
    $('ccNum').classList.toggle('invalid', digits.length<15); if(digits.length<15) ok=false;
    const expOk=/^\d{2}\/\d{2}$/.test($('ccExp').value) && +$('ccExp').value.slice(0,2)>=1 && +$('ccExp').value.slice(0,2)<=12;
    $('ccExp').classList.toggle('invalid',!expOk); if(!expOk) ok=false;
    const cvcOk=/^\d{3,4}$/.test($('ccCvc').value);
    $('ccCvc').classList.toggle('invalid',!cvcOk); if(!cvcOk) ok=false;
  }
  if(!ok){ toast('Please check the highlighted fields'); return; }

  const btn=$('payBtn');
  btn.disabled=true;
  btn.innerHTML='<span class="spinner"></span><span>Processing your order...</span>';
  setTimeout(completeOrder, 1800);
}
function completeOrder(){
  const s=session();
  const {total}=totals();
  const orderNum='LB-'+Math.random().toString(36).slice(2,7).toUpperCase();
  $('cfName').textContent = s ? s.name.split(' ')[0] : 'friend';
  $('cfEmail').textContent = $('shEmail').value;
  $('cfOrder').textContent = orderNum;
  $('cfTotal').textContent = money(total);
  $('cfDate').textContent = new Date(Date.now()+6*864e5).toLocaleDateString(undefined,{weekday:'long', month:'long', day:'numeric'});
  $('payContent').classList.add('hidden');
  $('paySteps').classList.add('hidden');
  $('confirmBlock').classList.remove('hidden');
  $('confirmBlock').classList.remove('page-enter'); void $('confirmBlock').offsetWidth; $('confirmBlock').classList.add('page-enter');
  cart=[]; saveCart(); updateCartBadge();
  confetti();
  window.scrollTo({top:0});
}
function continueShopping(){
  $('payForm').reset();
  setMethod('card');
  document.querySelectorAll('.field.invalid').forEach(f=>f.classList.remove('invalid'));
  const btn=$('payBtn');
  btn.disabled=false;
  btn.innerHTML='<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span id="payBtnLabel">Pay $0.00 Securely</span>';
  showPage('products');
}
function confetti(){
  const colors=['#E5AFBF','#A3C2B0','#EAD0A4','#C3B3D6','#D692A6','#7FA791'];
  for(let i=0;i<44;i++){
    const c=document.createElement('div');
    const size=6+Math.random()*8;
    c.className='confetti-piece';
    c.style.left=Math.random()*100+'vw';
    c.style.width=size+'px';
    c.style.height=(Math.random()<.5?size:size*1.5)+'px';
    c.style.background=colors[i%colors.length];
    c.style.borderRadius=Math.random()<.5?'50%':'3px';
    c.style.animationDuration=(2.4+Math.random()*1.8)+'s';
    c.style.animationDelay=(Math.random()*.7)+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),5200);
  }
}

/* ==================== TESTIMONIALS ==================== */
function renderTesti(i){
  const t=TESTI[i];
  const card=$('tCard');
  card.classList.remove('fade-swap'); void card.offsetWidth; card.classList.add('fade-swap');
  $('tQuote').textContent=t.q;
  $('tName').textContent=t.name;
  $('tRole').textContent=t.role;
  const av=$('tAvatar');
  av.className='w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white '+t.color;
  av.textContent=t.init;
  document.querySelectorAll('#tDots .dot').forEach((d,di)=>d.classList.toggle('active',di===i));
}
function gotoTesti(i){ tIdx=i; renderTesti(i); }

/* ==================== MISC ==================== */
function newsletter(e){
  e.preventDefault();
  const em=$('nlEmail');
  if(!/^\S+@\S+\.\S+$/.test(em.value.trim())){ em.classList.add('invalid'); toast('Please enter a valid email'); return; }
  em.classList.remove('invalid'); em.value='';
  toast('Welcome to the cozy club!');
}

/* ==================== INIT ==================== */
function initInputs(){
  $('ccNum').addEventListener('input', e=>{
    const v=e.target.value.replace(/\D/g,'').slice(0,16);
    e.target.value=v.replace(/(\d{4})(?=\d)/g,'$1 ');
  });
  $('ccExp').addEventListener('input', e=>{
    let v=e.target.value.replace(/\D/g,'').slice(0,4);
    if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2);
    e.target.value=v;
  });
  $('ccCvc').addEventListener('input', e=>{
    e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);
  });
  document.querySelectorAll('.field').forEach(f=>{
    f.addEventListener('input',()=>f.classList.remove('invalid'));
    f.addEventListener('change',()=>f.classList.remove('invalid'));
  });
}

buildPills();
renderProducts();
renderFeatured();
initInputs();
renderTesti(0);
$('tDots').innerHTML = TESTI.map((_,i)=>`<button class="dot ${i===0?'active':''}" onclick="gotoTesti(${i})" aria-label="Testimonial ${i+1}"></button>`).join('');
setInterval(()=>{ tIdx=(tIdx+1)%TESTI.length; renderTesti(tIdx); }, 5500);
updateCartBadge();
if(session()) enterApp();
