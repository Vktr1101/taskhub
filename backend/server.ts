import express from "express";
import cors from "cors";
import sequelize from "./database.ts";
import Task from "./models/task.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    res.json({ merge: true });
});

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