import { Router } from 'express';
import Task from '../models/task.ts';

const router = Router();

router.get('/', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser) {
        return res.status(401).json({ succes: false, error: 'Nu esti logat' });
    }

    try {
        const tasks = await Task.findAll({ where: { userId: sessionUser.id } });
        res.json({ succes: true, tasks });
    } catch (error) {
        console.error('Eroare la read: ', error);
        res.status(400).json({ succes: false, error: 'Nu s-au putut citi taskurile!' });
    }
});

router.post('/', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;
    if (!sessionUser) {
        return res.status(401).json({ succes: false, error: 'Nu sunteti logat!' });
    }

    try {
        const task = await Task.create({...req.body, userId: sessionUser.id});
        res.json({ succes: true, task });
    } catch (error) {
        console.error('Eroare la create: ', error);
        res.status(400).json({ succes: false, error: 'Nu s-a putut crea taskul!' });
    }
});

export default router;