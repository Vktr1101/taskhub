import { Router } from "express";
import User from "../models/User.ts";
import Task from "../models/Task.ts";

const router = Router();

router.get('/users', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser || !sessionUser.admin) {
        return res.status(403).json({ succes: false, error: 'Acces interzis!' });
    }

    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'admin']
        });

        const rezultat = [];
        for (const u of users) {
            const userId = u.get('id');
            const undone = await Task.count({ where: { userId, status: 'undone' } });
            const canceled = await Task.count({ where: { userId, status: 'canceled' } });
            const done = await Task.count({ where: { userId, status: 'done' } });

            rezultat.push({
                id: userId,
                username: u.get('username'),
                admin: u.get('admin'),
                undone,
                canceled,
                done
            });
        }

        res.json({ succes: true, users: rezultat });
    } catch (error) {
        console.error('Eroare: ', error);
        res.status(400).json({ succes: false, error: 'Eroare la afisare admin dashboard!' });
    }
});

export default router;