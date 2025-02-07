import type { Cat } from "./CatViewer";
import type { Marker } from "./Map";

// TODO retrieve the username
export function BasicCat({cat, markers}: {cat: Cat, markers: Array<Marker>}){

    const myMarker = markers.filter(marker => marker.id === cat.pin_id)[0];
    console.log('myMarker', myMarker)
return (
    <div 
    style={{}}
    >
        <p style={{fontWeight: 'bold', marginBottom: '0px'}}>name: {cat.name}</p>
        <p style={{fontWeight: 'bold', marginTop: '1px', marginBottom: '1px'}}>desc: {cat.desc}</p>
        <h3>User Information</h3>
        <p style={{fontWeight: 'bold', marginBottom: '0px'}}>Added on: {myMarker.created_at.toLocaleDateString()} by {myMarker.user_id}</p>
        <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
    </div>
);

}
