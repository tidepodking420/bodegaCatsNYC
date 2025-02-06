import type { Cat } from "./CatViewer";

export function BasicCat({cat}: {cat: Cat}){


return (
    <div 
    style={{height: '40%'}}
    >
        <p style={{fontWeight: 'bold', marginBottom: '0px'}}>name: {cat.name}</p>
        <p style={{fontWeight: 'bold', marginTop: '1px', marginBottom: '1px'}}>desc: {cat.desc}</p>
        <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
    </div>
);

}
