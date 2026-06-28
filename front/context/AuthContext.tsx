import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  user_id: number;
  email: string;
  name: string;
  surname: string;
  state?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, setUser: () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const chargerUser = async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        if (json) setUserState(JSON.parse(json));
      } catch (e) {
        console.error('Erreur lecture AsyncStorage', e);
      } finally {
        setLoading(false);
      }
    };
    chargerUser();
  }, []);

  const setUser = async (user: User | null) => {
    setUserState(user);
    if (user) await AsyncStorage.setItem('user', JSON.stringify(user));
    else await AsyncStorage.removeItem('user');
  };

  const logout = async () => {
    setUserState(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}