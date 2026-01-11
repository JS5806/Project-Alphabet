-- Test Users
INSERT INTO users (username, email) VALUES 
('dev_lead', 'lead@example.com'),
('backend_dev', 'backend@example.com'),
('frontend_dev', 'frontend@example.com');

-- Test Restaurants
INSERT INTO restaurants (name, description, category) VALUES 
('Burger King', 'Flame grilled burgers', 'Fast Food'),
('Sushi House', 'Fresh salmon sushi', 'Japanese'),
('Kimchi Stew Place', 'Spicy traditional stew', 'Korean'),
('Pizza Hut', 'Cheese lovers pizza', 'Italian');

-- Initial Vote Session (Ends in 24 hours from now)
INSERT INTO vote_sessions (title, end_time_utc) VALUES 
('Today Lunch Vote', NOW() + INTERVAL '24 hours');