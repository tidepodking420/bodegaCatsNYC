import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../assets/Map.css';
import ReactDOM from 'react-dom/client';
import { CatViewer } from './CatViewer';
import { subwayLayerStyles } from './data/subway-layer-styles.ts';
import { NavigationPanel } from './NavigationPanel.tsx';
import { SidePanel } from './SidePanel.tsx';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PIN_URL = VITE_SERVER_URL + "/pin";
const apiKey = "SnBrO5ngtGNXyvdH2O0e";

// next steps
// figure out how I can deploy my flask/react application
// how to make mobile friendly interfaces
// how to associate the pins with cats, how to represent the cats
export type Marker = {
    marker: maplibregl.Marker,
    id: number
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
    const [markers, setMarkers] = useState<Array<Marker>>([]);
    const markersRef = useRef([]);
    const [currentLngLat, setCurrentLngLat] = useState<LngLatWithID>({
      id: -1,
      lat: -1,
      lng: -1
    });
 
     // see note; be careful about assumptions with lngLat
     function MarkerPopup({mapInstance, lngLat} : {mapInstance : any, lngLat: LngLatWithID}){      
      const [catName, setCatName] = useState("");
      const [catDesc, setCatDesc] = useState("");
      const [selectedOption, setSelectedOption] = useState('admin');
      const catViewer = lngLat.id && <CatViewer pin_id={lngLat.id} permissions={permissions}/>;

      // prompts the user to create a new pin?
       if(permissions === 0){
        // ADMIN
    return <div> 
              <label>
                  <input 
                      type="radio" 
                      value="admin" 
                      checked={selectedOption === 'admin'} 
                      onChange={(e) => setSelectedOption(e.target.value)} 
                  />
                  Add/Remove Pins
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="viewer" 
                      checked={selectedOption === 'viewer'} 
                      onChange={(e) => setSelectedOption(e.target.value)} 
                  />
                  Add Photos and update cats
              </label>
              {selectedOption === 'viewer' ? <div>
                {catViewer}
              </div> :
              <div> 
                <h3>Do you want to delete this pin?</h3>
                <p><strong>Latitude:</strong> {lngLat.lat}</p>
                <p><strong>Longitude:</strong> {lngLat.lng}</p>
                <center>
                <button 
                onClick={() => {
                  // make this do a delete on cascade
                fetch(PIN_URL, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({'id': lngLat.id})
                }).then(res => res.json()).then(data => {
                  console.log(data);

                  const num_cats: number = data.num_cats;
                  if (num_cats > 0){
                    alert('There are ' + num_cats + 'cats at this pin')
                  } else{
                    const markerToDelete = markersRef.current.filter(pin => pin.id === lngLat.id)[0].marker;
                    markerToDelete.remove();
                    const filteredMarkers = markersRef.current.filter(pin => pin.id !== lngLat.id);
                    markersRef.current = filteredMarkers;
                    setMarkers(filteredMarkers)
                  }
                })
                }}>Yes</button>
                <h3>Add a cat instead?</h3>
                <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder='Name of the Cat?'
                />
                <textarea
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder='Description...'
                rows={7}
                cols={20}
                />
                {/* TODO how to handle having no name or description? */}
                <button 
                // TODO fix bug where description longer than expected in my database is crashing it
                disabled={!catName.length || !catDesc.length || catDesc.length > 240}
                onClick={() => {
                  fetch(PIN_URL, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'id': lngLat.id, 'name': catName, 'desc': catDesc})
                  }).then(res => res.json()).then(data => {
                    console.log(data);setCatDesc('');setCatName('');
                  })
                }}>Add cat</button>
                <button onClick={() => console.log(`${catName} ${catDesc}`)} >debug</button>
                  </center>
              </div>}
          </div>
      // END ADMIN
     } else{
       // USER
      return catViewer
      // END USER
     }

     } 

    function MapPopup({lngLat, mapInstance}: {lngLat: LngLatWithID, mapInstance: any}) {
    const [added, setAdded] = useState(false);

      if(permissions == 0){
        // ADMIN
      const addMarker = () => {
      // add marker to database
      fetch(PIN_URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(lngLat)}).then(
          res => res.json()
    )
    .then(data => {
      const deleteNode = document.createElement('div');
      const root = ReactDOM.createRoot(deleteNode);
      // NOTE; this part is wonky because when you create the marker popup
      // the id is not known until response is received from the server with the id
      const newLngLat = {
        'id': data.id, 'lat': lngLat.lat, 'lng': lngLat.lng
      };
      root.render(<MarkerPopup  mapInstance={map.current} lngLat={newLngLat}/>);


    const newMarker = new maplibregl.Marker({color: "#FF0000"})
      .setLngLat([lngLat.lng, lngLat.lat])
      .setPopup(new maplibregl.Popup().setDOMContent(deleteNode))
      .addTo(mapInstance);

    const newValue = [...markersRef.current, {'marker': newMarker, 'id': data.id}];
    markersRef.current = newValue;
    setMarkers(newValue)
    })
    }
    
      return added ? <h4>Please close the window</h4> : (
          <div style={{ padding: '10px', maxWidth: '200px' }}>
              <h3>Adding a new Marker</h3>
              <p><strong>Latitude:</strong> {lngLat.lat}</p>
              <p><strong>Longitude:</strong> {lngLat.lng}</p>
              <h4>Are you sure you want to add a new marker here?</h4>
              <button onClick={() => {setAdded(true);addMarker()}}>Yes</button>
          </div>
      );
      // END ADMIN
    } else{

      // USER 
      return <div style={{ padding: '10px', maxWidth: '200px' }}>
              <h3>Do you know any cats here?</h3>
          </div>
      // END USER
    }
    }

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
          [-74.270056,40.494061],
          [-73.663062,40.957187]
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
          const initMarkerState = pins.map((pin: Pin) => {
            const deleteNode = document.createElement('div');
            const root = ReactDOM.createRoot(deleteNode);
            const lngLatProp  : LngLatWithID = {
              id: pin.id,
              lng: pin.lng,
              lat: pin.lat
            }
            // root.render(<MarkerPopup  mapInstance={map.current} lngLat={lngLatProp}/>);
            
            const newMarker = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([pin.lng, pin.lat])
            // .setPopup(new maplibregl.Popup().setDOMContent(deleteNode)) 
            .addTo(map.current!);
            return {'marker': newMarker, 'id': pin.id};
          })
          console.log(initMarkerState)
          markersRef.current = initMarkerState; 
          setMarkers(initMarkerState);
        })

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('click', (e) => {
            const { lngLat } = e;
            const lngLatProp: LngLatWithID = {
              id: null,
              lng: lngLat.lng,
              lat: lngLat.lat
            }
            setCurrentLngLat(lngLatProp);
            console.log('asfasdf')
            console.log(markersRef.current)

            // const popupNode = document.createElement('div');
            // const root = ReactDOM.createRoot(popupNode);
            // root.render(<MapPopup lngLat={lngLatProp} mapInstance={map.current}/>);

            // new maplibregl.Popup({closeOnClick: true})
            // .setLngLat([lngLatProp.lng, lngLatProp.lat])
            // .setDOMContent(popupNode)
            // .addTo(map.current!);
          });

      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [lng, lat, zoom]);

      const [isPanelExpanded, setIsPanelExpanded] = useState(true); // Initially expanded
      const [isPanelExpanded2, setIsPanelExpanded2] = useState(true); // Initially expanded

      const togglePanel = () => {
        setIsPanelExpanded(!isPanelExpanded); // Toggle visibility
      };
      const togglePanel2 = () => {
        console.log('setting isPanelExpanded to', !isPanelExpanded)
        setIsPanelExpanded2(!isPanelExpanded2); // Toggle visibility
      };

      return (
        <div style={{overflow: 'hidden'}}>
          <NavigationPanel isPanelExpanded={isPanelExpanded} map={map}/>
          <button 
            onClick={togglePanel} 
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 1000,
              background: 'gray',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
            }}
               >
            ☰ {/* Hamburger Icon */}
          </button>
          <div style={{  position: 'absolute', width: '97%', height: isPanelExpanded ?'73%' :'98%'}}
            ref={mapContainer} className="map" />
          <button 
            onClick={togglePanel2} 
            style={{
              position: 'absolute',
              zIndex: 999,
              bottom: '30px',
              left:'10px',
              background: 'gray',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
            }}
               >
            ☰ {/* Hamburger Icon */}
          </button>
          <SidePanel isPanelExpanded2={isPanelExpanded2} currentLngLat={currentLngLat} markers={markers}/>
        </div>
      );
}