INSERT INTO pin (lat, lng, user_id) VALUES 
    (40.7602666, -73.8603452, 'eefabe41-e4c4-11ef-a633-08d23ea2bce1'),
    (40.7397195, -73.8668684, 'eefabe41-e4c4-11ef-a633-08d23ea2bce1');

INSERT INTO cat (name, `desc`, pin_id) VALUES
('Zaza-car', 'Very Beautiful smoke shop cat', 1),
('Tufaah', 'Their names mean apple and apricot in Arabic :)', 2),
('Mishmish', 'Fluffy-tail Jackson Heights car', 2);


INSERT INTO photo (file_name, cat_id) VALUE 
 ('apple_car_photo.png', 2);


INSERT INTO user (username, email, password_hash, user_role) VALUE
 ('michaelFORT', 'tidepodking420@gmail.com', 'password_hash', 'admin');