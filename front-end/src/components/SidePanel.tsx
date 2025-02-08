import type { LngLatWithID, Marker } from "./Map"
import {useSelector } from "react-redux";
import { RootState } from "./redux/CatStore";
import { BasicCat } from "./BasicCat";
import { useRef, useState } from "react";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const PHOTO_URL = VITE_SERVER_URL + "/photo"
import {DeleteObjectCommand, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const S3_BUCKET = import.meta.env.VITE_S3_BUCKET;
const REGION = import.meta.env.VITE_REGION;
const s3Client = new S3Client({
  region: REGION, // Change to your S3 region
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});


interface SidePanelProps {
    isPanelExpanded2: boolean;
    currentLngLat: LngLatWithID;
    markers: Array<Marker>;
    currentUser: string;
    placingPin: boolean;
    setPlacingPin: any;
    placingPinRef: any;
  }
// Show all of the cats

// next step: show the user and the 
export function SidePanel({isPanelExpanded2, currentLngLat, markers, currentUser, placingPin, setPlacingPin, placingPinRef}: SidePanelProps) {

    // const dispatch = useDispatch();
    const cats = useSelector((state: RootState) => state.cats.cats);
    const [addingCatMode, setAddingCatMode] = useState(false);


    const selectedPin = markers.filter(marker => marker.selected);
    
    // console.log('markers in side panel', markers)
    // console.log('cats', cats);

    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');

    const [file, setFile] = useState(null); 
    const fileInputRef = useRef(null); 
    const [loading, setLoading] = useState(false);
    // TODO Need to create a draggable pin
    // while in placing pin mode, be able to move the pin
    // make the pin the same color as the button thats placing it

    // start out with designing for just one cat
    // TODO create pin before creating a cat
    // TODO create a cat to associate with before file upload
    const uploadFile = async () => {
                // originally built this on the assumption of just one cat
                // one-to-many relationship between cats
                if(!file){
                    alert('Upload a file please :)')
                    return;
                }
                // TODO only set a pin before doing upload,
                // disable the button while doing an upload
                //
                const res = await fetch(PHOTO_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        file_name: file.name,
                        // cat_id: cat.id,
                        // TODO don;'t hard code thos
                        cat_id: "2",
                    })
                })
                const data = await res.json();
                console.log(data)
    
                const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
                const uint8Array = new Uint8Array(arrayBuffer);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: data.new_photo_id,
                    Body: uint8Array,
                    ContentType: file.type,
                };
                console.log(params)
                try {
                    const command = new PutObjectCommand(params);
                    await s3Client.send(command);
                    console.log("Upload successful!");
                } catch (error) {
                    console.error("Upload failed:", error);
                }
    
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset input field
                  }
                setLoading(false);
                //   getCatPhotos();
          };

        //   async function getCatPhotos(){
        //     // step 1: query db
        //     fetch(PHOTO_URL + `?cat_id=${cat.id}`, {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         }
        //     }).then(res => res.json()).then(data => {
        //         console.log(data)
        //         setCatPhotos(data.photos)
        //         // catSetter(cats.filter(x => x.id !== cat_id))
        //     })
        // }

    return (
        <div style={{
            position: 'absolute',
            width: '97%',
            bottom: '0px',
            height: isPanelExpanded2 ?'40%' : '0%',
            right: '3px',
            background: 'white',
            borderWidth: '1px',
            borderColor: 'black',
            borderStyle: 'solid',
            display: "flex",
            flexDirection: "column", // Stack children vertically
            overflow: 'scroll'
          }}>
            {!addingCatMode ?
            <div>
                <div>
                    <div style={{display: 'inline-block'}}>
                        {selectedPin[0] ? `Added by ${selectedPin[0].user_id} on ${selectedPin[0].created_at.toLocaleDateString()}` : 'All cats view'}
                    </div>
                    <div className="create-cats">
                        {currentUser.length > 0 ?
                        <button
                            onClick={() => setAddingCatMode(!addingCatMode)}
                            className="mobile-button user-login-button"
                            style={{backgroundColor: 'yellowgreen'}}
                            >Add a cat</button> : <p id='qer'>Sign in to submit cats</p>}
                    </div>
                </div>
                <div>
                    {selectedPin[0] ? cats.filter(cat => cat.pin_id === selectedPin[0].id).map(cat => <BasicCat key={cat.id} cat={cat} markers={markers}/>) : cats.map(cat => <BasicCat key={cat.id} cat={cat} markers={markers}/>)}
                </div>
            </div>
                : <div>
                    <p style={{display: 'inline-block'}}>Adding Cat Mode</p> 
                    <button
                        onClick={() => setAddingCatMode(!addingCatMode)}
                        className="mobile-button user-login-button"
                        style={{backgroundColor: '#BB0000', left: '200px', display: 'inline-block', position: 'relative', padding: '5px'}}
                        >Exit</button>
                    <div>

                        <button
                            onClick={() => {
                                const newValue = !placingPinRef.current;
                                placingPinRef.current = newValue;
                                setPlacingPin(newValue)
                            }}
                            className="mobile-button user-login-button"
                            style={{backgroundColor: '#0000BB', marginBottom: '1%', position: 'relative', left: '20px', display: 'inline-block'}}
                            >{placingPinRef.current ? 'Placing pin' : 'Place Pin'}</button>
                        <p style={{display: 'inline-block', marginLeft: '8%'}} >{currentLngLat.lat === -1 && currentLngLat.lng == -1 ? 'Not chosen' :`Lat: ${currentLngLat.lat.toPrecision(6).toString()} Lng: ${currentLngLat.lng.toPrecision(6).toString()}`}</p>
                        <center>
                            <button
                                onClick={() => alert('submitting to database')}
                                className="mobile-button user-login-button"
                                style={{backgroundColor: '#00BB00', marginBottom: '1%'}}
                                >Submit</button>
                            <input
                                style={{display: 'block'}}
                                className="new-cat"
                                type="text"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                                placeholder='Name of the Cat?'
                            />
                            <textarea
                                className='new-cat'
                                style={{display: 'block'}}
                                value={catDesc}
                                onChange={(e) => setCatDesc(e.target.value)}
                                placeholder='Description...'
                                rows={7}
                                cols={20}
                            />
                            <input type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                setFile(e.target.files[0])
                                }} />
                                
                            <button 
                                disabled={loading}
                                onClick={() => {
                                    setLoading(true)
                                    uploadFile();
                                }}>Save Image</button>
                        </center>
                    </div>
                </div>}   
        </div>
    )
}