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

    return (
        <div>
            <Header />
            <Title text={`Take a look at your tasks, ${user?.username}!`}/>

            {taskuri.length ? (
                <div className="task-list">
                    {taskuri.map((task, i) => (
                        <div key={i} className="task-card">
                            <h1 className="task-title">{task.titlu}</h1>
                            <br/>

                            <div className="task-description">
                                <p>Description:</p>
                                <p>{task.descriere}</p>
                            </div>
                            <br/>

                            <div className="task-container">
                                <span>Priority: {task.prioritate.toLocaleUpperCase()}</span>
                                <span>Category: {task.categorie.toLocaleUpperCase()}</span>
                                <span>Deadline: {task.deadline} {task.ora}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h1>No tasks created!</h1>
            )}
        </div>
    );
}

export default Tasks;