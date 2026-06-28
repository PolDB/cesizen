import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
const stats = [
  { label: 'Sessions', valeur: '12', icone: '🧘' },
  { label: 'Durée totale', valeur: '1h24', icone: '⏱' },
  { label: 'Dernière activité', valeur: 'Hier', icone: '📅' },
  { label: 'Streak', valeur: '3 jours', icone: '🔥' },
];

export default function ProfilScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.retour} accessibilityLabel="Retour" accessibilityRole="button">
            <Text style={styles.retourTexte}>←</Text>
          </TouchableOpacity>
          <Text style={styles.logoText}>CESIZEN</Text>
          <TouchableOpacity
            onPress={() => router.push('/parametres' as any)}
            style={styles.engrenage}
            accessibilityLabel="Paramètres"
            accessibilityRole="button"
          >
            <Text style={styles.engrenageTexte}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + infos */}
        <View style={styles.profilSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexte}>
              {user?.name?.[0]}{user?.surname?.[0]}
            </Text>
          </View>
          <Text style={styles.nom}>{user?.name} {user?.surname}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcone}>{stat.icone}</Text>
              <Text style={styles.statValeur}>{stat.valeur}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Déconnexion */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.boutonDeconnexion} onPress={handleLogout} accessibilityLabel="Se déconnecter" accessibilityRole="button">
            <Text style={styles.boutonDeconnexionTexte}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
header: {
  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: (StatusBar.currentHeight || 0) + 12,
  paddingBottom: 14,
  borderBottomWidth: 1, borderBottomColor: COLORS.violetBorder,
},
  retour: { width: 36, padding: 4 },
  retourTexte: { fontSize: 22, color: '#333' },
  logoText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 3, color: '#333' },
  engrenage: { width: 36, alignItems: 'flex-end' },
  engrenageTexte: { fontSize: 22 },
  profilSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarTexte: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  nom: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 14, color: '#888' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#F7FAFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0FE',
  },
  statIcone: { fontSize: 24, marginBottom: 8 },
  statValeur: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#888' },
  section: { paddingHorizontal: 20, paddingBottom: 32 },
  boutonDeconnexion: {
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  boutonDeconnexionTexte: { color: '#e74c3c', fontWeight: 'bold', fontSize: 15 },
});