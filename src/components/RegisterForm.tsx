import { useState } from "react";
import "./styles/Form.css";

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [parola, setParola] = useState('');

    return (
        <div className="form">
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="text"
                placeholder="Password"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
            />
        </div>
    );
}

export default RegisterForm;