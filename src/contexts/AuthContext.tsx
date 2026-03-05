import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { registerProfile } from '@/lib/api';
import type { User as MockUserProfile } from '@/lib/mock-data';

const STORAGE_KEY = 'blasira-mock-auth';

export interface Profile {
  id: string;
  name: string;
  phone: string;
  avatar_url: string | null;
  role: 'student' | 'driver_moto' | 'driver_car';
  university: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  rating: number;
  total_trips: number;
}

export interface MockUser {
  id: string;
  email?: string;
}

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (phone: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (phone: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

function buildProfile(id: string, phone: string, name: string, isSignUp: boolean): Profile {
  const cleanedPhone = phone.replace(/\D/g, '').trim();
  const displayPhone = cleanedPhone ? `+223 ${cleanedPhone.slice(0, 2)} ${cleanedPhone.slice(2, 5)} ${cleanedPhone.slice(5)}` : '+223';
  return {
    id,
    name: name || 'Utilisateur',
    phone: displayPhone,
    avatar_url: null,
    role: 'student',
    university: null,
    verification_status: 'pending',
    rating: 0,
    total_trips: 0,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<{ user: MockUser } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (user && profile) {
      setProfile({ ...profile });
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as { user: MockUser; profile: Profile };
        if (data.user?.id && data.profile) {
          setUser(data.user);
          setSession({ user: data.user });
          setProfile(data.profile);
          registerProfile(data.user.id, data.profile as unknown as MockUserProfile);
        }
      }
    } catch {
      // ignore invalid stored auth
    }
    setLoading(false);
  }, []);

  const persist = (u: MockUser | null, p: Profile | null) => {
    if (u && p) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, profile: p }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const signUp = async (phone: string, _password: string, name: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const id = `mock-${Date.now()}`;
    const email = `${phone.replace(/\D/g, '')}@blasira.app`;
    const mockUser: MockUser = { id, email };
    const newProfile = buildProfile(id, phone, name, true);
    setUser(mockUser);
    setSession({ user: mockUser });
    setProfile(newProfile);
    registerProfile(id, newProfile as unknown as MockUserProfile);
    persist(mockUser, newProfile);
    return { error: null };
  };

  const signIn = async (phone: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 300));
    const id = `mock-${Date.now()}`;
    const email = `${phone.replace(/\D/g, '')}@blasira.app`;
    const mockUser: MockUser = { id, email };
    const newProfile = buildProfile(id, phone, 'Utilisateur', false);
    setUser(mockUser);
    setSession({ user: mockUser });
    setProfile(newProfile);
    registerProfile(id, newProfile as unknown as MockUserProfile);
    persist(mockUser, newProfile);
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setProfile(null);
    persist(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
