import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';
import ReactDOM from 'react-dom/client';

const SERVER_URL = "http://127.0.0.1:5000/";
const API_KEY_URL = SERVER_URL + "api_key/map_tiler";
const PIN_URL = SERVER_URL + "/pin";

// later steps
// how can i set up multiple pages
// admin and user screen

// immediate next step
// be able to click on the map to add a pin
// if I reload then that pin should be persistent ----- current step
// use flask backend to save the pins as I go
// when I reload this page, I should initialize with those pins

// I should also be able to delete pins

// I want to be able to associate cats with these pins eventually



export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lat = 40.7632571;
    const lng = -73.932958;
    const zoom = 11;
    const [apiKey, setApiKey] = useState('');

    function MarkerPopup({lngLat, mapInstance}) {
      // add the marker to UI
      const addMarker = () => {new maplibregl.Marker({color: "#FF0000"})
      .setLngLat([lngLat.lng, lngLat.lat])
      .addTo(mapInstance);

      // add marker to database

      fetch(PIN_URL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(lngLat)}).then(
        res => res.json()
    ).then(data => console.log(data))
    

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
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('dblclick', (e) => {
            const { lngLat } = e;

            const popupNode = document.createElement('div');
            const root = ReactDOM.createRoot(popupNode);
            root.render(<MarkerPopup lngLat={lngLat} mapInstance={map.current}/>);

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