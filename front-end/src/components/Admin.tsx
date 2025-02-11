const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const QUEUE_URL = VITE_SERVER_URL + "/queue"
import {useState, useEffect} from 'react'
import { AdminItem } from './AdminItem';
import {DeleteObjectCommand, S3Client} from '@aws-sdk/client-s3';

export type QueueItem = {
    id: number,
    lat: string,
    lng: string,
    created_at: string,
    catName: string,
    catDesc: string,
    username: string,
    awsuuid: string
};

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


export function Admin(){

    async function deletePhotoAWS(awsuuid: string) {
                const params = {
                    Bucket: S3_BUCKET,
                    Key: awsuuid,  // Use the same key (ID) as when uploading
                };
                const command = new DeleteObjectCommand(params);
                    await s3Client.send(command);
                    console.log("Photo deleted successfully! in AWS");
            }

    function confirmOrReject(queue_id: number, selection: string, awsuuid: string, username, lat: string, lng: string, catName: string, catDesc){
        fetch(QUEUE_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({queue_id, selection, username, lat, lng, catName, catDesc, awsuuid})
        }).then(res => res.json()).then(data => {
            console.log(data)
            const newQueue = [...queue.filter(item => item.id !== queue_id)];
            console.log('newQueue')
            console.log(newQueue)
            setQueue(newQueue);
            if(data.message === 'success' && selection === 'reject'){
                deletePhotoAWS(awsuuid)
            }
        })
    }



    const [queue, setQueue] = useState<Array<QueueItem>>([]);
    useEffect(() => {
        fetch(QUEUE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => setQueue(data.queue))
    }, [])

    return (
        <div>
            <center><h1>Super Secret Admin screen</h1></center>
            <div className='queue-grid'>
                {queue.map(queueItem => <AdminItem key={`adminItem-${queueItem.id}`} queueItem={queueItem} confirmOrReject={confirmOrReject}/>)}
            </div>
        </div>
    );
}
