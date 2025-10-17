import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',         // ganti sesuai user MySQL kamu
  password: '',          // password MySQL kamu
  database: 'foodly_db'
});
