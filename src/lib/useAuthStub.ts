import { useEffect, useState } from 'react';

type User = { id: string; email: string } | null;

export function useAuthStub() {
  const [user, setUser] = useState<User>(null);
  useEffect(() => {
    const raw = localStorage.getItem('solarhome-auth-stub');
    if (raw) setUser(JSON.parse(raw));
  }, []);
  const login = () => {
    const u = { id: 'stub-user-1', email: 'demo@example.com' };
    localStorage.setItem('solarhome-auth-stub', JSON.stringify(u));
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem('solarhome-auth-stub');
    setUser(null);
  };
  return { user, login, logout };
}

