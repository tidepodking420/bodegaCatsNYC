-- google maps uses 7 decimal places, and need to go up to 180

CREATE TABLE pin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL
);

CREATE TABLE cat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    `desc` VARCHAR(240) NOT NULL,
    pin_id INT NOT NULL,
    FOREIGN KEY (pin_id) REFERENCES pin(id)
);

-- one to many relationship from pin to cat

-- one to many from cat to photo

CREATE TABLE photo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(50) NOT NULL,
    cat_id INT NOT NULL,
    FOREIGN KEY (cat_id) REFERENCES cat(id)
);
