import Header from "../components/Header.tsx";
import { useContext, useEffect, useState } from "react";
import Title from "../components/Title.tsx";
import { UserContext } from "../context/UserContext.tsx";

interface Task {
    titlu: string;
    descriere: string;
    prioritate: string;
    categorie: string;
    deadline: string;
    ora: string;
}

function Tasks() {
    const [taskuri, setTaskuri] = useState<Task[]>([]);
    const { user } = useContext(UserContext);

    const [taskSelectat, setTaskSelectat] = useState<Task | null>(null);

    useEffect(() => {
        async function incarcaTaskuri() {
            const raspuns = await fetch('http://localhost:3000/api/tasks', {
                credentials: 'include'
            });
            const date = await raspuns.json();
            if (date.succes) {
                setTaskuri(date.tasks);
            }
        }
        incarcaTaskuri();
    }, []);

    function timeLeft(deadline: string, ora: string): string {
        const deadlineComplet = new Date(`${deadline}T${ora}`);
        const acum = new Date();
        const diff = deadlineComplet.getTime() - acum.getTime();
        if (diff <= 0) return 'Expired';

        const ore = diff / 1000 / 60 / 60;
        const zile = ore / 24;

        if (ore <= 24) return '24 hours or less';
        if (zile <= 3) return '3 days or less';
        if (zile <= 7) return '1 week or less';
        return 'More than 1 week';
    }

    function getStatus(deadline: string, ora: string): string {
        return timeLeft(deadline, ora) === 'Expired' ? '• Inactive' : '• Active';
    }

    return (
        <div>
            <Header />
            <Title text={`Take a look at your tasks, ${user?.username}!`}/>

            {taskuri.length ? (
                <div className="task-list">
                    {taskuri.map((task, i) => (
                        <button key={i} className="task-details" onClick={() => {
                            setTaskSelectat(task);
                        }}>
                            <span>{task.titlu}</span>
                            <div className="task-status">
                                <p className={getStatus(task.deadline, task.ora) === '• Active' ? "status-active" : "status-inactive"}>
                                    {getStatus(task.deadline, task.ora)}
                                </p>
                                <p>Time left: {timeLeft(task.deadline, task.ora)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <h1>No tasks created!</h1>
            )}

            {taskSelectat && (
                <div className="modal-overlay" onClick={() => setTaskSelectat(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h1 className="task-title">{taskSelectat.titlu}</h1>
                        <div className="task-description">
                            <p>Description:</p>
                            <p>{taskSelectat.descriere}</p>
                        </div>
                        <div className="task-container">
                            <span>Priority: {taskSelectat.prioritate.toUpperCase()}</span>
                            <span>Category: {taskSelectat.categorie.toUpperCase()}</span>
                            <span>Deadline: {taskSelectat.deadline} {taskSelectat.ora}</span>
                            <span>Time left: {timeLeft(taskSelectat.deadline, taskSelectat.ora)}</span>
                            <span>Status: {getStatus(taskSelectat.deadline, taskSelectat.ora)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;