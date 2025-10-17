// --- Ganti bagian login & register (simulasi) ---
formLogin.addEventListener('submit', async e=>{
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    closeModal();
    alert('Berhasil login: ' + data.user.name);
  } catch (err) {
    alert('Gagal login: ' + err.message);
  }
});

formRegister.addEventListener('submit', async e=>{
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();

  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    alert('Akun berhasil dibuat!');
    toggleAuth('login');
  } catch (err) {
    alert('Gagal register: ' + err.message);
  }
});
