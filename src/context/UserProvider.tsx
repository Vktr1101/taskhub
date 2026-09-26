import { useState, useEffect, type ReactNode } from "react";
import { UserContext } from "./UserContext.tsx";
import api from "../api.ts";

interface User {
    username: string;
    email: string;
    admin?: boolean;
}

interface UserProviderType {
    children: ReactNode;
}

function UserProvider({ children }: UserProviderType) {
    const [user, setUser] = useState<User | null>(null);
    const [banReason, setBanReason] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function verificaLogin() {
            const raspuns = await api.get('/api/me');
            const date = raspuns.data;
            if (date.loggedIn && date.banned) {
                setBanReason(date.banReason);
            } else if (date.loggedIn) {
                setUser(date.user);
            }
            setLoading(false);
        }
        verificaLogin();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, banReason, setBanReason, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;