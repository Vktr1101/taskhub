import "./styles/Form.css";

interface LoginProps {
    username: string; setUsername: (v: string) => void;
    parola: string; setParola: (v: string) => void;
}

function LoginForm({ username, setUsername, parola, setParola }: LoginProps) {
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

export default LoginForm;