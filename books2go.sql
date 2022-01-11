CREATE TABLE IF NOT EXISTS User_Info (
	user_id SERIAL PRIMARY KEY,
	username varchar(255) UNIQUE,
	user_first_name varchar(100),
	user_last_name varchar(100),
	user_email varchar(350),
  user_password	varchar(350),
  user_address	varchar(100),
  user_address_2	varchar(100),
  user_city	varchar(50),
  user_state	varchar(50),
  user_zip_code	int,
  user_country	varchar(50)
);

CREATE TABLE IF NOT EXISTS discount (
  discount_id SERIAL PRIMARY KEY,
  discount_percent decimal,
  current_sale boolean
);

CREATE TABLE IF NOT EXISTS books (
  book_id	SERIAL PRIMARY KEY,
  name	varchar(500),
  isbn10	varchar(10),
  isbn13	varchar(13),
  quantity	int,
  retail_price	int,
  price	int,
  author	varchar(100),
  discount_id	SERIAL REFERENCES discount(discount_id)
);

CREATE TABLE IF NOT EXISTS cart (
  cart_id	  SERIAL PRIMARY KEY,
  user_id	  SERIAL REFERENCES User_Info(user_id),
  total_cost	int
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_items_id	  SERIAL PRIMARY KEY,
  book_id	  SERIAL REFERENCES books(book_id),
  cart_id	  SERIAL REFERENCES cart(cart_id),
  quantity	int
);

CREATE TABLE IF NOT EXISTS order_info (
  order_id	SERIAL PRIMARY KEY,
  total_cost	int,
  user_id	SERIAL REFERENCES User_Info(user_id)
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id	SERIAL PRIMARY KEY,
  order_id	SERIAL REFERENCES order_info(order_id),
  book_id	SERIAL REFERENCES books(book_id),
  quantity	int
);
