class Photo(object):
    def __init__(self, id, file_name, cat_id):
        self.id = id
        self.file_name = file_name
        self.cat_id = cat_id

    def __repr__(self):
        return f"<Photo(id={self.id}, file_name={self.file_name}, cat_id={self.cat_id})>"
    
    def to_dict(self):
        return {
            "id": self.id,
            "file_name": self.file_name,
            "cat_id": self.cat_id
        }
    
    def map_to_photo(rows):
        return [Photo(id=row[0], file_name=row[1], cat_id=row[2]).to_dict() for row in rows]