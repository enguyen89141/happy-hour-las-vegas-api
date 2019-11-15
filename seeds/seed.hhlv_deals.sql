BEGIN;

TRUNCATE
  hhlv_deals,
  hhlv_users,
  RESTART IDENTITY CASCADE;

INSERT INTO hhlv_users (user_name, password)
VALUES
  ('dunder', '$2a$12$1ThUv7XHJ4l1/xlemi336uCvzKpjBGqizJY.ZlDQfCz4Jb4vIHLBe'),
  ('b.deboop','$2a$12$GaHU1gmUjfhvZ1d9OvkA2.jcxGGLVHnJ609w9vBV8gXqxvKIBgFgK'),
  ('c.bloggs', 'Charlie', '$2a$12$eSq.QxOfoJiy4PmZQ9d4Y.3xcTRYqioqt2jpKOEYbvQcAradFIXsm'),
  ('s.smith', '$2a$12$VDyOwrUXr2wnLcsj0oebm.jVIlu7OVj7EIN7beZdA97hWDYHuxdyC'),
  ('lexlor', '$2a$12$alAWdycAjhu8IysdMWYIguKbkJJU4R3IsgMDFvm2HkwtX4CTYvBdS'),
  ('wippy', '$2a$12$ivwQLjSHIj.9O3v92MijwuS1EGSFkwRo9QCLPIfkIL0BVq1pxJw0.');


INSERT INTO hhlv_deals
  (name, url, phone_number, address, zip, description, happy_hour_days, happy_hour_start, happy_hour_end, reverse_happy_hour_start, reverse_happy_hour_end)
VALUES
  ('Giuseppes''s Bar & Grille', 'www.giuseppeslv.com', '702-896-7916', '6065 S. Durango Rd.', '89113',
    'Giuseppe''s Bar and Grille, a Las Vegas Italian Restaurant and Bar: When you are looking for a Las Vegas sports bar that is off of the strip, and a little less fast paced, look no further than Giuseppe''s Bar & Grille, a Las Vegas Italian restaurant and sports bar. Our location is open 24 hours a day with a full bar and kitchen to fulfill your needs.',
    'Everyday', '4:00 PM', '7:00 PM', null, null),
  ('Cleaver Steakhouse', 'www.cleaverlasvegas.com', '702-538-9888', '3900 Paradise Road', '89169',
    'Butchered Meats, Seafood & Cocktails', 'Everyday', '5:00 PM', '8:00 PM', '12:00 AM', '3:00 AM'),
  ('Herbs & Rye', 'www.herbsandrye.com', '702-982-8036', '3713 W. Sahara Ave.', '89102',
    'Top Rated Steakhouse and Cocktail Bar', 'Monday - Saturday', '5:00 PM', '8:00 PM', '12:00 AM', '3:00 AM'),
  ('Brio Tuscan Grill', 'www.brioitalian.com', '702-914-9145', '6653 Las Vegas Boulevard', '89119',
    'BRIO Tuscan Grille Town Square brings the flavors of Tuscany to Las Vegas and Tivoli Village in Summerlin. Featuring wood-grilled and oven-roasted steaks, chops, seafood, house-made pasta specialties and flatbreads prepared in an authentic Italian wood-burning oven. Stunning architecture, white table cloths, casual atmosphere, full bar and outdoor dining. Enjoy lunch, dinner, weekend brunch and happy hour offered at the bar. Enjoy our great patio while enjoying a great cocktail. BRIO is the best Italian restaurant near you!',
    'Monday - Friday', '3:30 PM', '6:30 PM', null, null);

COMMIT;