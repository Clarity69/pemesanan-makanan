CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100),
  harga INT
);

CREATE TABLE pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_pelanggan VARCHAR(100),
  item VARCHAR(100),
  total INT
);
