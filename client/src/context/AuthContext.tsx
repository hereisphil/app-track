import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { User } from "../@types/userTypes";
import { getLoggedInUser } from "../services/userRoutes";

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    async function refreshUser() {
        setIsLoading(true);
        try {
            const data = await getLoggedInUser();
            setUser(data);
        } catch {
            // Not logged in (or session expired)
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void refreshUser();
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            setUser,
            isLoading,
            isAuthenticated: !!user,
            refreshUser,
        }),
        [user, isLoading]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
