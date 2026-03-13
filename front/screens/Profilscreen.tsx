import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';

export default function ProfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.avatarContainer}>
        <Text style={styles.avatarTexte}>
          {user?.name?.[0]}{user?.surname?.[0]}
        </Text>
      </View>

      <Text style={styles.nom}>{user?.name} {user?.surname}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <Text style={styles.sectionTitre}>Historique activités</Text>
      <Text style={styles.historiqueVide}>Aucune activité pour le moment.</Text>

      <View style={styles.boutons}>
        <Button label="← Retour" onPress={() => router.back()} variante="secondaire" />
        <Button label="Se déconnecter" onPress={handleLogout} variante="secondaire" />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarTexte: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  nom: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 15, color: '#888', marginBottom: 32 },
  sectionTitre: { fontSize: 18, fontWeight: '600', color: '#333', alignSelf: 'flex-start', marginBottom: 12 },
  historiqueVide: { color: '#aaa', fontSize: 14, alignSelf: 'flex-start', marginBottom: 32 },
  boutons: { width: '100%', gap: 8 },
});