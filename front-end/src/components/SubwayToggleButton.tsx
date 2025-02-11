import { subwayLayerStyles } from './data/subway-layer-styles.ts';
import { useState } from 'react';


export function SubwayToggleButton({map}: {map: any}){
    const [showSubway, setShowSubway] = useState(true);

    return (
        <div style={{display: 'inline-block'}}>
        <button className='mobile-button nav-button' onClick={() => {
            if(showSubway){
            subwayLayerStyles.forEach((style) => {
            map.current!.removeLayer(style.id)
            })
    
            map.current!.removeSource('nyc-subway-routes');
    
            map.current!.removeSource('nyc-subway-stops');
        } else{
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
        }
        setShowSubway(!showSubway);
        }}>{showSubway ? 'Hide subways' : 'Show subways'}</button>
    </div>
    )
}