import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/Inputfield';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const API_URL = Platform.OS === 'web' ? 'http://localhost:8000' : 'http://192.168.1.12:8000';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Veuillez remplir tous les champs.'); return; }
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) { Alert.alert('Erreur', data.detail || 'Identifiants incorrects.'); return; }
      await setUser({ user_id: data.user_id, email: data.email, name: data.name, surname: data.surname, state: data.state });
      router.replace('/home' as any);
    } catch { Alert.alert('Erreur', 'Impossible de contacter le serveur.'); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🧘</Text>
        </View>
        <Text style={styles.titre}>Connexion</Text>
        <Text style={styles.sousTitre}>Content de te revoir</Text>
      </View>
      <View style={styles.form}>
        <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <InputField label="Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} accessibilityLabel="Se connecter" accessibilityRole="button">
          <Text style={styles.btnPrimaryTexte}>Se connecter</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/register' as any)} accessibilityLabel="S'inscrire" accessibilityRole="button">
          <Text style={styles.btnOutlineTexte}>Inscription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGuest} onPress={() => router.replace('/home' as any)} accessibilityLabel="Continuer en tant que visiteur" accessibilityRole="button">
          <Text style={styles.btnGuestTexte}>Continuer en tant que visiteur</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.blanc },
  hero: { backgroundColor: COLORS.violetBg, padding: 32, alignItems: 'center' },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.violet,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoEmoji: { fontSize: 30 },
  titre: { fontSize: 22, fontWeight: '600', color: COLORS.titreDark, marginBottom: 4 },
  sousTitre: { fontSize: 14, color: COLORS.texteMuted },
  form: { padding: 24, gap: 12 },
  btnPrimary: { backgroundColor: COLORS.violet, borderRadius: 12, padding: 14, alignItems: 'center' },
  btnPrimaryTexte: { color: COLORS.blanc, fontWeight: '600', fontSize: 15 },
  divider: { height: 1, backgroundColor: COLORS.violetBorder },
  btnOutline: { borderWidth: 1.5, borderColor: COLORS.violet, borderRadius: 12, padding: 13, alignItems: 'center' },
  btnOutlineTexte: { color: COLORS.violet, fontWeight: '600', fontSize: 15 },
  btnGuest: { padding: 10, alignItems: 'center' },
  btnGuestTexte: { color: COLORS.texteMuted, fontSize: 13 },
});