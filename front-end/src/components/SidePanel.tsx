import type { LngLatWithID, Marker } from "./Map"
import {useSelector } from "react-redux";
import { RootState } from "./redux/CatStore";
import { BasicCat } from "./BasicCat";
import { useEffect, useState } from "react";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const USER_URL = VITE_SERVER_URL + '/user';

interface SidePanelProps {
    isPanelExpanded2: boolean;
    currentLngLat: LngLatWithID;
    markers: Array<Marker>;
    currentUser: string;
  }
// Show all of the cats


// next step: show the user and the 
export function SidePanel({isPanelExpanded2, currentLngLat, markers, currentUser}: SidePanelProps) {

    // const dispatch = useDispatch();
    const cats = useSelector((state: RootState) => state.cats.cats);

    const selectedPin = markers.filter(marker => marker.selected);
    
    console.log('markers in side panel', markers)
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
                <div style={{display: 'inline-block'}}>
                    {selectedPin[0] ? `Added by ${selectedPin[0].user_id} on ${selectedPin[0].created_at.toLocaleDateString()}` : 'All cats view'}
                </div>
                <div
                className="create-cats"
                style={{display: 'inline-block', left: currentUser.length > 0 ? '150px' : '100px'}}>
                    {currentUser.length > 0 ?
                    <button
                        className="mobile-button user-login-button"
                        style={{backgroundColor: 'yellowgreen'}}
                        >Add a cat</button> : <p id='qer'>Sign in to submit cats</p>}
                </div>
            </div>
            <div>
                {selectedPin[0] ? cats.filter(cat => cat.pin_id === selectedPin[0].id).map(cat => <BasicCat key={cat.id} cat={cat} markers={markers}/>) : cats.map(cat => <BasicCat key={cat.id} cat={cat} markers={markers}/>)}
            </div>
            {/* <button onClick={() => console.log(selectedPin)}>text</button> */}
        </div>
    )
}