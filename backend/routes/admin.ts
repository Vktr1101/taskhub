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
            attributes: ['id', 'username', 'admin', 'banned']
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
                banned: u.get('banned'),
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

router.patch('/ban/:id', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser || !sessionUser.admin) {
        return res.status(403).json({ succes: false, error: 'Acces interzis!' });
    }

    const { reason } = req.body;

    try {
        await User.update(
            { banned: true, banReason: reason },
            { where: { id: req.params.id } }
        );
        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare: ', error);
        res.status(400).json({ succes: false, error: 'Eroare la ban user!' });
    }
});

router.patch('/unban/:id', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser || !sessionUser.admin) {
        return res.status(403).json({ succes: false, error: 'Acces interzis!' });
    }

    try {
        await User.update(
            { banned: false, banReason: null },
            { where: { id: req.params.id } }
        );
        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare: ', error);
        res.status(400).json({ succes: false, error: 'Eroare la unban user!' });
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser || !sessionUser.admin) {
        return res.status(403).json({ succes: false, error: 'Acces interzis' });
    }

    try {
        await Task.destroy({ where: { userId: req.params.id } });
        await User.destroy({ where: { id: req.params.id } });
        res.json({ succes: true });
    } catch (error) {
        console.error('Eroare: ', error);
        res.status(400).json({ succes: false, error: 'Eroare la stergere user!' });
    }
});

export default router;