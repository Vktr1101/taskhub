import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import { UserContext } from "../context/UserContext.tsx";
import { useState, useEffect, useContext } from "react";

interface UserData {
    id: number;
    username: string;
    admin: boolean;
    banned: boolean;
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

    const [banModal, setBanModal] = useState(false);
    const [userDeBanat, setUserDeBanat] = useState<number | null>(null);
    const [motivBan, setMotivBan] = useState('');

    async function incarcaUseri() {
        const raspuns = await fetch('http://localhost:3000/api/admin/users', {
            credentials: 'include'
        });
        const date = await raspuns.json();
        if (date.succes) {
            setUseri(date.users);
        }
    }

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
        if (user?.admin) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

    async function handleDeleteUser(id: number) {
        const confirmare = window.confirm('Sigur vreti sa stergeti acest user?');
        if (!confirmare) return;

        await fetch(`http://localhost:3000/api/admin/delete-user/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        incarcaUseri();
    }

    async function handleBanUser() {
        await fetch(`http://localhost:3000/api/admin/ban/${userDeBanat}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ reason: motivBan })
        });
        setBanModal(false);
        setMotivBan('');
        incarcaUseri();
    }

    async function handleUnbanUser(id: number) {
        await fetch(`http://localhost:3000/api/admin/unban/${id}`, {
            method: 'PATCH',
            credentials: 'include'
        });
        incarcaUseri();
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
                                <p>Tasks</p>
                                <div className="user-stats">
                                    <span>Undone: {u.undone}</span>
                                    <span>Done: {u.done}</span>
                                    <span>Canceled: {u.canceled}</span>
                                </div>
                                <div className="user-buttons">
                                    <button onClick={() => {
                                        if (u.banned) {
                                            handleUnbanUser(u.id);
                                        } else {
                                            setUserDeBanat(u.id);
                                            setBanModal(true);
                                        }
                                    }}>
                                        {u.banned ? 'Unban user' : 'Ban user'}
                                    </button>
                                    <button onClick={() => handleDeleteUser(u.id)}>Delete user</button>
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
                        <img src="/google.png" alt=""/>
                        &nbsp;Login with Google
                    </button>
                </div>
            )}

            {banModal && (
                <div className="modal-overlay" onClick={() => setBanModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <p>Ban reason</p>
                        <input
                            type="text"
                            value={motivBan}
                            onChange={(e) => setMotivBan(e.target.value)}
                            placeholder="Reason for ban"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleBanUser}>Ban</button>
                            <button onClick={() => setBanModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;