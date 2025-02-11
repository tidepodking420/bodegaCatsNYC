const S3_BUCKET = import.meta.env.VITE_S3_BUCKET;
const REGION = import.meta.env.VITE_REGION;
import type {QueueItem} from './Admin'

const GET_PHOTO_URL = (key: number | string) => `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${key}`


export function UserItem({queueItem} : {queueItem: QueueItem}){

    const {id, lat, lng, created_at, catName, catDesc, decision ,username, awsuuid} = queueItem
    return (
         <div className='queue-item' key={id}>
            <p style={{display: 'inline-block'}}>{'lat/lng:\t'}</p>
            <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
                {lat} {lng}
            </a>
            <p>created_at: {created_at}</p>
            <p>cat name: {catName}</p>
            <p>cat description: {catDesc}</p>
            <p>username: {username}</p>
            <p>decision: {decision}</p>
            <center>
                <img src={GET_PHOTO_URL(awsuuid)} alt={`${awsuuid}`} width={'75%%'}/>
            </center>
         </div>
    );
}