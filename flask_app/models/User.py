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
#  is_authenticated BOOLEAN DEFAULT FALSE,
#     verification_token VARCHAR(120) NOT NULL
# );
    def __init__(self, id, username, email, password_hash, user_role, created_at, updated_at, is_authenticated, verification_token):
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.user_role = user_role
        self.created_at = created_at
        self.updated_at = updated_at
        self.is_authenticated = is_authenticated
        self.verification_token = verification_token

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email} password_hash={self.password_hash} user_role={self.user_role} created_at={self.created_at} updated_at={self.updated_at})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "password_hash": self.password_hash,
            "user_role": self.user_role,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "is_authenticated": self.is_authenticated,
            "verification_token": self.verification_token
        }
    
    def map_to_user(rows):
        return [User(id=row[0], username=row[1], email=row[2], password_hash=row[3], user_role=row[4], created_at=row[5], updated_at=row[6], is_authenticated=[7], verification_token=[8]).to_dict() for row in rows]
