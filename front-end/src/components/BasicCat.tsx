import type { Cat } from "./CatViewer";
import type { Marker } from "./Map";
import {useState, useEffect} from 'react';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PHOTO_URL = VITE_SERVER_URL + "/photo";
const S3_BUCKET = import.meta.env.VITE_S3_BUCKET;
const REGION = import.meta.env.VITE_REGION;

const GET_PHOTO_URL = (key: number | string) => `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`

type Photo = {
    id: number,
    awsuuid: string,
    file_name: string,
    cat_id: number
};

// TODO lazy load photos
export function BasicCat({cat, markers}: {cat: Cat, markers: Array<Marker>}){

    const [catPhotos, setCatPhotos] = useState<Array<Photo>>([]); 
        
    // update this API to return the uuid of the photos
    async function getCatPhotos(){
        // step 1: query db
        fetch(PHOTO_URL + `?cat_id=${cat.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {
            console.log(data)
            setCatPhotos(data.photos)
        })
    }

     useEffect(() => {
                getCatPhotos();
            }, [])

return (
    <div>
        <p style={{fontWeight: 'bold', marginBottom: '0px'}}>name: {cat.name}</p>
        <p style={{fontWeight: 'bold', marginTop: '1px', marginBottom: '1px'}}>desc: {cat.desc}</p>
        {catPhotos.map(catPhoto => {
                   return (
                    <div key={`${catPhoto.awsuuid}-catPhoto`}>
                        <img src={GET_PHOTO_URL(catPhoto.awsuuid)} alt={`${catPhoto.file_name}`} width={'100%'}/>
                        {/* <button onClick={() => deletePhoto(catPhoto.id.toString())}>Delete {`${catPhoto.file_name}`}</button> */}
                   </div>
                 )
                })}
        <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
    </div>
);

}
