DROP DATABASE IF EXISTS bamazon_db;

CREATE database bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT
);
