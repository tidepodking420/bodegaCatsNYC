class User(object):
    # One-to-many relationship to cats
# CREATE TABLE user (
#     id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- UUID for globally unique user IDs
#     username VARCHAR(50) NOT NULL UNIQUE,    -- Unique username
#     email VARCHAR(100) NOT NULL UNIQUE,      -- Unique email address
#     password_hash VARCHAR(255) NOT NULL,     -- Hashed password (use a strong hashing algorithm)
#     user_role ENUM('admin', 'user') DEFAULT 'user', -- User role (e.g., admin or regular user)
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the user was created
#     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp for when the user was last updated
# );
    def __init__(self, id, username, email, password_hash, user_role, created_at, updated_at):
        self.id = id
        self.lat = user_role
        self.lng = username
        # maybe add later address field to implement google maps stuff
        # name of the business

    def __repr__(self):
        return f"<Pin(id={self.id}, lat={self.lat}, lng={self.lng})>"
    
    def to_dict(self):
        # Convert SQLAlchemy model to a dictionary
        return {
            "id": self.id,
            "lat": self.lat,
            "lng": self.lng,
        }
    
    def map_to_pin(rows):
        return [User(id=row[0], lat=row[1], lng=row[2]).to_dict() for row in rows]
