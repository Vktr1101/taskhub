import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import RegisterForm from "../components/RegisterForm.tsx";
import Button from "../components/Button.tsx";
import api from "../api.ts";

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

        try {
            const raspuns = await api.post('/api/register', { username, email, password: parola });
            const date = raspuns.data;

            if (date.succes) {
                setUser(date.user);
                navigate('/profile');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(error.response?.data?.error || 'Eroare la inregistrare!');
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
            <br/>
            <Button text="Create account" onClick={handleRegister} />
        </div>
    );
}

export default Register;