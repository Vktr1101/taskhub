import Header from "../components/Header.tsx";
import TaskForm from "../components/TaskForm.tsx";
import { UserContext } from "../context/UserContext.tsx";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.ts";

function TaskHub() {
    const { setUser, banReason, setBanReason } = useContext(UserContext);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await api.post('/api/logout');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Eroare la logout: ' + error);
        }
        setUser(null);
        setBanReason(null);
        navigate('/');
    }

    if (banReason) {
        return (
            <div className="banned-user">
                <img src="/block.png" alt="Access denied!"/>
                <h1>You have been banned!</h1>
                <h2>Reason:</h2>
                <p className="ban-reason">{banReason}</p>
                <button className="button" onClick={handleLogout}>Logout</button>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <br/>
            <TaskForm />
        </div>
    );
}

export default TaskHub;