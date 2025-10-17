document.addEventListener('DOMContentLoaded', async () => {
  const menuGrid = document.getElementById('menu-grid');
  const cartCount = document.getElementById('cart-count');
  const cartPanel = document.getElementById('cart-panel');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const closeCart = document.getElementById('close-cart');
  const btnCart = document.getElementById('btn-cart');

  let cart = [];

  // 🔹 Ambil data menu dari backend
  try {
    const res = await fetch('/api/menu');
    const menus = await res.json();

    // Kosongkan container dan render menu
    menuGrid.innerHTML = '';
    menus.forEach(menu => {
      const card = document.createElement('div');
      card.className = 'menu-card';
      card.innerHTML = `
        <img src="${menu.gambar || '/img/default.jpg'}" alt="${menu.nama}" class="menu-img" />
        <h4>${menu.name}</h4>
        <p>${menu.deskripsi}</p>
        <strong>Rp ${parseInt(menu.price).toLocaleString('id-ID')}</strong>
        <button class="btn small" data-id="${menu.id}" data-nama="${menu.nama}" data-harga="${menu.harga}">
          Tambah ke Keranjang
        </button>
      `;
      menuGrid.appendChild(card);
    });
  } catch (err) {
    console.error('Gagal memuat menu:', err);
    menuGrid.innerHTML = '<p class="error">Gagal memuat daftar menu 😢</p>';
  }

  // 🔹 Tambah ke keranjang
  menuGrid.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.dataset.id;
      const nama = e.target.dataset.nama;
      const harga = parseInt(e.target.dataset.harga);

      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, nama, harga, qty: 1 });
      }

      updateCart();
    }
  });

  // 🔹 Update tampilan keranjang
  function updateCart() {
    cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="muted">Keranjang kosong.</p>';
      cartTotal.textContent = '0';
      return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.harga * item.qty;

      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <span>${item.nama}</span>
        <span>${item.qty}x</span>
        <span>Rp ${(item.harga * item.qty).toLocaleString('id-ID')}</span>
      `;
      cartItemsContainer.appendChild(el);
    });

    cartTotal.textContent = total.toLocaleString('id-ID');
  }

  // 🔹 Buka/Tutup keranjang
  btnCart.addEventListener('click', () => {
    cartPanel.classList.toggle('hidden');
  });

  closeCart.addEventListener('click', () => {
    cartPanel.classList.add('hidden');
  });
});
