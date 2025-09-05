import React from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type Profile = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  language?: string | null;
  timezone?: string | null;
};

export default function ProfilePage() {
  const auth = useAuth();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!auth.isAuthenticated) { setLoading(false); return; }
      try {
        const r = await apiFetch('/user/profile');
        const j = await r.json();
        setProfile(j.data);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, [auth.isAuthenticated]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => (prev ? { ...prev, [name]: value } : prev));
    setSaved(false);
  };

  const onSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    try {
      const r = await apiFetch('/user/profile', { method: 'PUT', body: JSON.stringify({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        language: profile.language ?? 'en',
        timezone: profile.timezone ?? 'UTC',
      }) });
      if (!r.ok) throw new Error('Save failed');
      setSaved(true);
    } catch (e: any) {
      setError(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!auth.isAuthenticated) return <div className="max-w-2xl mx-auto p-4" role="alert">Please login to view your profile.</div>;
  if (loading) return (
    <div className="max-w-2xl mx-auto p-4">
      Loading…
      <div className="mt-3 space-y-3 animate-pulse" aria-hidden>
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-5 bg-gray-200 rounded w-5/6" />
        <div className="h-5 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
  if (error) return <div className="max-w-2xl mx-auto p-4 text-red-600" role="alert">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="flex flex-col gap-3">
        <label className="text-sm" htmlFor="email">Email</label>
        <input id="email" data-testid="email" className="border rounded px-3 py-2" value={profile.email} readOnly />
        <label className="text-sm" htmlFor="firstName">First name</label>
        <input id="firstName" data-testid="firstName" name="firstName" className="border rounded px-3 py-2" placeholder="First name" value={profile.firstName ?? ''} onChange={onChange} />
        <label className="text-sm" htmlFor="lastName">Last name</label>
        <input id="lastName" data-testid="lastName" name="lastName" className="border rounded px-3 py-2" placeholder="Last name" value={profile.lastName ?? ''} onChange={onChange} />
        <label className="text-sm" htmlFor="language">Language</label>
        <input id="language" data-testid="language" name="language" className="border rounded px-3 py-2" placeholder="Language" value={profile.language ?? ''} onChange={onChange} />
        <label className="text-sm" htmlFor="timezone">Timezone</label>
        <input id="timezone" data-testid="timezone" name="timezone" className="border rounded px-3 py-2" placeholder="Timezone" value={profile.timezone ?? ''} onChange={onChange} />
        <button data-testid="save" className="border rounded px-3 py-2" disabled={saving} onClick={onSave} aria-live="polite">{saving ? 'Saving…' : 'Save'}</button>
        {saved ? <div data-testid="saved" className="text-green-600 text-sm" role="status" aria-live="polite">Saved</div> : null}
      </div>
    </div>
  );
}


