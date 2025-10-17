import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js'; // kalau sudah ada

const app = express();

app.use(express.json());
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
}));

app.use('/auth', authRoutes);
app.use('/order', orderRoutes); // rute pesanan / menu

app.listen(3000, () => console.log('Server jalan di http://localhost:3000'));
