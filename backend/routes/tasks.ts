import { Router } from 'express';
import Task from '../models/Task.ts';

const router = Router();

router.get('/', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser) {
        return res.status(401).json({ succes: false, error: 'Nu sunteti logat!' });
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

router.patch('/:id', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser) {
        return res.status(401).json({ succes: false, error: 'Nu sunteti logat!' });
    }

    try {
        const [modificate] = await Task.update(req.body, {
            where: { id: req.params.id, userId: sessionUser.id }
        });

        if (modificate === 0) {
            return res.status(404).json({ succes: false, error: 'Task negasit!' });
        }

        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare la update task: ', error);
        res.status(400).json({ succes: false, error: 'Nu s-a putut edita!' });
    }
});

router.delete('/:id', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;
    if (!sessionUser) return res.status(401).json({ succes: false, error: 'Nu sunteti logat!' });

    try {
        await Task.destroy({ where: { id: req.params.id, userId: sessionUser.id } });
        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare la delete task: ', error);
        res.status(400).json({ succes: false, error: 'Nu s-a putut sterge!' });
    }
});

export default router;