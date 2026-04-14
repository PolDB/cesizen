import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

   useEffect(() => {
    if (loading) return;
    const routesProtegees = ['profil', 'parametres'];
    const routesAdmin = ['admin'];
    const routeActuelle = segments[0];
 
    if (!user && routesProtegees.includes(routeActuelle)) {
      router.replace('/login' as any);
    }
    if ((!user || user.state !== 'admin') && routesAdmin.includes(routeActuelle)) {
      router.replace('/home' as any);
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
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="home" />
          <Stack.Screen name="profil" />
          <Stack.Screen name="parametres" />
          <Stack.Screen name="respiration" />
          <Stack.Screen name="admin" />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}