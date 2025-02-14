import type { Cat } from "./CatViewer";
import type { Marker } from "./Map";
import {useState, useEffect} from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PHOTO_URL = VITE_SERVER_URL + "/photo";
const S3_BUCKET = import.meta.env.VITE_S3_BUCKET;
const REGION = import.meta.env.VITE_REGION;

const GET_PHOTO_URL = (key: number | string) => `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`

export type Photo = {
    id: number,
    awsuuid: string,
    file_name: string,
    cat_id: number
};

export function BasicCat({cat, markers}: {cat: Cat, markers: Array<Marker>}){

    const [catPhoto, setCatPhotos] = useState<Photo | null>(JSON.parse(localStorage.getItem(`cat-${cat.id}`)) ?? null); 
    const [clicked, setClicked] = useState(false);

    console.log('localstorage', localStorage.getItem(`cat-${cat.id}`))
    async function getCatPhotos(){
        fetch(PHOTO_URL + `?cat_id=${cat.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {
            const photo: Photo = data.photos[0];
            localStorage.setItem(`cat-${cat.id}`, JSON.stringify(photo))
            setCatPhotos(data.photos[0])
        })
    }

    useEffect(() => {
        if(localStorage.getItem(`cat-${cat.id}`) === null){
            getCatPhotos();
        }
    }, [])

return (
    <div>
        <center>
            <div>
                <p style={{fontWeight: 'bold', marginBottom: '0px'}}>{`Added by ${cat.username} on ${new Date(cat.created_at).toLocaleDateString()}`}</p>
                <p style={{fontWeight: 'bold', margin: '0px'}}>{cat.name}: {cat.desc}</p>
            </div>

            {catPhoto && <div>
                <LazyLoadImage style={{ maxWidth: '80%', maxHeight: clicked ?  '40%' : '200px', marginTop: '10px', marginBottom: '100px' }}
                    src={GET_PHOTO_URL(catPhoto.awsuuid)} alt={`${catPhoto.file_name}`}
                    onClick={() => setClicked(!clicked)}/>
            </div>}
            <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
        </center>
    </div>
);

}
