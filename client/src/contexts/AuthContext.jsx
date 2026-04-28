import { createContext, useState, useEffect } from "react";
import axios from "axios";
import * as constClass from "../utils/Constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${constClass.SERVER_API_URL}/api/user`, { withCredentials: true })
        .then(res => {
            setUser(res.data); 
            setLoading(false);
        })
        .catch(err => {
            console.error("Not authenticated");
            setUser(null);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
