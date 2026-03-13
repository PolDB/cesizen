import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../components/button';

const PHASES = [
  { nom: 'Inspiration', duree: 4, couleur: '#4A90E2' },
  { nom: 'Apnée',       duree: 4, couleur: '#F5A623' },
  { nom: 'Expiration',  duree: 4, couleur: '#7ED321' },
];

export default function RespirationScreen() {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondes, setSecondes] = useState(PHASES[0].duree);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scale = useRef(new Animated.Value(1)).current;

  const phaseActuelle = PHASES[phaseIndex];

  useEffect(() => {
    if (!enCours) return;
    if (phaseActuelle.nom === 'Inspiration') {
      Animated.timing(scale, { toValue: 1.4, duration: phaseActuelle.duree * 1000, useNativeDriver: true }).start();
    } else if (phaseActuelle.nom === 'Expiration') {
      Animated.timing(scale, { toValue: 1, duration: phaseActuelle.duree * 1000, useNativeDriver: true }).start();
    }
  }, [phaseIndex, enCours]);

  useEffect(() => {
    if (!enCours) return;
    intervalRef.current = setInterval(() => {
      setSecondes((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => (pi + 1) % PHASES.length);
          return PHASES[(phaseIndex + 1) % PHASES.length].duree;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [enCours, phaseIndex]);

  const demarrer = () => {
    setPhaseIndex(0);
    setSecondes(PHASES[0].duree);
    setEnCours(true);
  };

  const arreter = () => {
    setEnCours(false);
    setPhaseIndex(0);
    setSecondes(PHASES[0].duree);
    scale.setValue(1);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Activité respiration</Text>

      <View style={styles.cercleContainer}>
        <Animated.View style={[styles.cercle, { backgroundColor: phaseActuelle.couleur, transform: [{ scale }] }]}>
          <Text style={styles.phaseNom}>{phaseActuelle.nom}</Text>
          <Text style={styles.phaseSecondes}>{secondes}s</Text>
        </Animated.View>
      </View>

      <View style={styles.phasesIndicateur}>
        {PHASES.map((p, i) => (
          <View key={p.nom} style={styles.phaseInfo}>
            <View style={[styles.phasePuce, { backgroundColor: p.couleur, opacity: i === phaseIndex ? 1 : 0.3 }]} />
            <Text style={styles.phaseLabel}>{p.nom} · {p.duree}s</Text>
          </View>
        ))}
      </View>

      {!enCours
        ? <Button label="Démarrer" onPress={demarrer} />
        : <Button label="Arrêter" onPress={arreter} variante="secondaire" />
      }
      <Button label="← Retour" onPress={() => router.back()} variante="secondaire" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60, alignItems: 'center' },
  titre: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 40 },
  cercleContainer: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  cercle: { width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center' },
  phaseNom: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  phaseSecondes: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  phasesIndicateur: { alignSelf: 'stretch', marginBottom: 32, gap: 8 },
  phaseInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  phasePuce: { width: 12, height: 12, borderRadius: 6 },
  phaseLabel: { fontSize: 15, color: '#555' },
});