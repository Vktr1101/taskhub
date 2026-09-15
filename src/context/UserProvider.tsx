import { useState, type ReactNode } from "react";
import { UserContext } from "./UserContext.tsx";

interface User {
    username: string;
}

interface UserProviderType {
    children: ReactNode;
}

function UserProvider({ children }: UserProviderType) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;