const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/menu', async (req, res) => {
  try {
    const [menu] = await db.query('SELECT id, name, price, image FROM menu');
    res.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/pesan', (req, res) => {
  const pesanan = req.body;
  res.json({ message: 'Pesanan diterima', data: pesanan });
});

module.exports = router;
