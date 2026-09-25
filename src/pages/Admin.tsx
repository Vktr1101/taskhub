import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import { UserContext } from "../context/UserContext.tsx";
import { useState, useEffect, useContext } from "react";

interface UserData {
    id: number;
    username: string;
    admin: boolean;
    undone: number;
    canceled: number;
    done: number;
}

function Admin() {
    const [parola, setParola] = useState('');
    const [deblocat, setDeblocat] = useState(false);
    const [eroare, setEroare] = useState('');

    const { user, setUser } = useContext(UserContext);

    const [useri, setUseri] = useState<UserData[]>([]);
    const [arataAdmini, setArataAdmini] = useState(false);

    useEffect(() => {
        async function verifica() {
            const raspuns = await fetch('http://localhost:3000/api/me', {
                credentials: 'include'
            });
            const date = await raspuns.json();
            if (date.loggedIn && date.user.admin) {
                setUser(date.user);
            }
        }
        verifica();
    }, []);

    useEffect(() => {
        async function incarcaUseri() {
            const raspuns = await fetch('http://localhost:3000/api/admin/users', {
                credentials: 'include'
            });
            const date = await raspuns.json();
            if (date.succes) {
                setUseri(date.users);
            }
        }
        if (user?.admin) {
            incarcaUseri();
        }
    }, [user]);

    async function verificaParola() {
        const raspuns = await fetch('http://localhost:3000/api/admin-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: parola })
        });
        const date = await raspuns.json();
        if (date.succes) {
            setDeblocat(true);
        } else {
            setEroare('Wrong password!');
        }
    }

    return (
        <div>
            <Header />

            {user?.admin ? (
                <div>
                    <Title text="Admin dashboard"/>
                    <button className="button" onClick={() => {setArataAdmini(!arataAdmini)}}>
                        {arataAdmini ? 'Hide admins' : 'Show admins'}
                    </button>

                    <div className="user-list">
                        {useri
                            .filter(u => arataAdmini || !u.admin)
                            .map((u, i) => (
                            <div key={i} className="user-card">
                                <p>{u.username} {u.admin && '(admin)'}</p>
                                <p>===========================</p>
                                <p>Tasks:</p>
                                <div className="user-stats">
                                    <span>Undone: {u.undone}</span>
                                    <span>Done: {u.done}</span>
                                    <span>Canceled: {u.canceled}</span>
                                </div>
                                <div className="user-buttons">
                                    <button>Ban user</button>
                                    <button>Delete user</button>
                                </div>
                            </div>
                        )).reverse()}
                    </div>
                </div>
            ) : !deblocat ? (
                <div className="password-container">
                    <input
                        type="password"
                        value={parola}
                        onChange={(e) => setParola(e.target.value)}
                        placeholder="Admin password"
                    />
                    <button className="button" onClick={verificaParola}>Enter</button>
                    <p>{eroare}</p>
                </div>
            ) : (
                <div className="password-container">
                    <button className="button" onClick={() => {
                        window.location.href = 'http://localhost:3000/api/auth/google';
                    }}>
                        <img src="../../public/google.png" alt=""/>
                        &nbsp;Login with Google
                    </button>
                </div>
            )}
        </div>
    );
}

export default Admin;