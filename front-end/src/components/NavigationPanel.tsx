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

export function NavigationPanel({map, isPanelExpanded, currentUser, toggleShowSignIn, showSignIn}: {map: any, isPanelExpanded: boolean, currentUser: string, toggleShowSignIn: any, showSignIn: boolean}){
    return (
            <div style={{ position: 'relative',
                width: '100%',
                backgroundColor: 'hwb(0 82% 8%)',
                height: isPanelExpanded ? '20%' : '0'}}>
                        <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly', position: 'absolute', top: '20px'}}>
                            <SubwayToggleButton map={map}/>
                            <button className='button' onClick={() => map.current!.fitBounds([
                                [-74.270056,40.494061],
                                [-73.663062,40.957187]
                            ])}>Reset View</button>
                        </div>
                        <div style={{ height: '40px' }}></div>
                        <center>
                            <p>Move between boroughs</p>  
                        </center>
                        <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', /* 3 columns */
        gap: '10px', /* Space between buttons */
      }}>
                            {Object.keys(boroughs).map(boro => <button className='button' key={boro} onClick={() => map.current!.fitBounds(boroughs[boro])}>{boro}</button>)}
                            <div style={{ height: '3px' }}></div>
                        </div>
                        <div style={{ paddingBottom: '10px', paddingLeft: '5%'}}>
                            <button style={{fontWeight: 'bolder', display: showSignIn ? 'none' : currentUser.length > 0 ? 'none' :'inline-block', backgroundColor: '#00BB00', color: 'whitesmoke', marginRight: '5%', borderRadius: '3px', padding: '3px'}} onClick={toggleShowSignIn}>Sign in</button>
                            <div style={{display: 'inline-block'}}>{currentUser.length === 0 ? 'Not signed in  ':`Signed in as: ${currentUser}`} </div>
                        </div>
            </div>
    )
}