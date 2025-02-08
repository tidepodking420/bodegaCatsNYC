-- google maps uses 7 decimal places, and need to go up to 180
CREATE TABLE user (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID for globally unique user IDs
    username VARCHAR(50) NOT NULL UNIQUE,    -- Unique username
    email VARCHAR(100) NOT NULL UNIQUE,      -- Unique email address
    password_hash VARCHAR(255) NOT NULL,     -- Hashed password (use a strong hashing algorithm)
    user_role ENUM('admin', 'user') DEFAULT 'user', -- User role (e.g., admin or regular user)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the user was created
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp for when the user was last updated
);


CREATE TABLE pin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id CHAR(36) REFERENCES user(id)
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
    awsuuid CHAR(36) NOT NULL,
    file_name VARCHAR(50) NOT NULL,
    cat_id INT NOT NULL,
    FOREIGN KEY (cat_id) REFERENCES cat(id)
);