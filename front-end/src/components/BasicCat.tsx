import type { Cat } from "./CatViewer";
import type { Marker } from "./Map";

// TODO retrieve the username
export function BasicCat({cat, markers}: {cat: Cat, markers: Array<Marker>}){

return (
    <div 
    style={{}}
    >
        <p style={{fontWeight: 'bold', marginBottom: '0px'}}>name: {cat.name}</p>
        <p style={{fontWeight: 'bold', marginTop: '1px', marginBottom: '1px'}}>desc: {cat.desc}</p>
        <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
    </div>
);

}
