class Cat(object):
    def __init__(self, id, name, desc, pin_id):
        self.id = id
        self.name = name
        self.desc = desc
        self.pin_id = pin_id

    def __repr__(self):
        return f"<Cat(id={self.id}, name={self.name}, desc={self.desc}, pin_id={self.pin_id})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "desc": self.desc,
            "pin_id": self.pin_id
        }
    
    @staticmethod
    def map_to_cat(rows):
        return [Cat(id=row[0], name=row[1], desc=row[2], pin_id=row[3]).to_dict() for row in rows]