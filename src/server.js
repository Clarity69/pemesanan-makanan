const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'foodly_db', // ✅ ini sudah benar sesuai
  multipleStatements: true
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Terhubung ke database MySQL');

  db.query('SELECT DATABASE() AS db;', (err, result) => {
    if (err) console.error(err);
    else console.log('📂 Database aktif:', result[0].db);
  });
});


// 🔹 REGISTER
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('📥 Data diterima dari frontend:', username, password); // <== tambahkan ini

  if (!username || !password)
    return res.status(400).json({ message: 'Username dan password wajib diisi' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    console.log('🧠 SQL Query:', sql, [username, hashed]); // <== tambahkan ini

    db.query(sql, [username, hashed], (err) => {
      if (err) {
        console.error('❌ SQL Error:', err.sqlMessage);
        return res.status(500).json({ message: 'Gagal registrasi: ' + err.sqlMessage });
      }
      console.log('✅ Registrasi sukses untuk:', username);
      res.json({ message: 'Registrasi berhasil!' });
    });
  } catch (error) {
    console.error('⚠️ Hash Error:', error.message);
    res.status(500).json({ message: 'Error server' });
  }
});

// 🔹 LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0)
      return res.status(400).json({ message: 'User tidak ditemukan' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password salah' });

    res.json({ message: 'Login berhasil', username: user.username });
  });
});

// 🔹 CHECKOUT
app.post('/api/checkout', (req, res) => {
  const { username, cart } = req.body;
  if (!cart || cart.length === 0)
    return res.status(400).json({ error: 'Keranjang kosong.' });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  db.query('INSERT INTO orders (username, total) VALUES (?, ?)', [username, totalPrice], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pesanan berhasil disimpan!', totalPrice });
  });
});

app.listen(3000, () => console.log('🚀 Server berjalan di http://localhost:3000'));
