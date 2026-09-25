import { createContext } from "react";

interface User {
    username: string;
    email: string;
    admin?: boolean;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {}
});