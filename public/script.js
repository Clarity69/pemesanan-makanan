// script.js - interaksi UI sederhana untuk Foodly

// --- Data & state ---
let menuData = []; // akan diisi dari API atau fallback
const cart = [];

// DOM
const menuGrid = document.getElementById('menu-grid');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const btnCart = document.getElementById('btn-cart');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const btnCheckout = document.getElementById('btn-checkout');

// --- Helpers ---
function priceFormat(n){ return n.toLocaleString('id-ID'); }

function renderMenu(){
  menuGrid.innerHTML = '';
  for(const m of menuData){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <h4>${m.nama}</h4>
        <div class="muted">${m.deskripsi || ''}</div>
      </div>
      <div class="actions">
        <div class="price">Rp ${priceFormat(m.harga)}</div>
        <button class="btn small" data-id="${m.id}">Tambah</button>
      </div>
    `;
    menuGrid.appendChild(card);
  }

  // attach listener
  menuGrid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const item = menuData.find(x => x.id === id);
      addToCart(item);
    });
  });
}

function addToCart(item){
  const existing = cart.find(c => c.id === item.id);
  if(existing){
    existing.qty++;
  } else {
    cart.push({...item, qty:1});
  }
  updateCartUI();
}

function removeFromCart(id){
  const idx = cart.findIndex(c => c.id === id);
  if(idx>=0) cart.splice(idx,1);
  updateCartUI();
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,c)=>s+c.qty,0);
  cartItemsEl.innerHTML = '';
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p class="muted">Keranjang kosong.</p>';
    cartTotal.textContent = '0';
    return;
  }
  for(const it of cart){
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div>
        <div><strong>${it.nama}</strong></div>
        <div class="muted">Rp ${priceFormat(it.harga)} x ${it.qty}</div>
      </div>
      <div>
        <button class="btn small remove-btn" data-id="${it.id}">Hapus</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  }
  cartItemsEl.querySelectorAll('.remove-btn').forEach(b=>{
    b.addEventListener('click',()=>removeFromCart(parseInt(b.dataset.id)));
  });
  const total = cart.reduce((s,c)=>s + (c.harga * c.qty), 0);
  cartTotal.textContent = total;
}

// --- Auth modal handlers ---
btnLogin.addEventListener('click', () => {
  openModal('login');
});
btnRegister.addEventListener('click', () => {
  openModal('register');
});
modalClose.addEventListener('click', closeModal);
showRegister.addEventListener('click', ()=>toggleAuth('register'));
showLogin.addEventListener('click', ()=>toggleAuth('login'));

function openModal(type='login'){
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
  toggleAuth(type);
}
function closeModal(){
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
}
function toggleAuth(type){
  if(type === 'login'){
    formLogin.classList.remove('hidden');
    formRegister.classList.add('hidden');
  } else {
    formRegister.classList.remove('hidden');
    formLogin.classList.add('hidden');
  }
}

// fake auth actions (demo only)
formLogin.addEventListener('submit', e=>{
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  closeModal();
  alert('Berhasil login sebagai ' + email + ' (simulasi)');
});
formRegister.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  closeModal();
  alert('Akun dibuat: ' + name + ' (simulasi)');
});

// --- Cart panel handlers ---
btnCart.addEventListener('click', ()=>{ cartPanel.classList.toggle('hidden'); });
closeCart.addEventListener('click', ()=>{ cartPanel.classList.add('hidden'); });

// Checkout: kirim order ke endpoint /order/pesan (POST)
btnCheckout.addEventListener('click', async ()=>{
  if(cart.length === 0){ alert('Keranjang kosong'); return; }
  const nama = prompt('Masukkan nama penerima (untuk simulasi checkout):');
  if(!nama) return;
  const payload = {
    nama_pelanggan: nama,
    items: cart.map(c=>({ id:c.id, nama:c.nama, qty:c.qty, harga:c.harga })),
    total: cart.reduce((s,c)=>s + (c.harga * c.qty), 0)
  };

  try{
    // coba kirim ke server; jika tidak tersedia, tampilkan pesan sukses simulasi
    const res = await fetch('/order/pesan', {
      method:'POST',
      headers:{ 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if(res.ok){
      const json = await res.json();
      alert('Pesanan berhasil: ' + (json.message || 'OK'));
      cart.length = 0;
      updateCartUI();
      cartPanel.classList.add('hidden');
    } else {
      throw new Error('server error');
    }
  }catch(err){
    // fallback: simulasi sukses
    alert('Simulasi: Pesanan diterima. (server tidak tersedia)');
    cart.length = 0;
    updateCartUI();
    cartPanel.classList.add('hidden');
  }
});

// --- Load menu from backend or fallback data ---
async function loadMenu(){
  try{
    const res = await fetch('/order/menu');
    if(!res.ok) throw new Error('no menu');
    menuData = await res.json();
  }catch(err){
    // fallback sample menu
    menuData = [
      { id: 1, nama: 'Nasi Goreng', deskripsi:'Nasi goreng khas rumahan', harga:20000 },
      { id: 2, nama: 'Mie Ayam', deskripsi:'Mie dengan suwiran ayam', harga:15000 },
      { id: 3, nama: 'Ayam Geprek', deskripsi:'Ayam goreng tepung + sambal', harga:25000 },
      { id: 4, nama: 'Sate Ayam', deskripsi:'Sate dengan bumbu kecap', harga:30000 }
    ];
  } finally {
    renderMenu();
    updateCartUI();
  }
}

// init
loadMenu();
