import { useState, useEffect } from "react";
import "./styles/ThemeToggle.css";

function ThemeToggle() {
    const [tema, setTema] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        if (tema === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [tema]);

    return (
        <button className="theme-toggle" onClick={() => setTema(tema === 'light' ? 'dark' : 'light')}>
            {tema === 'light' ? '🌙' : '☀️'}
        </button>
    );
}

export default ThemeToggle;