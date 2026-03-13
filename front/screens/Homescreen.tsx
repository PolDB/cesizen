import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

const activites = [
  { id: '1', nom: 'Activité respiration', route: '/respiration' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titre}>Mes activités</Text>
        <TouchableOpacity
          style={styles.boutonProfil}
          onPress={() => router.push('/profil')}
        >
          <Text style={styles.boutonProfilTexte}>👤 Profil</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des activités */}
      <FlatList
        data={activites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.carteActivite}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.carteTexte}>{item.nom}</Text>
            <Text style={styles.carteArrow}>→</Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  boutonProfil: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  boutonProfilTexte: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  carteActivite: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  carteTexte: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  carteArrow: {
    color: '#fff',
    fontSize: 20,
  },
});