import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import { UserContext } from "../context/UserContext.tsx";
import { useState, useEffect, useContext } from "react";
import api from "../api.ts";

interface UserData {
    id: number;
    username: string;
    admin: boolean;
    banned: boolean;
    banReason: string;
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
    const [eroareBan, setEroareBan] = useState(false);

    async function incarcaUseri() {
        try {
            const raspuns = await api.get('/api/admin/users');
            const date = raspuns.data;
            if (date.succes) {
                setUseri(date.users);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la afisare: ' + error);
        }
    }

    useEffect(() => {
        async function verifica() {
            const raspuns = await api.get('/api/me');
            const date = raspuns.data;
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
        try {
            const raspuns = await api.post('/api/admin-password', {password: parola});
            const date = raspuns.data;
            if (date.succes) {
                setDeblocat(true);
            } else {
                setEroare('Wrong password!');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la verificare parola: ' + error);
        }
    }

    async function handleDeleteUser(id: number) {
        const confirmare = window.confirm('Sigur vreti sa stergeti acest user?');
        if (!confirmare) return;

        try {
            await api.delete(`/api/admin/delete-user/${id}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la stergere user: ' + error);
        }
        incarcaUseri();
    }

    async function handleBanUser() {
        if (motivBan.trim() === '') {
            setEroareBan(true);
            return;
        }

        try {
            await api.patch(`/api/admin/ban/${userDeBanat}`, {reason: motivBan});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la ban: ' + error);
        }
        setBanModal(false);
        setMotivBan('');
        setEroareBan(false);
        incarcaUseri();
    }

    async function handleUnbanUser(id: number) {
        try {
            await api.patch(`/api/admin/unban/${id}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la unban: ' + error);
        }
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
                                <p className="user-detail">Username</p>
                                <p>{u.username} {u.admin && '(admin)'}</p>

                                <p>===========================</p>
                                <p className="user-detail">Tasks</p>
                                <div className="user-stats">
                                    <span>Undone: {u.undone}</span>
                                    <span>Done: {u.done}</span>
                                    <span>Canceled: {u.canceled}</span>
                                </div>

                                {u.banned && (
                                    <div>
                                        <p>===========================</p>
                                        <p className="user-detail">Ban reason</p>
                                        <p className="ban-reason">{u.banReason}</p>
                                    </div>
                                )}

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
                            className={eroareBan ? "eroare" : ''}
                            value={motivBan}
                            onChange={(e) => {
                                setMotivBan(e.target.value);
                                setEroareBan(false);
                            }}
                            placeholder="Reason for ban"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleBanUser}>Ban</button>
                            <button onClick={() => {
                                setBanModal(false);
                                setEroareBan(false);
                                setMotivBan('');
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;