import express from "express";
import session from "express-session";
import cors from "cors";
import bcrypt from "bcrypt";
import sequelize from "./database.ts";
import Task from "./models/task.ts";
import User from "./models/user.ts";

const app = express();
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'taskhub-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json({ succes: true, tasks });
    } catch (error) {
        console.error('Eroare la read: ', error);
        res.status(400).json({ succes: false, error: 'Nu s-au putut citi taskurile!' });
    }
});

app.post('/api/tasks', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.json({ succes: true, task });
    } catch (error) {
        console.error('Eroare la create: ', error);
        res.status(400).json({ succes: false, error: 'Nu s-a putut crea taskul!' });
    }
});

app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ succes: false, error: 'Toate campurile sunt obligatorii!' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, parola: hash });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.session as any).user = {
            id: user.get('id'),
            username: user.get('username')
        };

        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare la inregistrare: ', error);
        res.status(400).json({ succes: false, error: 'Username sau email deja folosit!' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ succes: false, error: 'Toate campurile sunt obligatorii!' });
    }

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ succes: false, error: 'Username sau parola gresita!' });
        }

        const potrivire = await bcrypt.compare(password, user.get('parola') as string);
        if (!potrivire) {
            return res.status(400).json({ succes: false, error: 'Username sau parola gresita!' });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.session as any).user = {
            id: user.get('id'),
            username: user.get('username')
        };

        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare la autentificare: ', error);
        res.status(400).json({ succes: false, error: 'Eroare la autentificare!' })
    }
});

app.get('/api/me', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req.session as any).user;
    if (user) {
        res.json({ loggedIn: true, user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ succes: true });
    });
});

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Conectat la MySQL!');
    } catch (error) {
        console.error('Eroare la conectare: ', error)
    }

    app.listen(PORT, () => {
        console.log(`Server pornit pe http://localhost:${PORT}`);
    });
}

start();