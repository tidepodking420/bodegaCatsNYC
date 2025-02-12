import type { LngLatWithID, Marker } from "./Map"
import {useSelector } from "react-redux";
import { RootState } from "./redux/CatStore";
import { BasicCat } from "./BasicCat";
import { UserItem } from "./UserItem";
import { useRef, useState, useEffect } from "react";
import type {QueueItem} from './Admin'
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
import {v4 as uuidv4} from 'uuid';
const QUEUE_URL = VITE_SERVER_URL + "/queue"
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
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
    setCurrentLngLat: any;
    markers: Array<Marker>;
    currentUser: string;
    placingPin: boolean;
    setPlacingPin: any;
    placingPinRef: any;
    newPinRef: any;
    setIsPanelExpanded: any;
    map: any;
  }
// Show all of the cats

// next step: show the user and the 
export function SidePanel({isPanelExpanded2, currentLngLat, setCurrentLngLat, markers, currentUser, placingPin, setPlacingPin, placingPinRef, newPinRef, setIsPanelExpanded, map}: SidePanelProps) {

    const cats = useSelector((state: RootState) => state.cats.cats);
    const [reviewMode, setReviewMode] = useState(false);
    const [addingCatMode, setAddingCatMode] = useState(false);

    const [queue, setQueue] = useState<Array<QueueItem>>([]);
    async function updateQueue() {
        fetch(QUEUE_URL + `?username=${currentUser}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => setQueue(data.queue))
    }
    useEffect(() => {
        if(currentUser.length > 0){
            updateQueue();
        }
    }, [currentUser])

        
    const selectedPin = markers.filter(marker => marker.selected);
        
    useEffect(() => {
        console.log('new value of selectedPIn');console.log(selectedPin)
        if(selectedPin.length > 0){
            // confirmed to have a selected pin at this point
            const {lng, lat} = selectedPin[0].marker.getLngLat();
            // console.log('TRUTH', lng, lat)
            // bottom left, then top right
            const offset = 0.02;
            map.current!.fitBounds([
                [lng - offset, lat - offset - .01],
                [lng + offset, lat + offset - .01]
              ])
        }
    }, [selectedPin])
    
    const [catName, setCatName] = useState('');
    const [catDesc, setCatDesc] = useState('');

    const [imageSource, setImageSource] = useState(null);
    const [clicked, setClicked] = useState(false);

    const [file, setFile] = useState(null); 
    const fileInputRef = useRef(null); 
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [errorText, setErrorText] = useState('');

      async function submitToQueue() {
          // add marker to database
          if(!file){
            const noFileMessage = 'Upload a file please :)';
             console.log(noFileMessage)
             setErrorText(noFileMessage);
             return;
          }
          console.log('inside add marker')
            setLoading(true);
          const newPhotoId = uuidv4();
          console.log('newPhotoId', newPhotoId)
          setLoading(true)
             fetch(QUEUE_URL, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'lat': currentLngLat.lat,
                'lng': currentLngLat.lng,
                'username': currentUser,
                catName, 
                catDesc,
                'awsuuid': newPhotoId
            })}).then(res => res.json()).then(data => {
                console.log(data)
                if(data.message === 'success'){
                    uploadFile(newPhotoId);
                    setCatDesc('');
                    setCatName('');
                    setErrorText('');
                    setChecked(false);
                    newPinRef.current.remove();
                    newPinRef.current = null;
                    setCurrentLngLat({
                        id: null,
                        lat: -1,
                        lng: -1
                      });
                    alert('SUCCESS! Now wait for your post to be approved. Check the status in the "review" tab')
                } else{
                    setErrorText(data.message);
                }
            })
            .then(() => updateQueue())
        }

    const uploadFile = async (uuid_string: string) => {
                const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
                const uint8Array = new Uint8Array(arrayBuffer);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: uuid_string,
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
                    return "Upload failed";
                }
    
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset input field
                  }
                return '';
                //   getCatPhotos();
          };

          const reviewModeButton = <button
          onClick={() => {
              setReviewMode(!reviewMode);
          }}
          className="mobile-button user-login-button"
          style={{backgroundColor: !reviewMode ? 'blue' : 'red', display: 'inline-block', marginLeft: '2%'}}
          >{!reviewMode ? `Review` : 'Exit'}</button> 

          const addCatButton = <button
          onClick={() => {
              setIsPanelExpanded(false);
              setAddingCatMode(!addingCatMode)
          }}
          className="mobile-button user-login-button"
          style={{backgroundColor: 'yellowgreen'}}
          >Add a cat</button>;
          const catView = <div>
            {selectedPin[0] ? 
            cats.filter(cat => cat.pin_id === selectedPin[0].id).map(cat => <BasicCat key={cat.id} cat={cat} markers={markers}/>) : 
            cats.map(cat => <BasicCat key={cat.id} cat={cat} markers={markers}/>)}
            </div>

function moveToPin(){
    console.log('in the function')
    console.log(map.current!)
  }

    return (
        <div style={{
            position: 'absolute',
            width: '97%',
            bottom: '0px',
            height: isPanelExpanded2 ? addingCatMode ? '58%': '40%' : '0%',
            right: '3px',
            background: 'white',
            borderWidth: '1px',
            borderColor: 'black',
            borderStyle: 'solid',
            display: "flex",
            flexDirection: "column", // Stack children vertically
            overflow: 'scroll',
          }}>
            {!addingCatMode ? !reviewMode ? 
            <div>
                <div>
                    <div style={{display: 'inline-block', position: 'relative', left: '5%'}}>
                        {selectedPin[0] ? 'Cats at Pin View' : 'All cats view'}
                    </div>
                    {!selectedPin[0] && (currentUser.length > 0 ?
                    <div className="create-cats" style={{width: '80%'}}>
                        {addCatButton}
                        {reviewModeButton}
                    </div> : <p style={{display: 'inline-block', marginLeft: '10%'}}>Sign in to submit cats</p> )}
                </div>
                <div>
                    {catView}
                </div>
            </div> : 
            <div style={{position: 'relative', top: '.5em'}}>
                <center>
                    Review Cat Submissions
                    {reviewModeButton}
                    <div >
                        {queue.length > 0 ? queue.map(queueItem => <UserItem key={`userItem-${queueItem.id}`} queueItem={queueItem}/>) : <h2>No submissions made yet</h2>}
                    </div>
                </center>
            </div>
                : <div>
                    <p style={{display: 'inline-block'}}>Adding Cat Mode 🐈😻🐈</p> 
                    <button
                        onClick={() => {
                            placingPinRef.current = false;
                            setPlacingPin(false);
                            setAddingCatMode(!addingCatMode)
                        }}
                        className="mobile-button user-login-button"
                        style={{backgroundColor: '#BB0000', left: '110px', display: 'inline-block', position: 'relative', padding: '5px'}}
                        >Exit</button>
                    <div>

                        <button
                            onClick={() => {
                                const newValue = !placingPinRef.current;
                                placingPinRef.current = newValue;
                                setPlacingPin(newValue)

                                if(newPinRef.current !== null){
                                    newPinRef.current.setDraggable(!newPinRef.current.isDraggable());
                                }
                            }}
                            className="mobile-button user-login-button"
                            style={{backgroundColor: '#0000BB', marginBottom: '1%', position: 'relative', left: '20px', display: 'inline-block'}}
                            >{placingPinRef.current ? 'Placing pin' : 'Place Pin'}</button>
                        <p style={{position: 'absolute', fontSize: '13px', left: '4%', top: '18%', marginTop: '4%'}}>{placingPinRef.current ? '🔒 Lock in Place' : 'Touch Map & Drag Pin'}</p>
                        {/* <p style={{display: 'inline-block', marginLeft: '8%'}} >{currentLngLat.lat === -1 && currentLngLat.lng == -1 ? 'Not chosen' :`Lat: ${currentLngLat.lat.toPrecision(6).toString()} Lng: ${currentLngLat.lng.toPrecision(6).toString()}`}</p> */}
                        <center>
                            <p style={{color: 'red', margin: '0', width: '40%', left: '10%', position: 'relative'}}>{errorText}</p>
                            <button
                                // disabled={loading}
                                onClick={() => submitToQueue()}
                                className="mobile-button user-login-button"
                                style={{backgroundColor: '#00BB00', marginBottom: '1%'}}
                                >Submit</button>
                            <input
                                style={{display: 'block'}}
                                className="new-cat"
                                disabled={checked}
                                type="text"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                                placeholder='Name of the Cat?'
                            />
                            <label style={{position: 'absolute', left: '69%', fontSize: '12px', bottom: '24.5em'}}>
                                <input
                                    style={{position: 'relative', left: '40%', top: '4em', transform: 'scale(1.5)'}}
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                        setChecked(!checked);
                                        setCatName(!checked? 'Unknown kitty car 🐈🚗' : '')
                                    }
                                    }
                                />
                                Don't know the name?
                             </label>
                            <textarea
                                className='new-cat'
                                style={{display: 'block'}}
                                value={catDesc}
                                onChange={(e) => setCatDesc(e.target.value)}
                                placeholder='Description...'
                                rows={7}
                                cols={20}
                            />
                            <div>
                                <input
                                    type="file"
                                    style={{ position: 'relative', marginTop: '10px', left: '10%' }}
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                    const file = e.target.files[0]; // Get the selected file
                                    if (file) {
                                        setFile(file);
                                        const reader = new FileReader(); // Create a FileReader instance

                                        // Define the onload event handler
                                        reader.onload = (event) => {
                                            console.log(event.target.result)
                                            setImageSource(event.target.result);
                                        };

                                        reader.readAsDataURL(file); // Read the file as a data URL
                                    }
                                    }}
                                />
                                {file !== null && <img
                                    className='border'
                                    onClick={() => setClicked(!clicked)}
                                    src={imageSource}
                                    style={{ maxWidth: '80%', maxHeight: clicked ?  '40%' : '200px', marginTop: '10px', marginBottom: '100px' }}
                                />}
                            </div>
                        </center>
                    </div>
                </div>}   
        </div>
    )
}
