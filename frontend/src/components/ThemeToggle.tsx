import { useState, useEffect } from "react";

function ThemeToggle() {
    const [tema, setTema] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('tema') as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        localStorage.setItem('tema', tema);
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