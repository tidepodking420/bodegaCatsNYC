class Pin(object):
    # One-to-many relationship to cats
# created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#     user_id CHAR(36) REFERENCES user(id)
    def __init__(self, id, lat, lng, created_at, user_id):
        self.id = id
        self.lat = lat
        self.lng = lng
        self.created_at = created_at
        self.user_id = user_id

    def __repr__(self):
        return f"<Pin(id={self.id}, lat={self.lat}, lng={self.lng}, created_at={self.created_at}, user_id={self.user_id})>"
    
    def to_dict(self):
        # Convert SQLAlchemy model to a dictionary
        return {
            "id": self.id,
            "lat": self.lat,
            "lng": self.lng,
            "created_at": self.created_at,
            "user_id": self.user_id
        }
    
    def map_to_pin(rows):
        return [Pin(id=row[0], lat=row[1], lng=row[2], created_at=row[3], user_id=row[4]).to_dict() for row in rows]
