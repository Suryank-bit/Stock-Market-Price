import "./Login.css";
import {useState} from "react"
import { useNavigate } from "react-router-dom";

function Login() {

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate();

    const loginUser = async (e) => {
        let path = '/dashboard';
        navigate(path)
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