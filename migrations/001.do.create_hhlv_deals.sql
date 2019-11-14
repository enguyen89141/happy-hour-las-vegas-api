CREATE TABLE hhlv_deals (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  url TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  zip TEXT NOT NULL,
  description TEXT NOT NULL,
  happy_hour_days TEXT NOT NULL,
  happy_hour_start TEXT NOT NULL,
  happy_hour_end TEXT NOT NULL,
  reverse_happy_hour_start TEXT,
  reverse_happy_hour_end TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);