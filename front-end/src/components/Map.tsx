import { useRef, useEffect, useState } from 'react';
import maplibregl, { Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../assets/Map.css';
import { subwayLayerStyles } from './data/subway-layer-styles.ts';
import { NavigationPanel } from './NavigationPanel.tsx';
import { SidePanel } from './SidePanel.tsx';
import { useDispatch } from "react-redux";
import type {Cat} from './CatViewer'
import { addCat } from "./redux/CatSlice";
import { UserSignOn } from './UserSignOn.tsx';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PIN_URL = VITE_SERVER_URL + "/pin";
const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
const CAT_URL = VITE_SERVER_URL + "/cat"
const ALL_CATS = CAT_URL + "?pin_id=all"

export type Marker = {
    marker: maplibregl.Marker,
    id: number,
    user_id: string,
    created_at: Date,
    visibility: boolean, // in order to support filtering later on
    selected: boolean,
};
export type LngLatWithID = {
  id: number | null, lat: number, lng: number
};
type Mapish = maplibregl.Map | null;
type Pin = {
id: number,
lat: number
lng: number,
};



// 0 for admin, 1 for user
export function Map({permissions}: {permissions: number}){
    const mapContainer = useRef(null);
    const map = useRef<Mapish>(null);
    const lat = 40.7632571;
    const lng = -73.932958;
    const zoom = 11;
    // {
    // marker: maplibregl.marker
    // id: int
    // }
    const [newPin, setNewPin] = useState<maplibregl.Marker | null>(null);
    const newPinRef = useRef(newPin);
    const [placingPin, setPlacingPin] = useState(false);
    const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') ?? '');
    const [isMarkerSelected, setIsMarkerSelected] = useState(false);
    const isMarkersSelectedRef = useRef(isMarkerSelected);
    const [markers, setMarkers] = useState<Array<Marker>>([]);
    const placingPinRef = useRef(placingPin);
    const markersRef = useRef([]);
    const [currentLngLat, setCurrentLngLat] = useState<LngLatWithID>({
      id: -1,
      lat: -1,
      lng: -1
    });

    const dispatch = useDispatch();

    function fetchAllCats(){
      fetch(ALL_CATS, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          }
      }).then(res => res.json()).then(data => {
          const allCats: Array<Cat> = data.cats;
          allCats.forEach(cat => dispatch(addCat(cat)));
      })
  }

    // call this function from addMarker
    // the cat needs the pin id
    const addSingleCat = (catName: string, catDesc: string) => { 
      fetch(PIN_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'id': lngLat.id, 'name': catName, 'desc': catDesc})
      }).then(res => res.json()).then(data => {
      })
  }

  // then upload all photos

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
          center: [lng, lat],
          zoom: zoom,
          doubleClickZoom: false,
        });


        // wait for the initial mapbox style to load before loading our own data
      map.current.on('style.load', () => {
        // fitbounds to NYC
        map.current!.fitBounds([
          [-74.270056,40.354061],
          [-73.663062,40.757187]
        ])

        // add geojson sources for subway routes and stops
        map.current!.addSource('nyc-subway-routes', {
          type: 'geojson',
          data: 'src/components/data/nyc-subway-routes.geojson'
        });

        map.current!.addSource('nyc-subway-stops', {
          type: 'geojson',
          data: 'src/components/data/nyc-subway-stops.geojson'
        });

        // add layers by iterating over the styles in the array defined in subway-layer-styles.js
        subwayLayerStyles.forEach((style) => {
          map.current!.addLayer(style)
        })
        
})


        // add pins from dbmapInstance
        fetch(PIN_URL).then(res => res.json()).then(data => {
          const {pins} = data;
          console.log('pins');
          console.log(data)
          const initMarkerState = pins.map((pin: any) => {            
            const newMarker = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([pin.lng, pin.lat])
            .addTo(map.current!);
            // if no markers are selected, a click should deselect all markers except that on
            // if a marker is selected and is clicked, de select it
            // if a different marker is clicked that is not the selected one, then select that one 
            newMarker.getElement().addEventListener('click', (e) => {
              // console.log('current value', isMarkersSelectedRef.current)
              const isThereSelection =  isMarkersSelectedRef.current;
              // disable pin selection when placing a pin
              if(!placingPinRef.current){
              const newValues = markersRef.current.map(marker => {

                if(marker.marker !== newMarker){
                  marker.selected = false;
                  // if you choose 
                  if(isThereSelection){
                    marker.marker.setOpacity('1');
                  } else{
                    marker.marker.setOpacity('0.5');
                  }
                } else{
                  marker.marker.setOpacity('1');
                  if(isThereSelection){
                    marker.selected = false;
                  } else{
                    marker.selected = true;
                  }
                }
                return marker;
              });
              const newSelection = markersRef.current.filter(marker => marker.selected).length > 0;
              console.log('new value', newSelection)
              // setIsMarkerSelected(true)
              setIsMarkerSelected(newSelection);
              isMarkersSelectedRef.current = newSelection; 

              console.log('You just clicked on a marker')
              console.log(e)
              console.log(newValues)

            } else{
              // in placing pin mode
            }
          });
            return {'marker': newMarker, 'id': pin.id, 'user_id': pin.user_id, 'created_at': new Date(pin.created_at), 'visibility': true, 'selected': false };
          })
          // console.log(initMarkerState)
          markersRef.current = initMarkerState; 
          setMarkers(initMarkerState);
        })

        fetchAllCats();

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('click', (e) => {
            // I want to only allow 1 pin
            const { lngLat } = e;
            if(placingPinRef.current){
              if(newPinRef.current === null){
                setCurrentLngLat({
                  id: null,
                  lat: lngLat.lat,
                  lng: lngLat.lng
                });
                const newMarker = new maplibregl.Marker({color:"#0000BB"}).setDraggable(true).setLngLat([lngLat.lng, lngLat.lat]).addTo(map. current!);
                newPinRef.current = newMarker;
                setNewPin(newMarker);
                newMarker.on('drag', () => {
                    const currentLngLat = newMarker.getLngLat(); // Get 
                    // the current lngLat
                    const lngLatProp: LngLatWithID = {
                      id: null,
                      lng: currentLngLat.lng,
                      lat: currentLngLat.lat
                    };
                    setCurrentLngLat(lngLatProp);
                });
              }
            }


          });

      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [lng, lat, zoom]);

      const [isPanelExpanded, setIsPanelExpanded] = useState(true); // Initially expanded
      const [isPanelExpanded2, setIsPanelExpanded2] = useState(true); // Initially expanded
      const [showSignIn, setShowSignIn] = useState(false);

      const toggleShowSignIn = () => {
        setShowSignIn(!showSignIn);
      }

      const togglePanel = () => {
        setIsPanelExpanded(!isPanelExpanded); // Toggle visibility
      };
      const togglePanel2 = () => {
        console.log('setting isPanelExpanded to', !isPanelExpanded)
        setIsPanelExpanded2(!isPanelExpanded2); // Toggle visibility
      };

      return (
        <div style={{overflow: 'hidden'}}>
          <NavigationPanel isPanelExpanded={isPanelExpanded} map={map} currentUser={currentUser} 
          toggleShowSignIn={toggleShowSignIn} showSignIn={showSignIn} setCurrentUser={setCurrentUser}/>
          <button
            className='hamburger'
            onClick={togglePanel} 
            style={{top: '10px',left: '10px'}}>
            ☰ {/* Hamburger Icon */}
          </button>
          <div style={{  position: 'absolute', width: '97%', height: isPanelExpanded ?'77%' :'98%'}}
            ref={mapContainer} className="map" />
          <button 
            className='hamburger'
            onClick={togglePanel2} 
            style={{ bottom: '2px', left:'6px'}}>
            ☰ {/* Hamburger Icon */}
          </button>
          <SidePanel isPanelExpanded2={isPanelExpanded2} currentLngLat={currentLngLat} setCurrentLngLat={setCurrentLngLat}
            markers={markers}  currentUser={currentUser} placingPin={placingPin}
             setPlacingPin={setPlacingPin} placingPinRef={placingPinRef} newPinRef={newPinRef}
             setIsPanelExpanded={setIsPanelExpanded} map={map}/>
          <div style={{
             position: 'absolute',
             zIndex: 999,
             top: '30%',
             display: showSignIn ? 'block' :'none',
             left:'10px',
             width: '80%',
             background: 'white',
             border: 'none',
             padding: '10px',
             cursor: 'pointer',
             borderWidth: '1px',
             borderStyle: 'solid',
             borderColor: 'black'
            }}>
              <UserSignOn toggleShowSignIn={toggleShowSignIn} setCurrentUser={setCurrentUser}/>
            </div>
        </div>
      );
}