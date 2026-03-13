import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/Inputfield';
import Button from '../components/button';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.1.12:8000';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erreur', data.detail || 'Inscription échouée.');
        return;
      }

      Alert.alert('Succès', 'Compte créé ! Vous pouvez vous connecter.');
      router.push('/');

    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Inscription</Text>

      <InputField
        label="Nom"
        value={name}
        onChangeText={setName}
        placeholder="Dupont"
      />

      <InputField
        label="Prénom"
        value={surname}
        onChangeText={setSurname}
        placeholder="Jean"
      />

      <InputField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="exemple@mail.com"
        keyboardType="email-address"
      />

      <InputField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <InputField
        label="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        label={loading ? 'Inscription...' : "Créer mon compte"}
        onPress={handleRegister}
      />
      <Button label="← Retour" onPress={() => router.push('/')} variante="secondaire" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
});