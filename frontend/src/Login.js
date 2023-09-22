import "./Login.css";
import {useState} from "react"


function Login() {

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    const loginUser = async (e) => {
        e.preventDefault()
        fetch("http://127.0.0.1:5000/login", {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: userName,
                password: password
            })
        })
            .then(data => data.json())
            .then((res) => {
                if(res['user']['message'] === "success") {
                    localStorage.setItem('accessToken', res['user']['accessToken'])
                    localStorage.setItem('user', res['user'])
                    window.location.href='/dashboard';
                }
                else {
                    console.log(res)
                    console.log('Failed')
                }
            })
        
    }


    return(
            <div className="login-box">
                <h2>LOGIN</h2>
                <form>
                    <div className='user-box user'>
                        <input
                            type="email"
                            htmlFor="email"
                            value = {userName}
                            onChange={(e) => setUserName(e.target.value)}
                            />
                        <label>Username</label>
                    </div>

                    <div className="user-box pass">
                        <input 
                            type="password"
                            htmlFor="password"
                            value = {password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        <label>Password</label>
                    </div>
                    <button type="submit" onClick={loginUser}>Login</button>
                </form>
            </div>
    )
}

export default Login;