import Title from "../components/Title.tsx";
import Header from "../components/Header.tsx";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.tsx";

function Profile() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

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

    return (
        <div>
            <Header />
            <Title text={`Hello, ${user?.username || 'guest'}!`} />
            <p className="tasks-link">
                You can view all of your tasks <Link to="/tasks">here!</Link>
            </p>
            <br/>

            <div className="profile-info">
                <p>Username: {user?.username}</p>
                <p>Email: {user?.email}</p>
            </div>


            <div className="button-container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
                <button className="delete-btn" onClick={handleDelete}>Delete account</button>
            </div>
        </div>
    );
}

export default Profile;