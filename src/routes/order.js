const express = require('express');
const router = express.Router();

let menu = [
  { id: 1, nama: 'Nasi Goreng', harga: 20000 },
  { id: 2, nama: 'Mie Ayam', harga: 15000 },
  { id: 3, nama: 'Ayam Geprek', harga: 25000 }
];

router.get('/menu', (req, res) => {
  res.json(menu);
});

router.post('/pesan', (req, res) => {
  const pesanan = req.body;
  res.json({ message: 'Pesanan diterima', data: pesanan });
});

module.exports = router;
