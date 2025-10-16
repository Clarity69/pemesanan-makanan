const express = require('express');
const app = express();
const orderRoute = require('./routes/order');

app.use(express.json());
app.use('/order', orderRoute);

app.get('/', (req, res) => {
  res.send('Selamat datang di Foodly 🍱');
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
