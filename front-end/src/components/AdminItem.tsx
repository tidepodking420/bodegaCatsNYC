const S3_BUCKET = import.meta.env.VITE_S3_BUCKET;
const REGION = import.meta.env.VITE_REGION;
import type {QueueItem} from './Admin'
import {useState} from 'react'

const GET_PHOTO_URL = (key: number | string) => `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`


export function AdminItem({queueItem, confirmOrReject} : {queueItem: QueueItem, confirmOrReject: any}){

    const [selectedOption, setSelectedOption] = useState('');
    const {id, lat, lng, created_at, catName, catDesc, username, awsuuid} = queueItem
    return (
         <div className='queue-item' key={id}>
            <center>
                <p style={{display: 'inline-block'}}>id: {id}</p>
                <div style={{display: 'inline-block'}}>
                    <label>
                    <input 
                        type="radio" 
                        value="accept" 
                        checked={selectedOption === 'accept'} 
                        onChange={(e) => setSelectedOption(e.target.value)} 
                    />
                    Accept
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="reject" 
                            checked={selectedOption === 'reject'} 
                            onChange={(e) => setSelectedOption(e.target.value)} 
                        />
                        Reject
                    </label>
                </div>
                <button onClick={() => {
                    if(selectedOption.length === 0){
                        alert('Choose an option')
                        return;
                    }
                    confirmOrReject(id, selectedOption, awsuuid, username, lat, lng, catName, catDesc)
                    }} >Confirm selection: {selectedOption}</button>
                <div>
                    <p style={{display: 'inline-block'}}>{'lat/lng:\t'}</p>
                    <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
                        {lat} {lng}
                    </a>
                </div>
                <p>created_at: {created_at}</p>
                <p>cat name: {catName}</p>
                <p>cat description: {catDesc}</p>
                <p>username: {username}</p>
                <img src={GET_PHOTO_URL(awsuuid)} alt={`${awsuuid}`} width={'75%%'}/>
             </center>
         </div>
    );
}