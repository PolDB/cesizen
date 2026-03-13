import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Attendre que AsyncStorage soit lu

    const routesProtegees = ['home', 'profil', 'respiration'];
    const routeActuelle = segments[0];
    const estProtegee = routesProtegees.includes(routeActuelle);

    if (!user && estProtegee) {
      router.replace('/');
    }
  }, [user, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="profil" />
          <Stack.Screen name="respiration" />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}