import Title from "../components/Title.tsx";
import Header from "../components/Header.tsx";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";
import api from "../api.ts";

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [numeNou, setNumeNou] = useState('');

    async function handleLogout() {
        try {
            await api.post('/api/logout');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la logout: ' + error);
        }
        setUser(null);
        navigate('/');
    }

    async function handleDelete() {
        const confirmare = window.confirm('Sigur vrei sa stergi contul? Actiunea este ireversibila!');
        if (!confirmare) return;

        try {
            await api.delete('/api/delete-account');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la stergere: ' + error);
        }

        setUser(null);
        navigate('/');
    }

    async function handleEditUsername() {
        try {
            const raspuns = await api.patch('/api/update-username', { username: numeNou });
            const date = raspuns.data;

            if (date.succes) {
                setUser({...user!, username: date.username});
                setModal(false);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert(error.response?.data?.error || 'Eroare la editare: ' + error);
        }
    }

    return (
        <div>
            <Header />
            <Title text={`Hello, ${user?.username || 'guest'}!`} />
            <p className="tasks-link">
                You can view all of your tasks <Link to="/tasks">here!</Link>
            </p>
            <br/>

            <div className="profile-info">
                <p>
                    <span className="profile-detail">Username</span>
                    <span className="value-with-edit">
                        {user?.username}
                        <button className="edit-btn" onClick={() => {
                            if (user?.admin) {
                                alert('Nu va puteti schimba username-ul ca admin!');
                                return;
                            }
                            setNumeNou(user?.username || '');
                            setModal(true);
                        }}>
                            <i className="fa-solid fa-pen"></i>
                        </button>
                    </span>
                </p>
                <p>
                    <span className="profile-detail">Email</span>
                    <span>{user?.email}</span>
                </p>
            </div>
            <br/>

            <div className="button-container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <button className="delete-btn" onClick={handleDelete}>Delete account</button>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <p>Edit username</p>
                        <input
                            type="text"
                            value={numeNou}
                            onChange={(e) => setNumeNou(e.target.value)}
                            placeholder="New username"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleEditUsername}>Save</button>
                            <button onClick={() => setModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;