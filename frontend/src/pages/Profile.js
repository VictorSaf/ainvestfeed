import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
export default function ProfilePage() {
    const auth = useAuth();
    const [profile, setProfile] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [saved, setSaved] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            if (!auth.isAuthenticated) {
                setLoading(false);
                return;
            }
            try {
                const r = await apiFetch('/user/profile');
                const j = await r.json();
                setProfile(j.data);
            }
            catch {
                setError('Failed to load profile');
            }
            finally {
                setLoading(false);
            }
        })();
    }, [auth.isAuthenticated]);
    const onChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
        setSaved(false);
    };
    const onSave = async () => {
        if (!profile)
            return;
        setSaving(true);
        setError(null);
        try {
            const r = await apiFetch('/user/profile', { method: 'PUT', body: JSON.stringify({
                    firstName: profile.firstName ?? '',
                    lastName: profile.lastName ?? '',
                    language: profile.language ?? 'en',
                    timezone: profile.timezone ?? 'UTC',
                }) });
            if (!r.ok)
                throw new Error('Save failed');
            setSaved(true);
        }
        catch (e) {
            setError(e.message || 'Save failed');
        }
        finally {
            setSaving(false);
        }
    };
    if (!auth.isAuthenticated)
        return _jsx("div", { className: "max-w-2xl mx-auto p-4", role: "alert", children: "Please login to view your profile." });
    if (loading)
        return (_jsxs("div", { className: "max-w-2xl mx-auto p-4", children: ["Loading\u2026", _jsxs("div", { className: "mt-3 space-y-3 animate-pulse", "aria-hidden": true, children: [_jsx("div", { className: "h-5 bg-gray-200 rounded" }), _jsx("div", { className: "h-5 bg-gray-200 rounded w-5/6" }), _jsx("div", { className: "h-5 bg-gray-200 rounded w-2/3" })] })] }));
    if (error)
        return _jsx("div", { className: "max-w-2xl mx-auto p-4 text-red-600", role: "alert", children: error });
    if (!profile)
        return null;
    return (_jsxs("div", { className: "max-w-xl mx-auto p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Profile" }), _jsxs("div", { className: "flex flex-col gap-3", children: [_jsx("label", { className: "text-sm", htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", "data-testid": "email", className: "border rounded px-3 py-2", value: profile.email, readOnly: true }), _jsx("label", { className: "text-sm", htmlFor: "firstName", children: "First name" }), _jsx("input", { id: "firstName", "data-testid": "firstName", name: "firstName", className: "border rounded px-3 py-2", placeholder: "First name", value: profile.firstName ?? '', onChange: onChange }), _jsx("label", { className: "text-sm", htmlFor: "lastName", children: "Last name" }), _jsx("input", { id: "lastName", "data-testid": "lastName", name: "lastName", className: "border rounded px-3 py-2", placeholder: "Last name", value: profile.lastName ?? '', onChange: onChange }), _jsx("label", { className: "text-sm", htmlFor: "language", children: "Language" }), _jsx("input", { id: "language", "data-testid": "language", name: "language", className: "border rounded px-3 py-2", placeholder: "Language", value: profile.language ?? '', onChange: onChange }), _jsx("label", { className: "text-sm", htmlFor: "timezone", children: "Timezone" }), _jsx("input", { id: "timezone", "data-testid": "timezone", name: "timezone", className: "border rounded px-3 py-2", placeholder: "Timezone", value: profile.timezone ?? '', onChange: onChange }), _jsx("button", { "data-testid": "save", className: "border rounded px-3 py-2", disabled: saving, onClick: onSave, "aria-live": "polite", children: saving ? 'Saving…' : 'Save' }), saved ? _jsx("div", { "data-testid": "saved", className: "text-green-600 text-sm", role: "status", "aria-live": "polite", children: "Saved" }) : null] })] }));
}
