import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config"
import sequelize from "./database.ts";
import passport from "./passport.ts";
import authRoutes from './routes/auth.ts';
import taskRoutes from './routes/tasks.ts';
import adminRoutes from './routes/admin.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

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