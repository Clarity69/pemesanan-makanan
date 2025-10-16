// ==== Import Dependencies ====
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// ==== Inisialisasi App ====
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // folder frontend (index.html)

// ==== Data Dummy ====
let users = [
  { username: "admin", password: "12345" },
];

let menu = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000 },
  { id: 2, name: "Ayam Geprek", price: 20000 },
  { id: 3, name: "Mie Ayam Bakso", price: 22000 },
  { id: 4, name: "Sate Ayam", price: 28000 },
  { id: 5, name: "Es Teh Manis", price: 8000 },
  { id: 6, name: "Jus Alpukat", price: 12000 },
];

let orders = [];

// ==== Route Root ====
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// ==== API Login ====
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true, message: "Login berhasil", username });
  } else {
    res.status(401).json({ success: false, message: "Username atau password salah" });
  }
});

// ==== API Register ====
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: "Username sudah terdaftar" });
  }

  users.push({ username, password });
  res.json({ success: true, message: "Registrasi berhasil" });
});

// ==== API Menu ====
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// ==== API Order ====
app.post("/api/order", (req, res) => {
  const { username, items } = req.body;

  if (!username || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Data pesanan tidak lengkap" });
  }

  const total = items.reduce((sum, item) => {
    const menuItem = menu.find(m => m.id === item.id);
    return sum + (menuItem ? menuItem.price * item.qty : 0);
  }, 0);

  const order = {
    id: orders.length + 1,
    username,
    items,
    total,
    date: new Date(),
  };

  orders.push(order);
  res.json({ success: true, message: "Pesanan berhasil dibuat", order });
});

// ==== API Lihat Semua Order (Admin) ====
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

// ==== Jalankan Server ====
app.listen(PORT, () => {
  console.log(`🚀 Server Foodly berjalan di http://localhost:${PORT}`);
});
