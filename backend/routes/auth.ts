import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.ts';
import Task from "../models/task.ts";

const router = Router();

router.post('/register', async (req, res) => {
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
            username: user.get('username'),
            email: user.get('email')
        };

        res.json({ succes: true, user: { username: user.get('username'), email: user.get('email') } });
    } catch (error) {
        console.error('Eroare la inregistrare: ', error);
        res.status(400).json({ succes: false, error: 'Username sau email deja folosit!' });
    }
});

router.post('/login', async (req, res) => {
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
            username: user.get('username'),
            email: user.get('email')
        };

        res.json({ succes: true, user: { username: user.get('username'), email: user.get('email') } });
    } catch (error) {
        console.error('Eroare la autentificare: ', error);
        res.status(400).json({ succes: false, error: 'Eroare la autentificare!' })
    }
});

router.get('/me', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req.session as any).user;
    if (user) {
        res.json({ loggedIn: true, user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ succes: true });
    });
});

router.delete('/delete-account', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = (req.session as any).user;

    if (!sessionUser) {
        return res.status(400).json({ succes: false, error: 'Nu sunteti logat!' });
    }

    try {
        await Task.destroy({ where: { userId: sessionUser.id } });
        await User.destroy({ where: { id: sessionUser.id } });

        req.session.destroy(() => {
            res.json({ succes: true });
        });
    } catch (error) {
        console.error('Eroare la stergere:', error);
        res.status(400).json({ succes: false, error: 'Nu s-a putut sterge contul' });
    }
});

export default router;