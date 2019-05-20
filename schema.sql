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

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ('t-shirt','apparel',3.50,80),
('laptop','electronics',699,25),
('windshield wipers','auto',18.88,45),
('water bottle','sports',12.50,55),
('headphones','electronics',249.99,27),
('bath towel','bath',8.99,35),
('sauce pan','kitchen',32.75,14),
('dish soap','kitchen',3.50,38),
('zip hoodie','apparel',25.50,66),
('baking sheet','kitchen',16.99,10);

SELECT * FROM products;

