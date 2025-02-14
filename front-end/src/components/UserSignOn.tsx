import {useState} from 'react';
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const LOGIN_URL = VITE_SERVER_URL + "/login";

export function UserSignOn({toggleShowSignIn, setCurrentUser}: {toggleShowSignIn: any, setCurrentUser:any}){


    const [loading, setLoading] = useState<boolean>()

    function login(){
        const newUsername = username.trim();
        setLoading(true);
        fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
                password: password.trim(),
            })
        }).then(res => res.json()).then(data => {
            if(data.message === 'successful-login'){
                setErrorMessage('');
                setCurrentUser(newUsername);
                toggleShowSignIn();
                setUsername('');
                setPassword('');
                localStorage.setItem('currentUser', newUsername);
            } else if(data.message === 'no-such-user'){
                setCurrentUser('');
                setErrorMessage(`"${username}" is not an existing user`)
            } else if(data.message === 'bad-password'){
                setErrorMessage(`"${password}" is not the password`);
                setCurrentUser('');
            }
        }).then(() => setLoading(false));
    }

    function signUp(){
        setLoading(true);
        const newUsername = username.trim();
        fetch(LOGIN_URL, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
                password: password.trim(),
                email: email.trim()
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if(data.message !== 'success'){
                setSignUpErrorMessage(data.message);
            } else{
                setCurrentUser(newUsername);
                setSignUpErrorMessage('');
                toggleShowSignIn();
                setUsername('');
                setPassword('');
                setEmail('');
                localStorage.setItem('currentUser', newUsername);
                alert('Check your email for verification link');
             }
        }).then(() => setLoading(false))
    }


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('');
    const [doSignUp, setDoSignUp] = useState(false);

    // const []
    const inputChildren = [<input
    className='sign-in'
    id="username"
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Username"
    />, 
<input
    className='sign-in'
    id="password"
    type="text"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    />, 
<input
    className='sign-in'
    id="email"
    type="text"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="crazyCatLady@aol.com"
    />];
    const loginInputs = <div>{inputChildren[0]}{inputChildren[1]} </div>;
    const signUpInputs = <div>{inputChildren[0]}{inputChildren[1]}{inputChildren[2]}</div>

    return (
        <div style={{position: 'relative', bottom: '20px'}}>
                { !doSignUp ? 
            <center>
                <button 
                    className='mobile-button user-login-button'
                    onClick={toggleShowSignIn}
                    style={{backgroundColor: 'red', width: '13%', 
                    position: 'relative', top: '15px', right: '46%'}}>X</button>
                <h2 >Sign in</h2>
                <p style={{margin: '0px', position: 'relative', bottom: '20px'}}>Note: This is only required to make cat submissions 😺</p>
                <p style={{position: 'relative' ,color: 'red', fontSize: 'bolder', margin: '0px', left: '5%'}}>{errorMessage}</p>
                {loginInputs}
                <button 
                    className='mobile-button user-login-button'
                    style={{backgroundColor: '#00BB00', marginRight: '5%', position: 'relative', top: '10px', left: '10px'}}
                    onClick={() => {login()}}>Sign in</button>
                <br/>
                <div style={{position: 'relative', top: '20px'}}>
                    <p style={{display: 'inline-block', marginRight: '2%'}}>Don't have an account?</p>
                    <button
                        disabled={loading}
                        className='mobile-button user-login-button'
                        style={{display: 'inline-block', backgroundColor: '#0096FF', marginRight: '5%'}}
                        onClick={() => setDoSignUp(!doSignUp)}>Sign Up</button>
                </div> 
            </center>:
                <div style={{position: 'relative', top: '20px'}}>
                    <center>
                        <h2 style={{marginBottom: '0px'}}>Sign up</h2>
                        <button 
                            className='mobile-button user-login-button'
                            onClick={() => setDoSignUp(!doSignUp)}
                            style={{backgroundColor: 'red', position: 'relative', top: '-45px', 
                            right: '40%'}}>Go Back</button>
                        <p style={{position: 'relative' ,color: 'red', fontSize: 'bolder', margin: '0px', left: '5%'}}>{signUpErrorMessage}</p>
                        {signUpInputs}
                        <button 
                            disabled={loading}
                            className='mobile-button user-login-button'
                            onClick={() => signUp()}
                            style={{backgroundColor: '#0096FF', marginTop: '5px'
                            }}>Sign up</button>
                    </center>
                </div>}
        </div>
    );
}