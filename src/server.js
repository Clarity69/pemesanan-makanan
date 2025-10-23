const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/assets/menu', express.static('assets/menu'));

// Enable CORS for image files
app.use((req, res, next) => {
  if (req.path.match(/\.(jpg|jpeg|png|gif)$/i)) {
    res.header('Access-Control-Allow-Origin', '*');
  }
  next();
});

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

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
  console.log('📥 Data diterima dari frontend:', username, password);

  if (!username || !password) {
    console.log('❌ Username atau password kosong');
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  try {
    console.log('🔐 Hashing password untuk:', username);
    const hashed = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    console.log('🧠 SQL Query:', sql, [username, '***']);

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

// 🔹 GET MENU
app.get('/api/menu', (req, res) => {
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) {
      console.error('❌ Error fetching menu:', err);
      return res.status(500).json({ error: 'Gagal mengambil data menu' });
    }
    res.json(results);
  });
});

app.listen(3000, () => console.log('🚀 Server berjalan di http://localhost:3000'));
