interface RegisterProps {
    username: string; setUsername: (v: string) => void;
    email: string; setEmail: (v: string) => void;
    parola: string; setParola: (v: string) => void;
    confirmare: string; setConfirmare: (v: string) => void;
}

function RegisterForm({ username, setUsername, email, setEmail, parola, setParola, confirmare, setConfirmare }: RegisterProps) {
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
                type="password"
                placeholder="Password"
                value={parola}
                onChange={(e) => setParola(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirm password"
                value={confirmare}
                onChange={(e) => setConfirmare(e.target.value)}
            />
        </div>
    );
}

export default RegisterForm;