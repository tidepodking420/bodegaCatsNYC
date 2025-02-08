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
                username: username.trim(),
                password: password.trim(),
            })
        }).then(res => res.json()).then(data => {
            if(data.message === 'successful-login'){
                setErrorMessage('');
                setCurrentUser(username);
                toggleShowSignIn();
                setUsername('');
                setPassword('');
            } else if(data.message === 'no-such-user'){
                setCurrentUser('');
                setErrorMessage(`"${username}" is not an existing user`)
            } else if(data.message === 'bad-password'){
                setErrorMessage(`"${password}" is not the password`);
                setCurrentUser('');
            }
        })
    }

    function signUp(){
        fetch(LOGIN_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.trim(),
                password: password.trim()
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if(data.message !== 'success'){
                setSignUpErrorMessage(data.message);
            } else{
                setCurrentUser(username);
                setSignUpErrorMessage('');
                toggleShowSignIn();
                setUsername('');
                setPassword('');
             }
        })
    }


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
    const [doSignUp, setDoSignUp] = useState(false);

    // const []
    const inputs = <div>
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
</div>;


    return (
        <div style={{position: 'relative', bottom: '20px'}}>
                { !doSignUp ? 
            <center>
                <button 
                    className='mobile-button'
                    onClick={toggleShowSignIn}
                    style={{backgroundColor: 'red', width: '13%', 
                    position: 'relative', top: '15px', right: '46%'}}>X</button>
                <h2 >Sign in</h2>
                <p style={{margin: '0px', position: 'relative', bottom: '20px'}}>Note: This is only required to make cat submissions 😺</p>
                <p style={{position: 'relative' ,color: 'red', fontSize: 'bolder', margin: '0px', left: '5%'}}>{errorMessage}</p>
                {inputs}
                <button 
                    className='mobile-button'
                    style={{backgroundColor: '#00BB00', marginRight: '5%', position: 'relative', top: '10px', left: '10px'}}
                    onClick={() => {login()}}>Sign in</button>
                <br/>
                <div style={{position: 'relative', top: '20px'}}>
                    <p style={{display: 'inline-block', marginRight: '2%'}}>Don't have an account?</p>
                    <button
                        className='mobile-button'
                        style={{display: 'inline-block', backgroundColor: '#0096FF', marginRight: '5%'}}
                        onClick={() => setDoSignUp(!doSignUp)}>Sign Up</button>
                </div> 
            </center>:
                <div style={{position: 'relative', top: '20px'}}>
                    <center>
                        <h2 style={{marginBottom: '0px'}}>Sign up</h2>
                        <button 
                            className='mobile-button'
                            onClick={() => setDoSignUp(!doSignUp)}
                            style={{backgroundColor: 'red', position: 'relative', top: '-45px', 
                            right: '40%'}}>Go Back</button>
                        <p style={{position: 'relative' ,color: 'red', fontSize: 'bolder', margin: '0px', left: '5%'}}>{signUpErrorMessage}</p>
                        {inputs}
                        <button 
                            className='mobile-button'
                            onClick={() => signUp()}
                            style={{backgroundColor: '#0096FF', marginTop: '5px'
                            }}>Sign up</button>
                    </center>
                </div>}
        </div>
    );
}