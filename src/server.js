// ==== Import Dependencies ====
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

// ==== Inisialisasi App ====
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ==== Koneksi Database ====
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "foodly_db",
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ Terhubung ke database MySQL");
});

// ==== API ====

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Username sudah terdaftar" });
    }
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password], (err2) => {
      if (err2) throw err2;
      res.json({ success: true, message: "Registrasi berhasil" });
    });
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
    if (results.length > 0) {
      res.json({ success: true, message: "Login berhasil", username });
    } else {
      res.status(401).json({ success: false, message: "Username atau password salah" });
    }
  });
});

app.get("/api/menu", (req, res) => {
  db.query("SELECT * FROM menu", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post("/api/order", (req, res) => {
  const { username, items } = req.body;
  if (!username || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Data pesanan tidak lengkap" });
  }

  let total = 0;
  const ids = items.map(i => i.id);

  db.query(`SELECT id, price FROM menu WHERE id IN (?)`, [ids], (err, menuResults) => {
    if (err) throw err;

    items.forEach(i => {
      const item = menuResults.find(m => m.id === i.id);
      if (item) total += item.price * i.qty;
    });

    db.query("INSERT INTO orders (username, total) VALUES (?, ?)", [username, total], (err2, result) => {
      if (err2) throw err2;
      const orderId = result.insertId;

      items.forEach(i => {
        db.query("INSERT INTO order_items (order_id, menu_id, qty) VALUES (?, ?, ?)", [orderId, i.id, i.qty]);
      });

      res.json({ success: true, message: "Pesanan berhasil dibuat", orderId, total });
    });
  });
});

app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY created_at DESC", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ==== Jalankan Server ====
app.listen(PORT, () => {
  console.log(`🚀 Server Foodly berjalan di http://localhost:${PORT}`);
});
