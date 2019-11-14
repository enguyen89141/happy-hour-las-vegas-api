CREATE TABLE hhlv_users (
  id SERIAL PRIMARY KEY,
  user_name text NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);
