import React, { useRef, useEffect, useState } from 'react';
// import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import './map.css';

const API_KEY_URL = "http://127.0.0.1:5000/api_key/map_tiler";

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lng = 139.753;
    const lat = 35.6844;
    const zoom = 14;
    const [apiKey, setApiKey] = useState('')

    useEffect(() => {
        fetch(API_KEY_URL).then(
            res => res.json()
        ).then(data => setApiKey(data.map_tiler))
    }, [])

    return <div>{apiKey}</div>
}