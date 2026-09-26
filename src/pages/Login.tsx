import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import LoginForm from "../components/LoginForm.tsx";
import Button from "../components/Button.tsx";
import api from "../api.ts";

function Login() {
    const [username, setUsername] = useState('');
    const [parola, setParola] = useState('');

    const { setUser, setBanReason } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogin() {
        try {
            const raspuns = await api.post('/api/login', { username, password: parola });
            const date = raspuns.data;

            if (date.succes) {
                setUser(date.user);
                navigate('/profile');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const date = error.response?.data;
            if (date?.banned) {
                setBanReason(date.banReason);
                navigate('/');
            } else {
                alert(date?.error || 'Eroare la login!');
            }
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