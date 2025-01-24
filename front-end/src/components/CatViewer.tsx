import { useEffect, useState } from 'react';
const SERVER_URL = "http://127.0.0.1:5000";
const CAT_URL = SERVER_URL + "/cat"

 type Cat = {
    id: string;
    name: string;
    desc: string;
    pin_id: number;
};


export function CatViewer({pin_id}: {pin_id: number}){
        //  {
        //     "id": self.id,
        //     "name": self.name,
        //     "desc": self.desc, these are all strings except pin_id
        //     "pin_id": self.pin_id
        // }
    // array of cat dictionaries
    const [cats, setCats] = useState<Array<Cat>>([]);
    const FULL_URL = `${CAT_URL}?pin_id=${pin_id}`
    useEffect(() => {
        fetch(FULL_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {console.log(data.cats);setCats(data.cats)})
    }, [pin_id, FULL_URL])
    return (
        <div>
            {cats.length > 0 ? (
                cats.map((cat) => (
                    <div key={cat.id}>
                        <h3>name: {cat.name}</h3>
                        <p>desc: {cat.desc}</p>
                    </div>
                ))
            ) : (
                <p>No cats found.</p>
            )}
        </div>
    );
}