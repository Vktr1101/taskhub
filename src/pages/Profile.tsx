import Title from "../components/Title.tsx";
import Header from "../components/Header.tsx";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [numeNou, setNumeNou] = useState('');

    async function handleLogout() {
        await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
        navigate('/');
    }

    async function handleDelete() {
        const confirmare = window.confirm('Sigur vrei sa stergi contul? Actiunea este ireversibila!');
        if (!confirmare) return;

        await fetch('http://localhost:3000/api/delete-account', {
            method: 'DELETE',
            credentials: 'include'
        });
        setUser(null);
        navigate('/');
    }

    async function handleEditUsername() {
        const raspuns = await fetch('http://localhost:3000/api/update-username', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username: numeNou })
        });
        const date = await raspuns.json();

        if (date.succes) {
            setUser({ ...user!, username: date.username });
            setModal(false);
        } else {
            alert(date.error);
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