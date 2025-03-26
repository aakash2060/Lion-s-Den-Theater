import React, { createContext, useEffect, useState, ReactNode } from "react";
import AuthServices from "@/services/AuthServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authServices = new AuthServices();

interface AuthType {
    isAuthenticated: boolean;
    signin: (username: string, password: string) => Promise<void>;
    signout: () => Promise<void>;
    user: any;
}

export const AuthContext = createContext<AuthType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    // ✅ Fetch user on app start
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await authServices.getCurrentUser();
                if (response) {
                    console.log("Fetched user:", response);
                    setUser(response);
                    setIsAuthenticated(true);
                    await AsyncStorage.setItem("user", JSON.stringify(response));
                } else {
                    console.log("No user found, setting state to null");
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        fetchUser();
    }, []);

    // Sign in function
    const signin = async (username: string, password: string) => {
        try {
            const response = await authServices.login({ username, password });

            if (response.user) {
                console.log("User logged in:", response.user);
                await AsyncStorage.setItem("user", JSON.stringify(response.user));
                setUser(response.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    // signout
    const signout = async () => {
        try {
            await authServices.logout();
            await AsyncStorage.removeItem("user");
            console.log("User logged out, cleared from storage.");
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, signin, signout, user }}>
            {children}
        </AuthContext.Provider>
    );
};
