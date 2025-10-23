// Check login status at the start
if (!localStorage.getItem('username')) {
  window.location.replace('/login.html');
}

document.addEventListener('DOMContentLoaded', async () => {
  // Check if user is logged in
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.replace('/login.html');
    return;
  }

  // Update welcome message
  const welcomeMessage = document.getElementById('welcome-message');
  welcomeMessage.textContent = `Welcome, ${username}! `;

  // Setup logout button
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('username');
      window.location.replace('/login.html');
      return false;
    });
  }

  const menuGrid = document.getElementById('menu-grid');
  const cartCount = document.getElementById('cart-count');
  const cartPanel = document.getElementById('cart-panel');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const btnCart = document.getElementById('btn-cart');
  const closeCart = document.getElementById('close-cart');

  let cart = [];

  // 🔹 Ambil data menu dari backend
  try {
    const response = await fetch('http://localhost:3000/api/menu');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    
    if (menuGrid) {
      menuGrid.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
          <h4>${item.name}</h4>
          <p>Harga: Rp ${item.price.toLocaleString()}</p>
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
    } else {
      console.error('Menu grid element not found');
    }
  } catch (err) {
    console.error('Error fetching menu:', err);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = 'Gagal memuat menu. Silakan refresh halaman.';
    if (menuGrid) menuGrid.appendChild(errorDiv);
  }

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
      document.getElementById('btn-checkout').disabled = true;
    } else {
      cart.forEach(item => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
          <div class="cart-item-details">
            <span>${item.name}</span>
            <div class="cart-item-controls">
              <button class="btn-qty" data-id="${item.id}" data-action="decrease">-</button>
              <span class="qty">${item.qty}</span>
              <button class="btn-qty" data-id="${item.id}" data-action="increase">+</button>
              <button class="btn-delete" data-id="${item.id}">×</button>
            </div>
          </div>
          <span class="price">Rp ${(item.price * item.qty).toLocaleString()}</span>
        `;
        cartItems.appendChild(div);

        // Add event listeners for quantity buttons
        const controls = div.querySelector('.cart-item-controls');
        controls.addEventListener('click', (e) => {
          const button = e.target;
          const id = button.dataset.id;
          const action = button.dataset.action;
          
          if (action === 'increase') {
            const item = cart.find(i => i.id === id);
            if (item) item.qty++;
          } else if (action === 'decrease') {
            const item = cart.find(i => i.id === id);
            if (item && item.qty > 1) item.qty--;
          } else if (button.classList.contains('btn-delete')) {
            cart = cart.filter(i => i.id !== id);
          }
          updateCartUI();
        });
      });
      document.getElementById('btn-checkout').disabled = false;
    }

    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    cartTotal.textContent = total.toLocaleString();
  }

  // 🔹 Buka/Tutup keranjang
  btnCart.addEventListener('click', () => {
    cartPanel.classList.toggle('hidden');
  });
  closeCart.addEventListener('click', () => {
    cartPanel.classList.add('hidden');
  });

  // 🔹 Checkout functionality
  document.getElementById('btn-checkout').addEventListener('click', async () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: localStorage.getItem('username'),
          cart: cart
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Pesanan berhasil! Total: Rp ' + data.totalPrice.toLocaleString());
        cart = []; // Clear cart after successful checkout
        updateCartUI();
        cartPanel.classList.add('hidden');
      } else {
        alert('Gagal checkout: ' + data.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Terjadi kesalahan saat checkout');
    }
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

