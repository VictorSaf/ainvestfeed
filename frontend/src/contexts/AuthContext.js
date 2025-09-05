import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAccessToken, getAccessToken, setAccessToken } from '../lib/auth';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(null);
    useEffect(() => {
        setTokenState(getAccessToken());
    }, []);
    const value = useMemo(() => ({
        isAuthenticated: !!token,
        token,
        login: (t) => { setAccessToken(t); setTokenState(t); },
        logout: () => { clearAccessToken(); setTokenState(null); },
    }), [token]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
