class Cat(object):
    def __init__(self, id, name, desc, pin_id, username, created_at):
        self.id = id
        self.name = name
        self.desc = desc
        self.pin_id = pin_id
        self.username = username
        self.created_at = created_at

    def __repr__(self):
        return f"<Cat(id={self.id}, name={self.name}, desc={self.desc}, pin_id={self.pin_id})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "desc": self.desc,
            "pin_id": self.pin_id,
            "username": self.username,
            "created_at": self.created_at
        }
    
    @staticmethod
    def map_to_cat(rows):
        return [Cat(id=row[0], name=row[1], desc=row[2], pin_id=row[3], username=row[4], created_at=row[5]).to_dict() for row in rows]