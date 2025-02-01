import {useState, useRef} from 'react';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';

const SERVER_URL = "http://127.0.0.1:5000";
const CAT_URL = SERVER_URL + "/cat"
const PHOTO_URL = SERVER_URL + "/photo"
import type {Cat} from './CatViewer'
const AWS_ACCESS_KEY_ID = 'AKIA2CUNLWDYSNUCDVM4';
const AWS_SECRET_ACCESS_KEY = 'EvS3YPFtAfhTM9kdnwv6eHbuGfFDNEpdGOqRpdr/';
const S3_BUCKET = 'catapp';
const REGION = "us-east-2";
const s3Client = new S3Client({
  region: REGION, // Change to your S3 region
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export function SingleCat({permissions, cat, cats, catSetter, fetchCats}: {permissions: number, cat: Cat,cats: Array<Cat>, catSetter: any, fetchCats: any}){
      function deleteCat(cat_id: string) {
                const deleteCatURL = `${CAT_URL}?cat_id=${cat_id}`;
                fetch(deleteCatURL, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => res.json()).then(_data => {
                    catSetter(cats.filter(x => x.id !== cat_id))
                })
            }
    
        function modifyCat(cat_id: string) {
            const deleteCatURL = `${CAT_URL}?cat_id=${cat_id}`;
            fetch(deleteCatURL, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cat_id,
                    fieldToUpdate,
                    newValue: catTextField
                })
            }).then(res => res.json()).then(_ => {
                fetchCats()
            })
        }

      const uploadFile = async () => {
            if(!file){
                alert('Upload a file please :)')
                return;
            }
            const res = await fetch(PHOTO_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_name: file.name,
                    cat_id: cat.id,
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
      };

        const adminMode = permissions === 0;
        const [catTextField, setCatTextField] = useState('');
        const [fieldToUpdate, setFieldToUpdate] = useState('name');
        const [file, setFile] = useState(null); 
        const fileInputRef = useRef(null); 
        

        const handleFieldChange = (e) => {
            setFieldToUpdate(e.target.value);
        };
        return (
            <div>
                {adminMode && <button style={{position: 'relative', top: '1em'}} onClick={() => deleteCat(cat.id)}>Delete {cat.name}</button>}
                <p style={{fontWeight: 'bold', marginBottom: '0px'}}>name: {cat.name}</p>
                <p style={{fontWeight: 'bold', marginTop: '1px', marginBottom: '1px'}}>desc: {cat.desc}</p>
                {adminMode && 
                <div>
                    <div>
                        <div style={{display: 'flex'}}>
                            <p>Updating: {fieldToUpdate}</p> 
                            <div style={{position: 'relative', top: '.9vw', left: '1vw'}}>
                                <button onClick={() => modifyCat(cat.id)}
                                disabled={!catTextField.length}>Update</button>
                            </div>
                        </div>
                        <div>
                            <label>
                                <input
                                type="radio"
                                value="name"
                                checked={fieldToUpdate === 'name'}
                                onChange={handleFieldChange}
                                />
                                Name
                            </label>

                            <label>
                                <input
                                type="radio"
                                value="desc"
                                checked={fieldToUpdate === 'desc'}
                                onChange={handleFieldChange}
                                />
                                Description
                            </label>
                        </div>
                    </div>
                    <input
                    type="text"
                    value={catTextField}
                    onChange={(e) => setCatTextField(e.target.value)}
                    placeholder={`${fieldToUpdate === 'name' ? 'Name': 'Desc'} of the Cat?`}
                    />
                    <input type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                    // setFile(e.target.files[0])
                    setFile(e.target.files[0])
                    // console.log(e.target.files[0])
                    }} />
                    
                    <button onClick={uploadFile}>Upload to S3</button>
                    {/* <button onClick={() => console.log(file)}>Upload to S3</button> */}
                </div>
                }
                
                {/* <img src="http://localhost:5000/download/download.jpeg" alt="My Image" /> */}
                <div style={{border: 'none', height: '.3em', backgroundColor: 'black', marginTop: '.4em'}}> </div>
            </div>
        );
}