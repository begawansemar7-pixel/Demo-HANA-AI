import React, { createContext, useState } from 'react';
import type { PersonaId } from '../types';

interface User {
    name: string;
    email: string;
    [key: string]: any; // For additional persona-specific fields
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  persona: PersonaId | null;
  selectPersona: (persona: PersonaId) => void;
  login: (userData: any) => void;
  register: (userData: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [persona, setPersona] = useState<PersonaId | null>(null);

    const selectPersona = (selectedPersona: PersonaId) => {
        setPersona(selectedPersona);
    };

    // Mock login function
    const login = (userData: any) => {
        const { email } = userData;
        const name = email.split('@')[0].replace(/\./g, ' ').replace(/(^\w|\s\w)/g, (m:string) => m.toUpperCase()); // Create a name from email
        setUser({ name, email });
        setIsAuthenticated(true);
    };
    
    // Mock register function
    const register = (userData: any) => {
        const { name, email } = userData;
        setUser({ name, email, ...userData });
        setIsAuthenticated(true);
    }

    // Mock logout function
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setPersona(null); // Reset persona on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, persona, selectPersona, login, register, logout }}>
        {children}
        </AuthContext.Provider>
    );
};