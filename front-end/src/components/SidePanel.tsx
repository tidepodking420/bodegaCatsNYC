import type { LngLatWithID, Marker } from "./Map"
import { useDispatch, useSelector } from "react-redux";
import type {Cat} from './CatViewer'
import { addCat, removeCat } from "./redux/CatSlice";
import { RootState } from "./redux/CatStore";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CAT_URL = SERVER_URL + "/cat"
const ALL_CATS = CAT_URL + "?pin_id=all"
import { BasicCat } from "./BasicCat";

interface SidePanelProps {
    isPanelExpanded2: boolean;
    currentLngLat: LngLatWithID;
    markers: Array<Marker>;
  }
// Show all of the cats


// TODO in the map container, fetch all of the cats intially
// update database design to have a userId and a timestamp at each pin
// display all of the cats in here, without photos
// clicking on a pin will filter for those cats that at that location
// clicking again on that pin again will delesct it and go back to showing all of that cats
export function SidePanel({isPanelExpanded2, currentLngLat, markers}: SidePanelProps) {

    const dispatch = useDispatch();
    const cats = useSelector((state: RootState) => state.cats.cats);

    function fetchAllCats(){
        fetch(ALL_CATS, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => {
            console.log(data.cats);
            const allCats: Array<Cat> = data.cats;
            allCats.forEach(cat => dispatch(addCat(cat)));
        })
    }

    console.log('cats', cats);

    const myCats: Array<Cat> = [{
        id: "12" , name: "Mishmish" , desc: "Fluffy-tail Jackson Heights car",pin_id: 5 }];
// , "13" , "Pepper"   | She will bite your face                         |      4 |
// , "14" , "Salt"     | He is a very salty chonky car.                  |      5 |
//     }]
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
                {`${currentLngLat.lng} ${currentLngLat.lat}`}
            </div>
            <div>Make a small change</div>
            <div>
                {myCats.map(cat => <BasicCat key={cat.id} cat={cat}/>)}
            </div>
            {/* <button onClick={() => fetchCats()}>text</button> */}
        </div>
    )
}