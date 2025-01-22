import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import ReactDOM from 'react-dom/client';
import { CatViewer } from './CatViewer';

const SERVER_URL = "http://127.0.0.1:5000";
const API_KEY_URL = SERVER_URL + "/api_key/map_tiler";
const PIN_URL = SERVER_URL + "/pin";

// next steps
// figure out how I can deploy my flask/react application
// how to make mobile friendly interfaces
// how to associate the pins with cats, how to represent the cats


// 0 for admin, 1 for user
export default function Map({permissions}){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lat = 40.7632571;
    const lng = -73.932958;
    const zoom = 11;
    const [apiKey, setApiKey] = useState('');
    // {
    // marker: maplibregl.marker
    // id: int
    // }
    const [markers, setMarkers] = useState([]);
    const markersRef = useRef([]);

     // see note; be careful about assumptions with lngLat
     function MarkerPopup({mapInstance, lngLat}){
       const [catName, setCatName] = useState("");
 const [catDesc, setCatDesc] = useState("");
 const [selectedOption, setSelectedOption] = useState('admin');
 const catViewer = <CatViewer pin_id={lngLat.id}/>
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
                rows="7"
                cols="20"
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

    function MapPopup({lngLat, mapInstance}) {
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
    
    const [added, setAdded] = useState(false);
      return added ? <h4>Please close the window</h4> : (
          <div style={{ padding: '10px', maxWidth: '200px' }}>
              <h3>Adding a new Marker</h3>
              <p><strong>Latitude:</strong> {lngLat.lat}</p>
              <p><strong>Longitude:</strong> {lngLat.lng}</p>
              <h4>Are you sure you want to add a new marker here?</h4>
              <button onClick={() => {setAdded(true);addMarker(lngLat, mapInstance)}}>Yes</button>
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
        fetch(API_KEY_URL).then(
            res => res.json()
        ).then(data => setApiKey(data.map_tiler))
    }, [])

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
        if (apiKey.length === 0) return; // wait until apiKey is fetched
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`,
          center: [lng, lat],
          zoom: zoom,
          doubleClickZoom: false,
        });

        // add pins from dbmapInstance
        fetch(PIN_URL).then(res => res.json()).then(data => {
          const {pins} = data;
          const initMarkerState = pins.map(pin => {
            const deleteNode = document.createElement('div');
            const root = ReactDOM.createRoot(deleteNode);
            root.render(<MarkerPopup  mapInstance={map.current} lngLat={pin}/>);
            
            const newMarker = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([pin.lng, pin.lat])
            .setPopup(new maplibregl.Popup().setDOMContent(deleteNode)) 
            .addTo(map.current);
            return {'marker': newMarker, 'id': pin.id};
          })
          console.log(initMarkerState)
          markersRef.current = initMarkerState; 
          setMarkers(initMarkerState);
        })

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('dblclick', (e) => {
            const { lngLat } = e;
            console.log(markersRef.current)

            const popupNode = document.createElement('div');
            const root = ReactDOM.createRoot(popupNode);
            root.render(<MapPopup lngLat={lngLat} mapInstance={map.current}/>);

            new maplibregl.Popup({closeOnClick: true})
            .setLngLat([lngLat.lng, lngLat.lat])
            .setDOMContent(popupNode)
            .addTo(map.current);
          });

      
      }, [apiKey, lng, lat, zoom]);


      return (
        <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        </div>
      );
}