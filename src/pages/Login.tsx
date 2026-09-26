import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import LoginForm from "../components/LoginForm.tsx";
import Button from "../components/Button.tsx";

function Login() {
    const [username, setUsername] = useState('');
    const [parola, setParola] = useState('');

    const { setUser, setBanReason } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogin() {
        const raspuns = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password: parola })
        });
        const date = await raspuns.json();

        if (date.succes) {
            setUser(date.user);
            navigate('/profile');
        } else if (date.banned) {
            setBanReason(date.banReason);
            navigate('/');
        } else {
            alert(date.error);
        }
    }

    return (
        <div>
            <Header />
            <Title text="Login"/>
            <LoginForm
                username={username} setUsername={setUsername}
                parola={parola} setParola={setParola}
            />
            <br/>
            <Button text="Login account" onClick={handleLogin} />
        </div>
    );
}

export default Login;