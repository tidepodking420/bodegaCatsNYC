import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../assets/Map.css';
import ReactDOM from 'react-dom/client';
import { CatViewer } from './CatViewer';
import { subwayLayerStyles } from './data/subway-layer-styles.ts';

const SERVER_URL = "http://127.0.0.1:5000";
const PIN_URL = SERVER_URL + "/pin";
const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

// next steps
// figure out how I can deploy my flask/react application
// how to make mobile friendly interfaces
// how to associate the pins with cats, how to represent the cats
type Marker = {
    marker: maplibregl.Marker,
    id: number
};
type LngLatWithID = {
  id: number | null, lat: number, lng: number
};
type Mapish = maplibregl.Map | null;
type Pin = {
id: number,
lat: number
lng: number,
cats: Array<number>
};

// 0 for admin, 1 for user
export default function Map({permissions}: {permissions: number}){
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

     // see note; be careful about assumptions with lngLat
     function MarkerPopup({mapInstance, lngLat} : {mapInstance : any, lngLat: LngLatWithID}){
       const [catName, setCatName] = useState("");
 const [catDesc, setCatDesc] = useState("");
 const [selectedOption, setSelectedOption] = useState('admin');
 const catViewer = lngLat.id && <CatViewer pin_id={lngLat.id}/>;
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
                  Option 1
              </label>
              <label>
                  <input 
                      type="radio" 
                      value="viewer" 
                      checked={selectedOption === 'viewer'} 
                      onChange={(e) => setSelectedOption(e.target.value)} 
                  />
                  Option 2
              </label>
              {selectedOption === 'viewer' ? <div>
                {catViewer}
              </div> :
              <div> 
                <h3>Do you want to delete this pin?</h3>
                <p><strong>Latitude:</strong> {lngLat.lat}</p>
                <p><strong>Longitude:</strong> {lngLat.lng}</p>
                <center>
                <button onClick={() => {
                fetch(PIN_URL, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({'id': lngLat.id})
                }).then(res => res.json()).then(data => {
                  console.log(data);
                  const markerToDelete = markersRef.current.filter(pin => pin.id === lngLat.id)[0].marker;
                  markerToDelete.remove();
                  const filteredMarkers = markersRef.current.filter(pin => pin.id !== lngLat.id);
                  markersRef.current = filteredMarkers;
                  setMarkers(filteredMarkers)
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
                <button 
                disabled={!catName.length || !catDesc.length}
                onClick={() => {
                  fetch(PIN_URL, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'id': lngLat.id, 'name': catName, 'desc': catDesc})
                  }).then(res => res.json()).then(data => {
                    console.log(data);
                  })
                }}>Add cat</button>
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
            <button onClick={() => {
                subwayLayerStyles.forEach((style) => {
                  // TODO get toggle feature working
                  map.current!.removeLayer(style.id)
                })
        
                map.current!.removeSource('nyc-subway-routes');
        
                map.current!.removeSource('nyc-subway-stops');
            }}>turn off yellow</button>
             <button onClick={() => {
                // add geojson sources for subway routes and stops
        map.current!.addSource('nyc-subway-routes', {
          type: 'geojson',
          data: 'static/assets/data/nyc-subway-routes.geojson'
        });

        map.current!.addSource('nyc-subway-stops', {
          type: 'geojson',
          data: 'static/assets/data/nyc-subway-stops.geojson'
        });

        // add layers by iterating over the styles in the array defined in subway-layer-styles.js
        subwayLayerStyles.forEach((style) => {
          map.current!.addLayer(style)
        })
            }}>turn on</button>
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
          data: 'static/assets/data/nyc-subway-routes.geojson'
        });

        map.current!.addSource('nyc-subway-stops', {
          type: 'geojson',
          data: 'static/assets/data/nyc-subway-stops.geojson'
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
            root.render(<MarkerPopup  mapInstance={map.current} lngLat={lngLatProp}/>);
            
            const newMarker = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([pin.lng, pin.lat])
            .setPopup(new maplibregl.Popup().setDOMContent(deleteNode)) 
            .addTo(map.current!);
            return {'marker': newMarker, 'id': pin.id};
          })
          console.log(initMarkerState)
          markersRef.current = initMarkerState; 
          setMarkers(initMarkerState);
        })

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('dblclick', (e) => {
            const { lngLat } = e;
            const lngLatProp: LngLatWithID = {
              id: null,
              lng: lngLat.lng,
              lat: lngLat.lat
            }
            console.log(markersRef.current)

            const popupNode = document.createElement('div');
            const root = ReactDOM.createRoot(popupNode);
            root.render(<MapPopup lngLat={lngLatProp} mapInstance={map.current}/>);

            new maplibregl.Popup({closeOnClick: true})
            .setLngLat([lngLatProp.lng, lngLatProp.lat])
            .setDOMContent(popupNode)
            .addTo(map.current!);
          });

      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [lng, lat, zoom]);


      return (
        <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        </div>
      );
}