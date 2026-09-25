import Header from "../components/Header.tsx";
import { useContext, useEffect, useState } from "react";
import Title from "../components/Title.tsx";
import { UserContext } from "../context/UserContext.tsx";
import TaskForm from "../components/TaskForm.tsx";

interface Task {
    id: number;
    titlu: string;
    descriere: string;
    prioritate: string;
    categorie: string;
    deadline: string;
    ora: string;
    status: string;
}

function Tasks() {
    const [taskuri, setTaskuri] = useState<Task[]>([]);
    const { user } = useContext(UserContext);

    const [taskSelectat, setTaskSelectat] = useState<Task | null>(null);

    const [taskuriBifate, setTaskuriBifate] = useState<number[]>([]);

    async function incarcaTaskuri() {
        const raspuns = await fetch('http://localhost:3000/api/tasks', {
            credentials: 'include'
        });
        const date = await raspuns.json();
        if (date.succes) setTaskuri(date.tasks);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        incarcaTaskuri();
    }, []);

    function timeLeft(deadline: string, ora: string): string {
        const deadlineComplet = new Date(`${deadline}T${ora}`);
        const acum = new Date();
        const diff = deadlineComplet.getTime() - acum.getTime();
        const minuteTotale = Math.floor(diff / 1000 / 60);
        const zile = Math.floor(minuteTotale / (60 * 24));
        const ore = Math.floor((minuteTotale % (60 * 24)) / 60);
        const minute = minuteTotale % 60;

        let text: string = '';
        if (zile > 0) {
            text += `${zile} ${zile === 1 ? 'day' : 'days'}`;
            if (ore > 0) {
                text += ` and ${ore} ${ore === 1 ? 'hour' : 'hours'}`;
            }
        } else if (zile <= 0 && ore > 0) {
            text += `${ore} ${ore === 1 ? 'hour' : 'hours'}`;
            if (minute > 0) {
                text += ` and ${minute} ${minute === 1 ? 'minute' : 'minutes'}`;
            }
        } else if (zile <= 0 && ore <= 0) {
            text += `${minute} ${minute === 1 ? 'minute' : 'minutes'}`;
        }

        if (text[0] === '-') return 'NONE';

        return text;
    }

    function timeLeftCategories(deadline: string, ora: string): string {
        const deadlineComplet = new Date(`${deadline}T${ora}`);
        const acum = new Date();
        const diff = deadlineComplet.getTime() - acum.getTime();
        if (diff <= 0) return 'EXPIRED';

        const ore = diff / 1000 / 60 / 60;
        const zile = ore / 24;

        if (ore <= 24) return '24 hours or less';
        if (zile <= 3) return '3 days or less';
        if (zile <= 7) return '1 week or less';
        return 'More than 1 week';
    }

    function getStatus(task: Task): string {
        if (task.status === 'done') return '• Done';
        if (task.status === 'canceled') return '• Canceled';
        return timeLeftCategories(task.deadline, task.ora) === 'EXPIRED' ? '• Inactive' : '• Active';
    }

    function toggleBifat(id: number) {
        if (taskuriBifate.includes(id)) {
            setTaskuriBifate(taskuriBifate.filter(x => x !== id));
        } else {
            setTaskuriBifate([...taskuriBifate, id]);
        }
    }

    function toggleSelectAll() {
        if (taskuriBifate.length === taskuri.length) {
            setTaskuriBifate([]);
        } else {
            setTaskuriBifate(taskuri.map(task => task.id));
        }
    }

    async function aplicaActiune(statusNou: string) {
        for (const id of taskuriBifate) {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: statusNou })
            });
        }
        setTaskuriBifate([]);
        incarcaTaskuri();
    }

    async function handleDeleteTasks() {
        const confirmare = window.confirm('Sigur vrei sa stergi task-urile selectate?');
        if (!confirmare) return;

        for (const id of taskuriBifate) {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
        }
        setTaskuriBifate([]);
        incarcaTaskuri();
    }

    return (
        <div>
            <Header />
            <Title text={`Take a look at your tasks, ${user?.username}!`}/>

            {taskuri.length ? (
                <div className={taskuriBifate.length > 0 ? "task-list cu-bara" : "task-list"}>
                    {taskuri.map((task, i) => (
                        <div key={i} className="task-details">
                            <span className="value-with-edit">
                                <button className="edit-btn" onClick={() => {
                                    if (task.status === 'done' || task.status === 'canceled') {
                                        alert('Nu puteti edita un task terminat sau anulat!');
                                        return;
                                    }
                                    setTaskSelectat(task);
                                }}>
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                {task.titlu}
                            </span>

                            <div className="task-checks">
                                <div className="task-status">
                                    <p className={
                                           getStatus(task) === '• Done' ? "status-done" :
                                           getStatus(task) === '• Canceled' ? "status-canceled" :
                                           getStatus(task) === '• Active' ? "status-active" :
                                           "status-inactive"
                                    }>
                                        {getStatus(task)}
                                    </p>
                                    {task.status !== 'done' && task.status !== 'canceled' && (
                                        <p>Time left: {timeLeftCategories(task.deadline, task.ora)}</p>
                                    )}
                                </div>

                                <input
                                    type="checkbox"
                                    className="task-checkbox"
                                    checked={taskuriBifate.includes(task.id!)}
                                    onChange={() => toggleBifat(task.id!)}
                                />
                            </div>
                        </div>
                    )).reverse()}
                </div>
            ) : (
                <h1>No tasks created!</h1>
            )}

            {taskSelectat && (
                <div className="modal-overlay" onClick={() => setTaskSelectat(null)}>
                    <div className="task-modal" onClick={(e) => e.stopPropagation()}>
                        <TaskForm
                            taskDeEditat={taskSelectat}
                            onClose={() => {
                                setTaskSelectat(null);
                                incarcaTaskuri();
                            }}
                        />
                        <br/>

                        <div className="task-info-readonly">
                            <div>
                                <p>Time left:</p>
                                {timeLeft(taskSelectat.deadline, taskSelectat.ora)}
                            </div>
                            <div>
                                <p>Status:</p>
                                {getStatus(taskSelectat)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {taskuriBifate.length > 0 && (
                <div className="action-bar">
                        <label className="select-all">
                            <input
                                type="checkbox"
                                className="task-checkbox"
                                checked={taskuriBifate.length === taskuri.length}
                                onChange={toggleSelectAll}
                            />
                            Select all
                        </label>

                    <div className="action-buttons">
                        <button onClick={() => aplicaActiune('done')}>Mark as Done</button>
                        <button onClick={() => aplicaActiune('canceled')}>Cancel tasks</button>
                        <button onClick={handleDeleteTasks}>Delete tasks</button>
                    </div>

                    <button className="deselect-btn" onClick={() => setTaskuriBifate([])}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            )}
        </div>
    );
}

export default Tasks;