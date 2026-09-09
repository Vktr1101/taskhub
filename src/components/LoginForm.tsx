import { useState } from "react";
import "./styles/Form.css";

function LoginForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [parola, setParola] = useState('');
    const [confirmare, setConfirmare] = useState('');

    return (
        <div className="form">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="text"
                placeholder="Password"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
            />

            <input
                type="text"
                placeholder="Confirm password"
                value={confirmare}
                onChange={(e) => setConfirmare(e.target.value)}
            />
        </div>
    );
}

export default LoginForm;