import { useEffect, useState } from 'react';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CAT_URL = SERVER_URL + "/cat"
import { SingleCat } from './SingleCat';

export type Cat = {
    id: string;
    name: string;
    desc: string;
    pin_id: number;
};

// add a permissions , 0 is for admin 1 for viewer
export function CatViewer({pin_id, permissions}: {pin_id: number, permissions: number}){
    const [cats, setCats] = useState<Array<Cat>>([]);
    const CATS_AT_LOCATION_URL = `${CAT_URL}?pin_id=${pin_id}`

    function fetchCats(){
        fetch(CATS_AT_LOCATION_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {console.log(data.cats);setCats(data.cats)})
    }

    useEffect(() => {
        fetchCats();
    }, [pin_id, CATS_AT_LOCATION_URL])

   
    return (
        <div>
            {cats.length > 0 ? (
                cats.map((cat) => (
                    <div key={cat.id}>
                        <SingleCat permissions={permissions} cat={cat} cats={cats} catSetter={setCats} fetchCats={fetchCats}/>
                    </div>
                ))
            ) : (
                <p>No cats found.</p>
            )}
        </div>
    );
}