const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const QUEUE_URL = VITE_SERVER_URL + "/queue"
import {useState, useEffect} from 'react'
import { AdminItem } from './AdminItem';

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


export function Admin(){

    function confirmOrReject(queue_id: number, selection: boolean){
        fetch(QUEUE_URL + `?queue_id=${queue_id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => {
            console.log(data)
            // TODO confirm success from server
            const newQueue = queue.filter(item => item.id === queue_id);
            console.log('newQueue', selection)
            console.log(newQueue)
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
    }, [queue])

    return (
        <div>
            <center><h1>Super Secret Admin screen</h1></center>
            <div className='queue-grid'>
                {queue.map(queueItem => <AdminItem key={`adminItem-${queueItem.id}`} queueItem={queueItem} confirmOrReject={confirmOrReject}/>)}
            </div>
        </div>
    );
}
