import {useState} from 'react';

export function UserSignOn({toggleShowSignIn}: {toggleShowSignIn: any}){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div style={{position: 'relative', bottom: '20px'}}>
            <center>
            <button 
                onClick={toggleShowSignIn}
                style={{backgroundColor: 'red', width: '13%', position: 'relative', top: '15px', 
                right: '46%', borderWidth: '1px', color: 'white'}}>X</button>
            <h2 >Sign in</h2>
            <p style={{margin: '0px', position: 'relative', bottom: '20px'}}>Note: This is only required to make cat submissions 😺</p>
            <label style={{marginRight: '2%'}} htmlFor="username">Username:</label>
            <br/>
            <input
                style={{marginBottom: '2%'}}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="cat_lover24"
                />
            <label style={{marginRight: '2%'}} htmlFor="password">Password:</label>
            <input
                id="password"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="qwerty01"
                />
                </center>
        </div>
    );
}