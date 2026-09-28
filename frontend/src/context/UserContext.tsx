import { createContext } from "react";

interface User {
    username: string;
    email: string;
    admin?: boolean;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    banReason: string | null;
    setBanReason: (r: string | null) => void;
    loading: boolean;
}

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    banReason: null,
    setBanReason: () => {},
    loading: true
});