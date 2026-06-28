import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';

const CYCLES = [
  { id: '1', nom: '7 — 4 — 8', phases: [{ nom: 'Inspiration', duree: 7, color: COLORS.violet, bg: COLORS.violetBg, border: COLORS.violetBorder }, { nom: 'Apnee', duree: 4, color: COLORS.violetLight, bg: '#F0EEF9', border: COLORS.violetBorder }, { nom: 'Expiration', duree: 8, color: COLORS.saumon, bg: COLORS.saumonBg, border: COLORS.saumonBorder }] },
  { id: '2', nom: '5 — 0 — 5', phases: [{ nom: 'Inspiration', duree: 5, color: COLORS.violet, bg: COLORS.violetBg, border: COLORS.violetBorder }, { nom: 'Expiration', duree: 5, color: COLORS.saumon, bg: COLORS.saumonBg, border: COLORS.saumonBorder }] },
  { id: '3', nom: '4 — 0 — 6', phases: [{ nom: 'Inspiration', duree: 4, color: COLORS.violet, bg: COLORS.violetBg, border: COLORS.violetBorder }, { nom: 'Expiration', duree: 6, color: COLORS.saumon, bg: COLORS.saumonBg, border: COLORS.saumonBorder }] },
];

const CIRCUMFERENCE = 2 * Math.PI * 44;

export default function RespirationScreen() {
  const router = useRouter();
  const [etape, setEtape] = useState<'choix' | 'securite' | 'exercice'>('choix');
  const [cycleChoisi, setCycleChoisi] = useState(CYCLES[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondes, setSecondes] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const progression = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<any>(null);

  const phaseActuelle = cycleChoisi.phases[phaseIndex];
  const dashOffset = CIRCUMFERENCE * (1 - secondes / phaseActuelle.duree);

  useEffect(() => {
    if (etape !== 'exercice') return;
    setSecondes(phaseActuelle.duree);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!enPause) {
      intervalRef.current = setInterval(() => {
        setSecondes(prev => {
          if (prev <= 1) {
            setPhaseIndex(i => (i + 1) % cycleChoisi.phases.length);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [etape, phaseIndex, enPause]);

  useEffect(() => { if (etape === 'exercice') setSecondes(phaseActuelle.duree); }, [phaseIndex]);

  const arreter = () => { clearInterval(intervalRef.current); setEtape('choix'); setPhaseIndex(0); };

  if (etape === 'choix') return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home' as any)}><Text style={styles.retourTexte}>←</Text></TouchableOpacity>
        <Text style={styles.logoText}>CESIZEN</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Exercice de respiration</Text>
        <Text style={styles.heroSub}>Choisis ton cycle</Text>
      </View>
      <View style={styles.cyclesList}>
        {CYCLES.map(cycle => (
          <TouchableOpacity key={cycle.id} style={[styles.cycleCard, cycleChoisi.id === cycle.id && styles.cycleCardSelected]}
            onPress={() => setCycleChoisi(cycle)}>
            <View style={styles.cycleCardTop}>
              <Text style={styles.cycleNom}>{cycle.nom}</Text>
              <View style={[styles.cycleDot, cycleChoisi.id === cycle.id && styles.cycleDotSelected]} />
            </View>
            <View style={styles.cyclePills}>
              {cycle.phases.map((p, i) => (
                <View key={i} style={styles.pill}>
                  <Text style={styles.pillTexte}>{p.nom} {p.duree}s</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.bottomPad}>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => setEtape('securite')}>
          <Text style={styles.btnPrimaryTexte}>Suivant →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (etape === 'securite') return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setEtape('choix')}><Text style={styles.retourTexte}>←</Text></TouchableOpacity>
        <Text style={styles.logoText}>CESIZEN</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.secuBody}>
        <View style={styles.secuIcon}><Text style={{ fontSize: 32 }}>🛡️</Text></View>
        <Text style={styles.secuTitre}>Avant de commencer</Text>
        <Text style={styles.secuTexte}>Cet exercice est destine a des personnes en bonne sante. Arretez immediatement si vous ressentez un malaise, des vertiges ou une gene.</Text>
        <View style={styles.secuUrgence}>
          <Text style={styles.secuUrgenceLabel}>En cas urgence</Text>
          <Text style={styles.secuUrgenceTexte}>Appelez le 15 (SAMU) ou le 112</Text>
        </View>
        <TouchableOpacity style={styles.btnPrimary} onPress={() => { setPhaseIndex(0); setEtape('exercice'); }}>
          <Text style={styles.btnPrimaryTexte}>Jai compris, on commence</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: phaseActuelle.bg }]}>
      <View style={[styles.header, { backgroundColor: phaseActuelle.bg, borderBottomColor: phaseActuelle.border }]}>
        <TouchableOpacity onPress={arreter} accessibilityLabel="Retour" accessibilityRole="button">
          <Text style={[styles.retourTexte, { color: phaseActuelle.color }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.logoText, { color: phaseActuelle.color }]}>CESIZEN</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.exoBody}>
        <Text style={[styles.phaseLabel, { color: phaseActuelle.color }]}>{phaseActuelle.nom.toUpperCase()}</Text>
        <View style={styles.cadranWrapper}>
          <Svg width={160} height={160} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="50" fill={phaseActuelle.bg} stroke={phaseActuelle.border} strokeWidth="1" />
            <Circle cx="60" cy="60" r="44" fill="none" stroke={phaseActuelle.color} strokeWidth="7"
              strokeDasharray={`${CIRCUMFERENCE * (secondes / phaseActuelle.duree)} ${CIRCUMFERENCE}`}
              strokeLinecap="round" transform="rotate(-90 60 60)" />
            <Circle cx="60" cy="60" r="34" fill={COLORS.blanc} />
          </Svg>
          <View style={styles.cadranCenter}>
            <Text style={[styles.cadranSecondes, { color: phaseActuelle.color }]}>{secondes}</Text>
            <Text style={styles.cadranLabel}>sec</Text>
          </View>
        </View>
        <View style={styles.phasesRow}>
          {cycleChoisi.phases.map((p, i) => (
            <View key={i} style={styles.phaseItem}>
              <View style={[styles.phaseDot, { backgroundColor: i === phaseIndex ? p.color : COLORS.violetBorder }]} />
              <Text style={styles.phaseNom}>{p.nom}</Text>
              <Text style={[styles.phaseDuree, { color: i === phaseIndex ? p.color : COLORS.texteMuted }]}>{p.duree}s</Text>
            </View>
          ))}
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlBtnSm]} onPress={arreter} accessibilityLabel="Arrêter" accessibilityRole="button">
            <Text style={styles.ctrlBtnTexte}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlBtnLg, { backgroundColor: phaseActuelle.color }]}
            onPress={() => setEnPause(!enPause)} accessibilityLabel={enPause ? "Reprendre" : "Mettre en pause"} accessibilityRole="button">
            <Text style={[styles.ctrlBtnTexte, { color: COLORS.blanc, fontSize: 22 }]}>{enPause ? '▶' : '⏸'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlBtnSm]} onPress={() => setPhaseIndex(i => (i + 1) % cycleChoisi.phases.length)}>
            <Text style={styles.ctrlBtnTexte}>⏭</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  hero: { backgroundColor: COLORS.violetBg, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  heroTitle: { fontSize: 20, fontWeight: '600', color: COLORS.titreDark, marginBottom: 4 },
  heroSub: { fontSize: 14, color: COLORS.texteMuted },
  cyclesList: { padding: 20, gap: 10 },
  cycleCard: { borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: COLORS.violetBorder, backgroundColor: COLORS.fondPage },
  cycleCardSelected: { borderColor: COLORS.violet, backgroundColor: COLORS.violetCard },
  cycleCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cycleNom: { fontSize: 16, fontWeight: '600', color: COLORS.titreDark },
  cycleDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.violetBorder },
  cycleDotSelected: { backgroundColor: COLORS.violet },
  cyclePills: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  pill: { backgroundColor: COLORS.violetCard, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  pillTexte: { fontSize: 11, color: COLORS.violet },
  bottomPad: { paddingHorizontal: 20, paddingTop: 8 },
  btnPrimary: { backgroundColor: COLORS.violet, borderRadius: 12, padding: 14, alignItems: 'center' },
  btnPrimaryTexte: { color: COLORS.blanc, fontWeight: '600', fontSize: 15 },
  secuBody: { flex: 1, padding: 24, alignItems: 'center', gap: 16, justifyContent: 'center' },
  secuIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.saumonBg, justifyContent: 'center', alignItems: 'center' },
  secuTitre: { fontSize: 20, fontWeight: '600', color: COLORS.titreDark, textAlign: 'center' },
  secuTexte: { fontSize: 14, color: COLORS.texteMuted, textAlign: 'center', lineHeight: 22 },
  secuUrgence: { backgroundColor: COLORS.saumonBg, borderRadius: 12, padding: 14, width: '100%' },
  secuUrgenceLabel: { fontSize: 12, fontWeight: '600', color: COLORS.saumon, marginBottom: 4 },
  secuUrgenceTexte: { fontSize: 13, color: COLORS.saumonDark },
  exoBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24, padding: 24 },
  phaseLabel: { fontSize: 14, fontWeight: '600', letterSpacing: 3 },
  cadranWrapper: { position: 'relative', width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  cadranCenter: { position: 'absolute', alignItems: 'center' },
  cadranSecondes: { fontSize: 36, fontWeight: '600' },
  cadranLabel: { fontSize: 12, color: COLORS.texteMuted },
  phasesRow: { flexDirection: 'row', gap: 20 },
  phaseItem: { alignItems: 'center', gap: 4 },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseNom: { fontSize: 11, color: COLORS.texteMuted },
  phaseDuree: { fontSize: 12, fontWeight: '600' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ctrlBtn: { justifyContent: 'center', alignItems: 'center', borderRadius: 50 },
  ctrlBtnSm: { width: 44, height: 44, backgroundColor: COLORS.violetCard },
  ctrlBtnLg: { width: 60, height: 60 },
  ctrlBtnTexte: { fontSize: 18, color: COLORS.violet },
});