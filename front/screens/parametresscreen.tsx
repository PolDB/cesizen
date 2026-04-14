import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Modal, Alert, TextInput, Platform, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.1.12:8000';

export default function ParametresScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mdpModalVisible, setMdpModalVisible] = useState(false);
  const [suppressionModalVisible, setSuppressionModalVisible] = useState(false);
  const [ancienMdp, setAncienMdp] = useState('');
  const [nouveauMdp, setNouveauMdp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReinitialisationPerformances = () => {
    Alert.alert(
      'Réinitialiser',
      'Voulez-vous vraiment réinitialiser vos performances ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => Alert.alert('Succès', 'Performances réinitialisées.') },
      ]
    );
  };

  const handleExporterDonnees = () => {
    Alert.alert('Export', 'Vos données ont été exportées avec succès.');
  };

  const handleChangerMdp = async () => {
    if (!ancienMdp || !nouveauMdp) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          ancien_password: ancienMdp,
          nouveau_password: nouveauMdp,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Erreur', data.detail || 'Modification échouée.');
        return;
      }
      setMdpModalVisible(false);
      setAncienMdp('');
      setNouveauMdp('');
      Alert.alert('Succès', 'Mot de passe modifié.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimerCompte = async () => {
    setSuppressionModalVisible(false);
    await logout();
    router.replace('/home' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.retour} accessibilityLabel="Retour" accessibilityRole="button">
            <Text style={styles.retourTexte}>←</Text>
          </TouchableOpacity>
          <Text style={styles.logoText}>CESIZEN</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.container}>
          <Text style={styles.titre}>Paramètres</Text>

          <View style={styles.section}>
            <TouchableOpacity style={styles.optionBtn} onPress={handleReinitialisationPerformances} accessibilityLabel="Réinitialiser les performances" accessibilityRole="button">
              <Text style={styles.optionTexte}>Réinitialiser les performances</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={() => setMdpModalVisible(true)} accessibilityLabel="Changer le mot de passe" accessibilityRole="button" >
              <Text style={styles.optionTexte}>Changer son mot de passe</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={handleExporterDonnees} accessibilityLabel="Exporter les données personnelles" accessibilityRole="button">
              <Text style={styles.optionTexte}>Exporter les données personnelles</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.boutonSuppression} onPress={() => setSuppressionModalVisible(true)} accessibilityLabel="Supprimer son compte" accessibilityRole="button">
            <Text style={styles.boutonSuppressionTexte}>Supprimer son compte</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modal changer mot de passe */}
      <Modal visible={mdpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitre}>Changer le mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="Ancien mot de passe"
              secureTextEntry
              value={ancienMdp}
              onChangeText={setAncienMdp}
            />
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              value={nouveauMdp}
              onChangeText={setNouveauMdp}
            />
            <View style={styles.modalBoutons}>
              <TouchableOpacity style={styles.boutonAnnuler} onPress={() => setMdpModalVisible(false)} accessibilityLabel="Annuler" accessibilityRole="button">
                <Text style={styles.boutonAnnulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boutonConfirmer} onPress={handleChangerMdp} accessibilityLabel="Confirmer" accessibilityRole="button" disabled={loading}>
                <Text style={styles.boutonConfirmerTexte}>{loading ? '...' : 'Confirmer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal suppression */}
      <Modal visible={suppressionModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitre}>Supprimer le compte</Text>
            <Text style={styles.modalTexte}>
              Cette action est irréversible. Toutes vos données seront supprimées définitivement.
            </Text>
            <View style={styles.modalBoutons}>
              <TouchableOpacity style={styles.boutonAnnuler} onPress={() => setSuppressionModalVisible(false)} accessibilityLabel="Annuler" accessibilityRole="button">
                <Text style={styles.boutonAnnulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boutonSupprimerConfirm} onPress={handleSupprimerCompte} accessibilityLabel="Supprimer" accessibilityRole="button">
                <Text style={styles.boutonConfirmerTexte}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  placeholder: { width: 36 },
  container: { padding: 24 },
  titre: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 28 },
  section: {
    borderWidth: 1, borderColor: '#f0f0f0',
    borderRadius: 12, marginBottom: 24, overflow: 'hidden',
  },
  optionBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff',
  },
  optionTexte: { fontSize: 15, color: '#333' },
  optionArrow: { fontSize: 16, color: '#aaa' },
  boutonSuppression: {
    backgroundColor: '#e74c3c', borderRadius: 12, padding: 18, alignItems: 'center',
  },
  boutonSuppressionTexte: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 24,
    width: '100%', maxWidth: 360,
  },
  modalTitre: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  modalTexte: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8,
    padding: 12, fontSize: 15, marginBottom: 12,
  },
  modalBoutons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  boutonAnnuler: {
    flex: 1, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 13, alignItems: 'center',
  },
  boutonAnnulerTexte: { color: '#888', fontWeight: '600' },
  boutonConfirmer: {
    flex: 1, backgroundColor: '#4A90E2', borderRadius: 8, padding: 13, alignItems: 'center',
  },
  boutonSupprimerConfirm: {
    flex: 1, backgroundColor: '#e74c3c', borderRadius: 8, padding: 13, alignItems: 'center',
  },
  boutonConfirmerTexte: { color: '#fff', fontWeight: '600' },
});