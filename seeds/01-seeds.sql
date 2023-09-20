INSERT INTO
  users (name, email, PASSWORD)
VALUES
  (
    'Jean Michel',
    'jeanmich@mail.com',
    '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
  ),
  (
    ' Maxime Hum ',
    ' maximehum@mail.com ',
    '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
  ),
  (
    ' Sarah Croche ',
    ' sarahcroche@mail.com ',
    '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
  );

-- Insert into properties table
INSERT INTO
  properties (
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms,
    country,
    street,
    city,
    province,
    post_code,
    active
  )
VALUES
  (
    1,
    'Cozy Cottage',
    'A charming cottage in the countryside',
    'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350',
    'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
    100,
    2,
    2,
    3,
    'United States',
    '123 Oak Street',
    'San Francisco',
    'CA',
    '12345',
    TRUE
  ),
  (
    2,
    'Luxury Villa',
    'A luxurious villa with ocean view',
    'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350',
    'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg',
    300,
    4,
    4,
    5,
    'Spain',
    '456 Beach Road',
    'Barcelona',
    'Catalonia',
    '54321',
    TRUE
  ),
  (
    3,
    'Mountain Cabin',
    'A rustic cabin in the woods',
    'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350',
    'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg',
    80,
    1,
    1,
    2,
    'Canada',
    '789 Pine Lane',
    'Vancouver',
    'BC',
    '67890',
    TRUE
  );

-- Insert into reservations table
INSERT INTO
  reservations (start_date, end_date, property_id, guest_id)
VALUES
  ('2023-09-20', '2023-09-25', 1, 1),
  ('2023-10-05', '2023-10-10', 2, 2),
  ('2023-11-15', '2023-11-20', 3, 3);

-- Insert into property_reviews table
INSERT INTO
  property_reviews (
    guest_id,
    property_id,
    reservation_id,
    rating,
    message
  )
VALUES
  (1, 1, 1, 5, 'Great place to stay!'),
  (2, 2, 2, 4, 'Amazing views and amenities.'),
  (3, 3, 3, 4, 'Cozy cabin, perfect for a getaway.');