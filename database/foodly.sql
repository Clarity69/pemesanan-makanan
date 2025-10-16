-- Tabel user untuk login/register
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

-- Tabel menu makanan
CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL
);

-- Tabel order
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  total INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel detail pesanan
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  menu_id INT,
  qty INT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (menu_id) REFERENCES menu(id)
);

-- Tambahkan beberapa menu awal
INSERT INTO menu (name, price) VALUES
('Nasi Goreng Spesial', 25000),
('Ayam Geprek', 20000),
('Mie Ayam Bakso', 22000),
('Sate Ayam', 28000),
('Es Teh Manis', 8000),
('Jus Alpukat', 12000);
