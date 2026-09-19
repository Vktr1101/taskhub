import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import RegisterForm from "../components/RegisterForm.tsx";
import Button from "../components/Button.tsx";

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [confirmare, setConfirmare] = useState('');

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleRegister() {
        if (parola !== confirmare) {
            alert('The passwords do not match!');
            return;
        }

        const raspuns = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, email, password: parola })
        });
        const date = await raspuns.json();

        if (date.succes) {
            setUser(date.user);
            navigate('/profile');
        } else {
            alert(date.error);
        }
    }

    return (
        <div>
            <Header />
            <Title text="Register"/>
            <RegisterForm
                username={username} setUsername={setUsername}
                email={email} setEmail={setEmail}
                parola={parola} setParola={setParola}
                confirmare={confirmare} setConfirmare={setConfirmare}
            />
            <Button text="Create account" onClick={handleRegister} />
        </div>
    );
}

export default Register;