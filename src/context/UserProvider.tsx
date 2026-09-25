import { useState, useEffect, type ReactNode } from "react";
import { UserContext } from "./UserContext.tsx";

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

    useEffect(() => {
        async function verificaLogin() {
            const raspuns = await fetch('http://localhost:3000/api/me', {
                credentials: 'include'
            });
            const date = await raspuns.json();
            if (date.loggedIn) {
                setUser(date.user);
            }
        }
        verificaLogin();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;