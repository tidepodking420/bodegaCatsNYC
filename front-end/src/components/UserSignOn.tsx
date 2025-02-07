import {useState} from 'react';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const LOGIN_URL = VITE_SERVER_URL + "/login";

export function UserSignOn({toggleShowSignIn, setCurrentUser}: {toggleShowSignIn: any, setCurrentUser:any}){

    function login(){
        fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => res.json()).then(data => {
            if(data.message === 'successful-login'){
                setErrorMessage('');
                setCurrentUser(username);
                toggleShowSignIn();
            } else if(data.message === 'no-such-user'){
                setCurrentUser('');
                setErrorMessage(`"${username}" is not an existing user`)
            } else if(data.message === 'bad-password'){
                setErrorMessage(`"${password}" is not the password`);
                setCurrentUser('');
            }
        })
    }


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    return (
        <div style={{position: 'relative', bottom: '20px'}}>
            <center>
                <button 
                    onClick={toggleShowSignIn}
                    style={{backgroundColor: 'red', width: '13%', position: 'relative', top: '15px', 
                    right: '46%', borderWidth: '1px', color: 'white', fontWeight: 'bolder',
                    borderRadius: '3px'}}>X</button>
                <h2 >Sign in</h2>
                <p style={{margin: '0px', position: 'relative', bottom: '20px'}}>Note: This is only required to make cat submissions 😺</p>
                <p style={{position: 'relative' ,color: 'red', fontSize: 'bolder', margin: '0px', left: '5%'}}>{errorMessage}</p>
                <div>
                    <input
                        style={{marginBottom: '2%', width: '65%', height: '20px'}}
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        />
                    <input
                        style={{width: '65%',  height: '20px'}}
                        id="password"
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        />
                </div>
                <button style={{backgroundColor: '#00BB00', color: 'whitesmoke', marginRight: '5%', fontWeight: 'bolder', position: 'relative', top: '10px', left: '10px', borderRadius: '3px', padding: '3px'}} onClick={() => {login()}}>Sign in</button>
                <br/>
                <div style={{position: 'relative', top: '20px'}}>
                    <p style={{display: 'inline-block', marginRight: '2%'}}>Don't have an account?</p>
                    <button style={{display: 'inline-block', backgroundColor: '#0096FF', color: 'whitesmoke', marginRight: '5%', fontWeight: 'bolder', position: 'relative', borderRadius: '3px', padding: '3px'}}>Sign Up</button>
                </div>
            </center>
        </div>
    );
}