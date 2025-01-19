import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const lng = 139.753;
    const lat = 35.6844;
    const zoom = 14;
    const API_KEY = 'YOUR_API_KEY'
}