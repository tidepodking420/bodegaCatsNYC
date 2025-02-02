import {SubwayToggleButton} from './SubwayToggleButton';

// latitude gets smaller going towards equator
// longitude gets smaller going towards prime meridian
const boroughs = {
    'Brooklyn': [
        [-74.047941,40.566483], //  Southwest corner [lng, lat]
        [-73.873965,40.713546]  // Northeast corner [lng, lat]
    ],
    'Staten Island': [
        [-74.2597992,40.4989168], //  Southwest corner [lng, lat]
        [-74.048804,40.651149]  // Northeast corner [lng, lat]
    ],
    'Manhattan': [
        [-74.056585,40.689817], //  Southwest corner [lng, lat]
        [-73.900914,40.819946], // Northeast corner [lng, lat]
    ],
    'Queens': [
        [-73.960218,40.650406], // Northeast corner [lng, lat]
        [-73.734989,40.800880] //  Southwest corner [lng, lat]
    ],
    'The Bronx': [
        [-73.99274030794437,40.80331170174773], // Northeast corner [lng, lat]
        [-73.76776833668698,40.88514871792606] //  Southwest corner [lng, lat]
    ],
    'New Jersey': [
        [-74.0532444,40.6957937], // Northeast corner [lng, lat]
        [-73.9929967,40.8093041] //  Southwest corner [lng, lat]
    ],
};

export function NavigationPanel({map}: {map: any}){
    return (
        <div className="navigation-panel">
                <center>
                    <h1>Navigation Panel</h1>
                    <SubwayToggleButton map={map}/>
                    <div style={{marginTop: '3em'}}>
                        <button onClick={() => map.current!.fitBounds([
                            [-74.270056,40.494061],
                            [-73.663062,40.957187]
                        ])}>Reset View</button>
                        <h3>Move between boroughs</h3>  
                        {Object.keys(boroughs).map(boro => <button key={boro} onClick={() => map.current!.fitBounds(boroughs[boro])}>{boro}</button>)}
                    </div>
                </center>
        </div>
    )
}