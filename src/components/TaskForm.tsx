import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext.tsx";
import api from "../api.ts";

interface Task {
    id?: number;
    titlu: string;
    descriere: string;
    prioritate: string;
    categorie: string;
    deadline: string;
    ora: string;
    status?: string;
}

interface TaskFormProps {
    taskDeEditat?: Task | null;
    onClose?: () => void;
}

function TaskForm({ taskDeEditat, onClose }: TaskFormProps) {
    const [titlu, setTitlu] = useState('');
    const [deadline, setDeadline] = useState('');
    const [prioritate, setPrioritate] = useState<'' | 'none' | 'low' | 'medium' | 'high' | 'urgent'>('');
    const [categorie, setCategorie] = useState <'' | 'work' | 'personal' | 'study' | 'other'>('');
    const [descriere, setDescriere] = useState('');
    const [ora, setOra] = useState('');

    const [erori, setErori] = useState<string[]>([]);
    const [mesaj, setMesaj] = useState('');

    const [taskuri, setTaskuri] = useState<Task[]>([]);
    const { user } = useContext(UserContext);

    const acum = new Date();
    const aziLocal = `${acum.getFullYear()}-${String(acum.getMonth() + 1).padStart(2, '0')}-${String(acum.getDate()).padStart(2, '0')}`;
    function genereazaOre(ziuaAleasa: string): string[] {
        const ore: string[] = [];
        const acum = new Date();

        const aziLocal = `${acum.getFullYear()}-${String(acum.getMonth() + 1).padStart(2, '0')}-${String(acum.getDate()).padStart(2, '0')}`;
        const eAzi = ziuaAleasa === aziLocal;

        for (let h = 0; h < 24; h++) {
            for (const m of [0, 30]) {
                if (eAzi && (h < acum.getHours() || (h === acum.getHours() && m <= acum.getMinutes()))) {
                    continue;
                }
                const oraFormatata = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                ore.push(oraFormatata);
            }
        }
        return ore;
    }

    useEffect(() => {
        if (taskDeEditat) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitlu(taskDeEditat.titlu);
            setDescriere(taskDeEditat.descriere);
            setPrioritate(taskDeEditat.prioritate as typeof prioritate);
            setCategorie(taskDeEditat.categorie as typeof categorie);
            setDeadline(taskDeEditat.deadline);
            setOra(taskDeEditat.ora);
        }
    }, [taskDeEditat]);

    async function salveazaTask() {
        const campuriGoale: string[] = [];
        if (titlu.trim() === '') campuriGoale.push('titlu');
        if (descriere.trim() === '') campuriGoale.push('descriere');
        if (prioritate === '') campuriGoale.push('prioritate');
        if (categorie === '') campuriGoale.push('categorie');
        if (deadline === '') campuriGoale.push('deadline');
        if (ora === '') campuriGoale.push('ora');

        setErori(campuriGoale);
        if (campuriGoale.length > 0) {
            setMesaj('All fields are mandatory!');
            return;
        }

        const deadlineComplet = new Date(`${deadline}T${ora}`);
        const acum = new Date();
        if (deadlineComplet.getTime() <= acum.getTime()) {
            setErori(['deadline', 'ora']);
            setMesaj('The deadline must be in the future!');
            return;
        }

        const nouTask = {
            titlu, descriere, prioritate, categorie, deadline, ora
        };

        if (taskDeEditat) {
            try {
                const raspuns = await api.patch(`/api/tasks/${taskDeEditat.id}`, nouTask);
                const date = raspuns.data;
                if (!date.succes) {
                    setMesaj('Task wasn\'t modified!');
                    return;
                }
                if (onClose) onClose();
                return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setMesaj('Error: ' + error);
                return;
            }
        } else if (user) {
            try {
                const raspuns = await api.post('/api/tasks', nouTask);
                const date = raspuns.data;

                if (!date.succes) {
                    setMesaj('Error: Could not save task!');
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                setMesaj('Error: ' + error);
                return;
            }
        } else {
            setTaskuri([...taskuri, nouTask]);
        }

        const diff = deadlineComplet.getTime() - acum.getTime();
        const minuteTotale = Math.floor(diff / 1000 / 60);
        const zile = Math.floor(minuteTotale / (60 * 24));
        const ore = Math.floor((minuteTotale % (60 * 24)) / 60);
        const minute = minuteTotale % 60;

        let text = 'Task created! You have ';
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
        text += ` to complete it!\nCreate another task!`;

        setMesaj(text);
        setTitlu('');
        setDescriere('');
        setPrioritate('');
        setCategorie('');
        setDeadline('');
        setOra('');
        setErori([]);
    }

    function cancelTask() {
        if (taskDeEditat) {
            onClose?.();
            return;
        }

        setMesaj('');
        setTitlu('');
        setDescriere('');
        setPrioritate('');
        setCategorie('');
        setDeadline('');
        setOra('');
        setErori([]);
    }

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

    return (
        <div>
            <h1 className="title">
                {mesaj ? mesaj : (taskDeEditat ? "Edit task" : "Create a task for later!")}
            </h1>

            <div className="task-form">
                <input
                    className={erori.includes('titlu') ? 'input-bold eroare' : 'input-bold'}
                    type="text"
                    placeholder="Task Title"
                    value={titlu}
                    onChange={(e) => setTitlu(e.target.value)}
                />
                <br/>

                <textarea
                    className={erori.includes('descriere') ? 'eroare' : ''}
                    placeholder="Description"
                    value={descriere}
                    onChange={(e) => setDescriere(e.target.value)}
                />

                <div className="task-selects">
                    <select className={erori.includes('prioritate') ? 'eroare' : ''}
                            value={prioritate}
                            onChange={(e) =>
                                setPrioritate(e.target.value as 'none' | 'low' | 'medium' | 'high' | 'urgent')}>
                        <option value="" disabled>Priority</option>
                        <option value="none">None</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>

                    <select
                        className={erori.includes('categorie') ? 'eroare' : ''}
                        value={categorie}
                        onChange={(e) =>
                            setCategorie(e.target.value as 'work' | 'personal' | 'study' | 'other')}>
                        <option value="" disabled>Category</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="study">Study</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <br/>

                <div>
                    <p className="ddl">Deadline:</p>
                    <div className="task-deadline">
                        <input
                            className={erori.includes('deadline') ? 'input-date eroare' : 'input-date'}
                            type="date"
                            min={aziLocal}
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />

                        <select
                            className={erori.includes('ora') ? 'eroare' : ''}
                            value={ora}
                            onChange={(e) => setOra(e.target.value)}>
                            <option value="" disabled>Hour</option>
                            {genereazaOre(deadline).map((o) => (
                                <option key={o} value={o}>{o}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <br/>

            <div className="button-container">
                <button className="task-save" onClick={salveazaTask}>Save</button>
                <button className="task-cancel" onClick={cancelTask}>Cancel</button>
            </div>

            <div className="task-list">
                {taskuri.map((task, i) => (
                    <div key={i} className="task-card">
                        <h1 className="task-title">{task.titlu}</h1>
                        <br/>

                        <div className="task-description">
                            <p>Description: </p>
                            <p>{task.descriere}</p>
                        </div>
                        <br/>

                        <div className="task-container">
                            <span>Priority: {task.prioritate.toLocaleUpperCase()}</span>
                            <span>Category: {task.categorie.toLocaleUpperCase()}</span>
                            <span>Deadline: {task.deadline} {task.ora}</span>
                            <span>Time left: {timeLeft(task.deadline, task.ora)}</span>
                        </div>
                    </div>
                )).reverse()}
            </div>

            {user ? (
                <h1 className="title">You can view all of your tasks on your personal profile page!</h1>
            ) : (
                <h1 className="title">To save all your tasks login or register!</h1>
            )}
        </div>
    );
}

export default TaskForm;