class Queue(object):
    # One-to-many relationship to cats
    # create TABLE queue (
    #     id INT AUTO_INCREMENT PRIMARY KEY,
    #     lat DECIMAL(10, 7) NOT NULL,
    #     lng DECIMAL(10, 7) NOT NULL,
    #     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    #     catName VARCHAR(50) NOT NULL,
    #     catDesc VARCHAR(240) NOT NULL,
    #     -- pseudo foreign keys
    #     username VARCHAR(50) NOT NULL,
    #     awsuuid CHAR(36) NOT NULL
    # );
    def __init__(self, id, lat, lng, created_at, catName, catDesc, username, awsuuid):
        self.id = id
        self.lat = lat
        self.lng = lng
        self.created_at = created_at
        self.catName = catName
        self.catDesc = catDesc
        self.username = username
        self.awsuuid = awsuuid

    def __repr__(self):
        return "string"
        # return f"<User(id={self.id}, username={self.username}, email={self.email} password_hash={self.password_hash} user_role={self.user_role} created_at={self.created_at} updated_at={self.updated_at})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "lat": self.lat,
            "lng": self.lng,
            "created_at": self.created_at,
            "catName": self.catName,
            "catDesc": self.catDesc,
            "username": self.username,
            "awsuuid": self.awsuuid
        }
    
    def map_to_queue(rows):
        return [Queue(id=row[0], lat=row[1], lng=row[2], created_at=row[3], catName=row[4], catDesc=row[5], username=row[6], awsuuid=row[7]).to_dict() for row in rows]
