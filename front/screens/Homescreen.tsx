import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import SideMenu from '../components/sidemenu';
import { COLORS } from '../constants/colors';

const activites = [
  { id: '1', nom: 'Respiration', sousTitre: 'Exercice de coherence cardiaque', route: '/respiration', icone: '🌬️', color: COLORS.violet },
  { id: '2', nom: 'Informations', sousTitre: 'Sante mentale et bien-etre', route: '/informations', icone: '📖', color: COLORS.saumon },
];

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.blanc} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.hamburger} accessibilityLabel="Ouvrir le menu" accessibilityRole="button">
          <View style={styles.line} /><View style={styles.line} /><View style={styles.line} />
        </TouchableOpacity>
        <Text style={styles.logoText}>CESIZEN</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Mes activites</Text>
        <Text style={styles.heroSub}>Prends soin de toi maintenant</Text>
      </View>
      <View style={styles.cardsContainer}>
        {activites.map(item => (
          <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => router.push(item.route as any)} activeOpacity={0.85}accessibilityLabel={`Accéder à ${item.nom}`} accessibilityRole="button">
            <View style={styles.cardLeft}>
              <View style={styles.cardIconBox}>
                <Text style={styles.cardIconText}>{item.icone}</Text>
              </View>
              <View>
                <Text style={styles.cardNom}>{item.nom}</Text>
                <Text style={styles.cardSousTitre}>{item.sousTitre}</Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
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
  hamburger: { padding: 4, gap: 4, width: 36 },
  line: { width: 20, height: 2, backgroundColor: COLORS.violet, borderRadius: 2, marginBottom: 3 },
  logoText: { fontSize: 15, fontWeight: '600', letterSpacing: 4, color: COLORS.violet },
  placeholder: { width: 36 },
  hero: { backgroundColor: COLORS.violetBg, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 },
  heroTitle: { fontSize: 22, fontWeight: '600', color: COLORS.titreDark, marginBottom: 4 },
  heroSub: { fontSize: 14, color: COLORS.texteMuted },
  cardsContainer: { padding: 20, gap: 12 },
  card: { borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' },
  cardIconText: { fontSize: 20 },
  cardNom: { fontSize: 15, fontWeight: '600', color: COLORS.blanc, marginBottom: 2 },
  cardSousTitre: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  cardArrow: { fontSize: 18, color: 'rgba(255,255,255,0.7)' },
});