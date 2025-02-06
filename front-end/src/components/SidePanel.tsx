import type { LngLatWithID, Marker } from "./Map"
import {useSelector } from "react-redux";
import { RootState } from "./redux/CatStore";
import { BasicCat } from "./BasicCat";

interface SidePanelProps {
    isPanelExpanded2: boolean;
    currentLngLat: LngLatWithID;
    markers: Array<Marker>;
  }
// Show all of the cats


// update database design to have a userId and a timestamp at each pin
// display all of the cats in here, without photos
// clicking on a pin will filter for those cats that at that location
// clicking again on that pin again will delesct it and go back to showing all of that cats
export function SidePanel({isPanelExpanded2, currentLngLat, markers}: SidePanelProps) {

    // const dispatch = useDispatch();
    const cats = useSelector((state: RootState) => state.cats.cats);

    

    console.log('cats', cats);

    return (
        <div style={{
            position: 'absolute',
            width: '97%',
            bottom: '0px',
            height: isPanelExpanded2 ?'40%' : '0%',
            right: '3px',
            background: 'white',
            borderWidth: '1px',
            borderColor: 'black',
            borderStyle: 'solid',
            display: "flex",
            flexDirection: "column", // Stack children vertically
            overflow: 'scroll'
          }}>
            <div>
                {cats.map(cat => <BasicCat key={cat.id} cat={cat}/>)}
            </div>
            {/* <button onClick={() => fetchCats()}>text</button> */}
        </div>
    )
}