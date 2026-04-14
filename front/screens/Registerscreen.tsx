import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Modal, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/Inputfield';
import { COLORS } from '../constants/colors';

const API_URL = Platform.OS === 'web' ? 'http://localhost:8000' : 'http://192.168.1.12:8000';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    if (!name || !surname || !email || !password) { Alert.alert('Erreur', 'Veuillez remplir tous les champs.'); return; }
    setModalVisible(true);
  };

  const handleConsentement = async (accepte: boolean) => {
    setModalVisible(false);
    if (!accepte) { Alert.alert('Inscription annulee', 'Le consentement est requis.'); return; }
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password }),
      });
      const data = await response.json();
      if (!response.ok) { Alert.alert('Erreur', data.detail || 'Une erreur est survenue.'); return; }
      Alert.alert('Succes', 'Compte cree ! Vous pouvez vous connecter.', [{ text: 'OK', onPress: () => router.replace('/login' as any) }]);
    } catch { Alert.alert('Erreur', 'Impossible de contacter le serveur.'); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.retourTexte} accessibilityLabel="Retour" accessibilityRole="button">
          <Text style={styles.retourTexte}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>CESIZEN</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.hero}>
        <Text style={styles.titre}>Inscription</Text>
        <Text style={styles.sousTitre}>Rejoins la communaute CesiZen</Text>
      </View>
      <View style={styles.form}>
        <InputField label="Prenom" value={name} onChangeText={setName} />
        <InputField label="Nom" value={surname} onChangeText={setSurname} />
        <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <InputField label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} accessibilityLabel="Creer mon compte" accessibilityRole="button">
          <Text style={styles.btnPrimaryTexte}>Creer mon compte</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitre}>Consentement utilisation des données</Text>
            <Text style={styles.modalTexte}>
              En creant un compte, vous acceptez que vos donnees soient utilisees dans le cadre de application CesiZen, conformement au RGPD. Vos donnees ne seront jamais vendues ou partagees.
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.btnNon} onPress={() => handleConsentement(false)} accessibilityLabel="Refuser" accessibilityRole="button">
                <Text style={styles.btnNonTexte}>Refuser</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnOui} onPress={() => handleConsentement(true)} accessibilityLabel="Accepter" accessibilityRole="button">
                <Text style={styles.btnOuiTexte}>Accepter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.blanc },
 header: {
  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: (StatusBar.currentHeight || 0) + 12,
  paddingBottom: 14,
  borderBottomWidth: 1, borderBottomColor: COLORS.violetBorder,
},
  retourTexte: { fontSize: 40, color: COLORS.violet, padding: 1 },
  logoText: { fontSize: 15, fontWeight: '600', letterSpacing: 4, color: COLORS.violet },
  placeholder: { width: 36 },
  hero: { backgroundColor: COLORS.violetBg, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  titre: { fontSize: 22, fontWeight: '600', color: COLORS.titreDark, marginBottom: 4 },
  sousTitre: { fontSize: 14, color: COLORS.texteMuted },
  form: { padding: 24, gap: 12 },
  btnPrimary: { backgroundColor: COLORS.violet, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 4 },
  btnPrimaryTexte: { color: COLORS.blanc, fontWeight: '600', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(61,53,102,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: COLORS.blanc, borderRadius: 20, padding: 24, width: '100%', maxWidth: 360 },
  modalTitre: { fontSize: 17, fontWeight: '600', color: COLORS.titreDark, marginBottom: 12 },
  modalTexte: { fontSize: 14, color: COLORS.texteMuted, lineHeight: 22, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 10 },
  btnNon: { flex: 1, borderWidth: 1.5, borderColor: COLORS.violetBorder, borderRadius: 10, padding: 13, alignItems: 'center' },
  btnNonTexte: { color: COLORS.texteMuted, fontWeight: '600' },
  btnOui: { flex: 1, backgroundColor: COLORS.violet, borderRadius: 10, padding: 13, alignItems: 'center' },
  btnOuiTexte: { color: COLORS.blanc, fontWeight: '600' },
});