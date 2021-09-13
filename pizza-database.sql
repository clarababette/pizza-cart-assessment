CREATE TABLE pizzas (
  size varChar(50) NOT NULL UNIQUE PRIMARY KEY,
  price NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE orders (
  id SERIAL NOT NULL UNIQUE PRIMARY KEY,
  small_qty INT DEFAULT 0,
  medium_qty INT DEFAULT 0,
  large_qty INT DEFAULT 0,
  status TEXT DEFAULT 'in cart' CHECK(status IN ('in cart','payment due','paid','collected'))
);

INSERT INTO pizzas (size,price,description) VALUES ('small',49.90,'Small pizza with three toppings. One meat topping. Three or less other toppings');
INSERT INTO pizzas (size,price,description) VALUES ('medium',89.90,'Medium margeritha pizza with three toppings. Maximum two meat toppings. Three or less other toppings.');
INSERT INTO pizzas (size,price,description) VALUES ('large',119.90,'Large margeritha pizza with maximum three toppings.');