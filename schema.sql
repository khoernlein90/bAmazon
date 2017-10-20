DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30),
    department_name VARCHAR(30),
    price DECIMAL(10,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (id)
);