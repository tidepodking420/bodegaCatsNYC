import { useEffect, useState } from 'react';
const SERVER_URL = "http://127.0.0.1:5000";
const CAT_URL = SERVER_URL + "/cat"

 type Cat = {
    id: string;
    name: string;
    desc: string;
    pin_id: number;
};

// add a permissions , 0 is for admin 1 for viewer
export function CatViewer({pin_id, permissions}: {pin_id: number, permissions: number}){
    const adminMode = permissions === 0;
    console.log(adminMode)
    const [cats, setCats] = useState<Array<Cat>>([]);
    const CATS_AT_LOCATION_URL = `${CAT_URL}?pin_id=${pin_id}`
    useEffect(() => {
        fetch(CATS_AT_LOCATION_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {console.log(data.cats);setCats(data.cats)})
    }, [pin_id, CATS_AT_LOCATION_URL])

    function deleteCat(cat_id: string) {
            const deleteCatURL = `${CAT_URL}?cat_id=${cat_id}`;
            fetch(deleteCatURL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json()).then(_data => {
                setCats(cats.filter(x => x.id !== cat_id))
            })
        }
   
    return (
        <div>
            {cats.length > 0 ? (
                cats.map((cat) => (
                    <div key={cat.id}>
                        {adminMode && <button onClick={() => deleteCat(cat.id)}>Delete {cat.name}</button>}
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