import { useState } from "react";
import "./styles/TaskForm.css";

function TaskForm() {
    const [titlu, setTitlu] = useState('');
    const [deadline, setDeadline] = useState('');
    const [descriere, setDescriere] = useState('');
    const [prioritate, setPrioritate] = useState<'' | 'none' | 'low' | 'medium' | 'high' | 'urgent'>('');
    const [categorie, setCategorie] = useState <'' | 'work' | 'personal' | 'study'>('');
    const [ora, setOra] = useState('');

    const [erori, setErori] = useState<string[]>([]);
    const [mesaj, setMesaj] = useState('');

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

    function salveazaTask() {
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

        // if (deadlineComplet.getTime() <= acum.getTime()) {
        //     setErori(['deadline', 'ora']);
        //     setMesaj('The deadline must be in the future!');
        //     return;
        // }

        const diff = deadlineComplet.getTime() - acum.getTime();
        const minuteTotale = Math.floor(diff / 1000 / 60);
        const zile = Math.floor(minuteTotale / (60 * 24));
        const ore = Math.floor((minuteTotale % (60 * 24)) / 60);
        const minute = minuteTotale % 60;

        let text: string = 'Task created! You have ';

        if (zile > 0) {
            text += `${zile} ${zile === 1 ? 'day' : 'days'}`;
            if (ore > 0) {
                text += ` and ${ore} ${ore === 1 ? 'hour' : 'hours'}`;
            }
        } else {
            text += `${ore} ${ore === 1 ? 'hour' : 'hours'} and ${minute} ${minute === 1 ? 'minutes' : 'minute'}`;
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
        setMesaj('');
        setTitlu('');
        setDescriere('');
        setPrioritate('');
        setCategorie('');
        setDeadline('');
        setOra('');
        setErori([]);
    }

    return (
        <div>
            <h1 className="title">{mesaj ? mesaj : "Create a task for later!"}</h1>

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
                            setCategorie(e.target.value as 'work' | 'personal' | 'study')}>
                        <option value="" disabled>Category</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="study">Study</option>
                    </select>
                </div>
                <br/>

                <div>
                    <p>Deadline:</p>
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

            <div className="button-container">
                <button className="task-save" onClick={salveazaTask}>Save</button>
                <button className="task-cancel" onClick={cancelTask}>Cancel</button>
            </div>
        </div>
    );
}

export default TaskForm;