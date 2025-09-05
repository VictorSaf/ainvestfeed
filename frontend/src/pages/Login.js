import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { setAccessToken } from '../lib/auth';
export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    return (_jsxs("div", { className: "max-w-sm mx-auto p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Login" }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("input", { "data-testid": "email", className: "border rounded px-3 py-2", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { "data-testid": "password", type: "password", className: "border rounded px-3 py-2", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value) }), _jsx("button", { "data-testid": "login-btn", className: "border rounded px-3 py-2", disabled: loading, onClick: async () => {
                            setLoading(true);
                            setError(null);
                            try {
                                const r = await fetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
                                const j = await r.json();
                                if (!r.ok)
                                    throw new Error(j?.error?.message || 'Login failed');
                                const token = j.data?.tokens?.accessToken;
                                if (token)
                                    setAccessToken(token);
                            }
                            catch (e) {
                                setError(e.message);
                            }
                            finally {
                                setLoading(false);
                            }
                        }, children: "Login" }), error ? _jsx("div", { className: "text-red-600 text-sm", "data-testid": "login-error", children: error }) : null] })] }));
}
