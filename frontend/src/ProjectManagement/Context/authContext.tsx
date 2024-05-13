// AuthContext.js
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
    username: string;
    userId: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    authLoading: boolean;
    setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserData;
    setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    authLoading: true,
    userData: {
        username: '',
        userId: ''
    },
    setIsAuthenticated: () => { },
    setAuthLoading: () => { },
    setUserData: () => { }
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [userData, setUserData] = useState<UserData>({ username: '', userId: '' });

    useEffect(() => {
        // Simulate an asynchronous check for authentication
        const checkAuthStatus = () => {
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');
            if (userId && username) {
                setIsAuthenticated(true);
                setAuthLoading(false);
                setUserData({ username: username, userId: userId });
            }
        };

        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, authLoading, userData, setIsAuthenticated, setAuthLoading, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};
