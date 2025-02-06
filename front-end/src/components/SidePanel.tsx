import type { LngLatWithID } from "./Map"
import { useDispatch, useSelector } from "react-redux";
import { addPin, removePin } from "./redux/PinSlice";
import { RootState } from "./redux/PinStore";


// Show all of the cats

export function SidePanel({isPanelExpanded2, currentLngLat}, {isPanelExpanded2: boolean, currentLngLat: LngLatWithID}) {

    const dispatch = useDispatch();
    const pins = useSelector((state: RootState) => state.pins.pins);

    console.log('pins', pins);
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
            borderStyle: 'solid'
          }}>
            <div>
                {`${currentLngLat.lng} ${currentLngLat.lat}`}
            </div>
            <div>Make a small change</div>
        </div>
    )
}