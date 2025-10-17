import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db.js';

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Semua field wajib diisi' });

    // cek duplikat email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0)
      return res.status(400).json({ error: 'Email sudah terdaftar' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    res.json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal register' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Email tidak ditemukan' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Password salah' });

    // Simpan session user
    req.session.user = { id: user.id, name: user.name, email: user.email };
    res.json({ message: 'Login sukses', user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal login' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout berhasil' });
});

export default router;
