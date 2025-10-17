// === MODAL LOGIN / REGISTER ===
const modal = document.getElementById('modal');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const modalClose = document.getElementById('modal-close');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// 🔹 Buka modal login
btnLogin.addEventListener('click', () => {
  modal.classList.remove('hidden');
  formLogin.classList.remove('hidden');
  formRegister.classList.add('hidden');
});

// 🔹 Buka modal register
btnRegister.addEventListener('click', () => {
  modal.classList.remove('hidden');
  formRegister.classList.remove('hidden');
  formLogin.classList.add('hidden');
});

// 🔹 Tutup modal
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// 🔹 Ganti form ke Register
showRegister.addEventListener('click', () => {
  formLogin.classList.add('hidden');
  formRegister.classList.remove('hidden');
});

// 🔹 Ganti form ke Login
showLogin.addEventListener('click', () => {
  formRegister.classList.add('hidden');
  formLogin.classList.remove('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  const menuGrid = document.getElementById('menu-grid');
  const cartCount = document.getElementById('cart-count');
  const cartPanel = document.getElementById('cart-panel');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const btnCart = document.getElementById('btn-cart');
  const closeCart = document.getElementById('close-cart');

  let cart = [];

  // 🔹 Ambil data menu dari backend
  fetch('http://localhost:3000/api/menu')
    .then(res => res.json())
    .then(data => {
      menuGrid.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
          <h4>${item.name}</h4>
          <p>Harga: Rp ${item.price}</p>
          <button class="btn add-cart" 
                  data-id="${item.id}" 
                  data-name="${item.name}" 
                  data-price="${item.price}">
            Tambah ke Keranjang
          </button>
        `;
        menuGrid.appendChild(div);
      });

      // 🔹 Pasang event listener untuk setiap tombol
      document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const name = e.target.dataset.name;
          const price = parseInt(e.target.dataset.price);

          addToCart({ id, name, price });
        });
      });
    })
    .catch(err => console.error('Gagal mengambil menu:', err));

  // 🔹 Fungsi tambah ke keranjang
  function addToCart(item) {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
  }

  // 🔹 Update tampilan keranjang
  function updateCartUI() {
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="muted">Keranjang kosong.</p>';
    } else {
      cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <span>${item.name} x${item.qty}</span>
          <span>Rp ${item.price * item.qty}</span>
        `;
        cartItems.appendChild(div);
      });
    }

    cartCount.textContent = cart.length;
    cartTotal.textContent = total;
  }

  // 🔹 Buka/Tutup keranjang
  btnCart.addEventListener('click', () => {
    cartPanel.classList.toggle('hidden');
  });
  closeCart.addEventListener('click', () => {
    cartPanel.classList.add('hidden');
  });
});
 // LOGIN
document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    localStorage.setItem('username', data.username);
    document.getElementById('modal').classList.add('hidden');
  }
});


  // REGISTER
document.getElementById('form-register').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;

  const res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message);

  if (res.ok) {
    document.getElementById('show-login').click();
  }
});

