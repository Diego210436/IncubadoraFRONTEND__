import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as loginService } from "../services/authService";
import { ReactNode } from "react";

interface AuthContextType {
    userToken: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; token: any; error?: string }>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem("userToken");
            const storedToken = await AsyncStorage.getItem("userToken");
            console.log("🔍 Token guardado en AsyncStorage:", storedToken);
            console.log("Token cargado desde AsyncStorage:", token); // 🔥 Debug
            setUserToken(token);
            setIsLoading(true);
        };

        loadToken();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await loginService(email, password);
        if (response.success) {
            setUserToken(response.token);
            return { success: true, token: response.token, error: undefined };
        }
        return { success: false, token: null, error: response.error };
    };

    const logout = async () => {
        
        setUserToken(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
