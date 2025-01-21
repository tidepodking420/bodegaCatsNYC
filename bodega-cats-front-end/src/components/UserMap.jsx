import { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';

const SERVER_URL = "http://127.0.0.1:5000/";
const API_KEY_URL = SERVER_URL + "api_key/map_tiler";
const PIN_URL = SERVER_URL + "/pin";

// next steps
// figure out how I can deploy my flask/react application
// how to make mobile friendly interfaces
// differentiate between me, priveleged users, and regular users
// how to associate the pins with cats, how to represent the cats


export default function Map(){
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
            const newMarker = new maplibregl.Marker({color: "#FF0000"})
            .setLngLat([pin.lng, pin.lat])
            .addTo(map.current);
            return {'marker': newMarker, 'id': pin.id};
          })
          markersRef.current = initMarkerState; 
          setMarkers(initMarkerState);
        })

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        map.current.on('dblclick', (e) => {
            const { lngLat } = e;

            new maplibregl.Popup({closeOnClick: true})
            .setLngLat([lngLat.lng, lngLat.lat])
            .addTo(map.current);
          });

      
      }, [apiKey, lng, lat, zoom]);


      return (
        <div className="map-wrap">
        <div ref={mapContainer} className="map" />
        </div>
      );
}