import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, Alert, Modal, Platform,StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
const API_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.1.12:8000';

const ROLES = ['user', 'admin', 'suspendu', 'supprimer'];

const ROLE_COLORS: Record<string, string> = {
  admin: '#4A90E2',
  user: '#7ED321',
  suspendu: '#F5A623',
  supprimer: '#e74c3c',
};

type User = {
  id_user: number;
  Name: string;
  Surname: string;
  email: string;
  state: string;
  Activate: boolean;
};

export default function AdminScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleModal, setRoleModal] = useState<User | null>(null);

  useEffect(() => {
    chargerUsers();
  }, []);

  const chargerUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/users`);
      const data = await response.json();
      setUsers(data);
    } catch {
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const modifierRole = async (userId: number, role: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: role }),
      });
      if (!response.ok) throw new Error();
      setRoleModal(null);
      chargerUsers();
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier le role.');
    }
  };

const supprimerUser = async (u: User) => {
  const confirme = Platform.OS === 'web'
    ? window.confirm(`Supprimer ${u.Name} ${u.Surname} ?`)
    : await new Promise(resolve =>
        Alert.alert('Supprimer', `Supprimer ${u.Name} ${u.Surname} ?`, [
          { text: 'Annuler', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Supprimer', onPress: () => resolve(true), style: 'destructive' }
        ])
      );

  if (!confirme) return;

  try {
    await fetch(`${API_URL}/admin/users/${u.id_user}`, { method: 'DELETE' });
    chargerUsers();
  } catch {
    Alert.alert('Erreur', 'Impossible de supprimer.');
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.retour} accessibilityLabel="Retour" accessibilityRole="button">
          <Text style={styles.retourTexte}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>CESIZEN</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.container}>
        <Text style={styles.titre}>Administration</Text>
        <Text style={styles.sousTitre}>{users.length} utilisateur(s)</Text>

        {loading ? (
          <Text style={styles.loading}>Chargement...</Text>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => String(item.id_user)}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarTexte}>
                    {item.Name?.[0]}{item.Surname?.[0]}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.Name} {item.Surname}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: ROLE_COLORS[item.state] || '#888' }]}>
                    <Text style={styles.roleTexte}>{item.state}</Text>
                  </View>
                </View>
                <View style={styles.userActions}>
                  <TouchableOpacity
                    style={styles.btnRole}
                    onPress={() => setRoleModal(item)}
                    accessibilityLabel="Modifier le rôle"
                    accessibilityRole="button"
                  >
                    <Text style={styles.btnRoleTexte}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnSuppr}
                    onPress={() => supprimerUser(item)}
                    disabled={item.id_user === user?.user_id}
                    accessibilityLabel="Supprimer"
                    accessibilityRole="button"
                  >
                    <Text style={styles.btnSupprTexte}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      {/* Modal choix de role */}
      <Modal visible={!!roleModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitre}>
              Modifier le role de {roleModal?.Name}
            </Text>
            {ROLES.map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.roleOption, { borderColor: ROLE_COLORS[role] }]}
                onPress={() => modifierRole(roleModal!.id_user, role)}
                accessibilityLabel={`Choisir le rôle ${role}`}
                accessibilityRole="button"
              >
                <Text style={[styles.roleOptionTexte, { color: ROLE_COLORS[role] }]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.btnAnnuler} onPress={() => setRoleModal(null)} accessibilityLabel="Annuler" accessibilityRole="button">
              <Text style={styles.btnAnnulerTexte}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
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
  placeholder: { width: 36 },
  container: { flex: 1, padding: 20 },
  titre: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  sousTitre: { fontSize: 14, color: '#888', marginBottom: 20 },
  loading: { color: '#aaa', textAlign: 'center', marginTop: 40 },
  userCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F7FAFF', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#E8F0FE',
  },
  userAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  userAvatarTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 12, color: '#888', marginBottom: 4 },
  roleBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10,
  },
  roleTexte: { color: '#fff', fontSize: 11, fontWeight: '600' },
  userActions: { flexDirection: 'row', gap: 8 },
  btnRole: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#EBF3FB', justifyContent: 'center', alignItems: 'center',
  },
  btnRoleTexte: { fontSize: 16 },
  btnSuppr: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center',
  },
  btnSupprTexte: { fontSize: 16 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 24,
    width: '100%', maxWidth: 340,
  },
  modalTitre: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  roleOption: {
    borderWidth: 1.5, borderRadius: 8, padding: 13,
    alignItems: 'center', marginBottom: 10,
  },
  roleOptionTexte: { fontWeight: 'bold', fontSize: 15, textTransform: 'capitalize' },
  btnAnnuler: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 13, alignItems: 'center', marginTop: 4,
  },
  btnAnnulerTexte: { color: '#888', fontWeight: '600' },
});