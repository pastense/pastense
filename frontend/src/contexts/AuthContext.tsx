import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';

interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
            try {
                const decoded: any = jwtDecode(storedToken);

                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setToken(storedToken);
                    setUser({
                        id: decoded.sub,
                        email: decoded.email,
                        name: decoded.name,
                        picture: decoded.picture
                    });
                } else {
                    // Token expired, remove it
                    localStorage.removeItem('auth_token');
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('auth_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string) => {
        try {
            const decoded: any = jwtDecode(newToken);
            localStorage.setItem('auth_token', newToken);
            setToken(newToken);
            setUser({
                id: decoded.sub,
                email: decoded.email,
                name: decoded.name,
                picture: decoded.picture
            });
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        login,
        logout,
        isLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 