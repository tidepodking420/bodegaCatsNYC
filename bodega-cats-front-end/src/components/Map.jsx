import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';

const API_KEY_URL = "http://127.0.0.1:5000/api_key/map_tiler";

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lat = 40.7632571;
    const lng = -73.932958;
    const zoom = 11;
    const [apiKey, setApiKey] = useState('')

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
          zoom: zoom
        });
        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        new maplibregl.Marker({color: "#FF0000"})
        .setLngLat([-73.9960136, 40.7505045])
        .addTo(map.current);

      
      }, [apiKey, lng, lat, zoom]);

      return (
        <div className="map-wrap">
          <div ref={mapContainer} className="map" />
        </div>
      );
}