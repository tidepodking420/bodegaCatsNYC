const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const QUEUE_URL = VITE_SERVER_URL + "/queue"

export function Admin(){

    fetch(QUEUE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json()).then(data => console.log(data))

    return (
        <h1>Super Secret Admin screen</h1>
    );
}