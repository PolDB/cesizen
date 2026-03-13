import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import InputField from '../components/Inputfield';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.1.12:8000';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erreur', data.detail || 'Connexion échouée.');
        return;
      }

      // Stocker les infos utilisateur dans le contexte
      setUser({
        user_id: data.user_id,
        email: data.email,
        name: data.name,
        surname: data.surname,
      });

      router.push('/home');

    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInscription = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Connexion</Text>

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

      <Button
        label={loading ? 'Connexion...' : 'Se connecter'}
        onPress={handleLogin}
      />
      <Button label="S'inscrire" onPress={handleInscription} variante="secondaire" />
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