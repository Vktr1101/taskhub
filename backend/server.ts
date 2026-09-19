import express from "express";
import session from "express-session";
import cors from "cors";
import sequelize from "./database.ts";
import authRoutes from './routes/auth.ts';
import taskRoutes from './routes/tasks.ts';

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

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);

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