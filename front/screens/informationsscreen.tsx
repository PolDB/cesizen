import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ActivityIndicator, Platform, Modal, TextInput, Alert, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const API_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.1.12:8000';

type Article = {
  content_id: number;
  Title: string;
  Description: string;
  Type: string;
  Is_activate: boolean;
};

export default function InformationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.state === 'admin';

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [articleOuvert, setArticleOuvert] = useState<Article | null>(null);
  const [typeActif, setTypeActif] = useState('Tous');
  const [editModal, setEditModal] = useState<Article | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => { chargerArticles(); }, []);

  const chargerArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/informations/`);
      const data = await response.json();
      setArticles(data);
    } catch {
      setErreur('Impossible de charger les informations.');
    } finally {
      setLoading(false);
    }
  };

  const ouvrirEdit = (article: Article) => {
    setEditTitle(article.Title);
    setEditDescription(article.Description);
    setEditModal(article);
  };

  const sauvegarderEdit = async () => {
    if (!editModal) return;
    try {
      const response = await fetch(`${API_URL}/informations/${editModal.content_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (!response.ok) throw new Error();
      setEditModal(null);
      setArticleOuvert(null);
      chargerArticles();
      Alert.alert('Succes', 'Contenu mis a jour.');
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier le contenu.');
    }
  };

  const types = ['Tous', ...Array.from(new Set(articles.map(a => a.Type)))];
  const articlesFiltres = typeActif === 'Tous' ? articles : articles.filter(a => a.Type === typeActif);

  // Vue détail article
  if (articleOuvert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setArticleOuvert(null)} style={styles.retourTexte} accessibilityLabel="Retour" accessibilityRole="button">
            <Text style={styles.retourTexte}>←</Text>
          </TouchableOpacity>
          <Text style={styles.logoText}>CESIZEN</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView contentContainerStyle={styles.articleContainer}>
          <View style={styles.articleHeaderRow}>
            <View style={styles.badgeCategorie}>
              <Text style={styles.badgeCategorieTexte}>{articleOuvert.Type}</Text>
            </View>
            {isAdmin && (
              <TouchableOpacity style={styles.btnEdit} onPress={() => ouvrirEdit(articleOuvert)} accessibilityLabel="Modifier le contenu" accessibilityRole="button">
                <Text style={styles.btnEditTexte}>✏️ Modifier</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.articleTitre}>{articleOuvert.Title}</Text>
          <Text style={styles.articleContenu}>{articleOuvert.Description}</Text>
        </ScrollView>

        {/* Modal edition */}
        <Modal visible={!!editModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitre}>Modifier le contenu</Text>
              <TextInput
                style={styles.inputEdit}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Titre"
              />
              <TextInput
                style={[styles.inputEdit, styles.inputEditMulti]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="Contenu"
                multiline
                numberOfLines={6}
              />
              <View style={styles.modalBoutons}>
                <TouchableOpacity style={styles.btnAnnuler} onPress={() => setEditModal(null)} accessibilityLabel="Annuler" accessibilityRole="button">
                  <Text style={styles.btnAnnulerTexte}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSauvegarder} onPress={sauvegarderEdit} accessibilityLabel="Sauvegarder" accessibilityRole="button">
                  <Text style={styles.btnSauvegarderTexte}>Sauvegarder</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/home' as any)} style={styles.retourTexte}>
          <Text style={styles.retourTexte}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>CESIZEN</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titrePage}>Informations</Text>
        <Text style={styles.sousTitre}>Sante mentale et bien-etre</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
        ) : erreur ? (
          <Text style={styles.erreur}>{erreur}</Text>
        ) : articles.length === 0 ? (
          <Text style={styles.vide}>Aucun article disponible.</Text>
        ) : (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              style={styles.filtresContainer} contentContainerStyle={styles.filtresContent}>
              {types.map(type => (
                <TouchableOpacity key={type}
                  style={[styles.filtre, typeActif === type && styles.filtreActif]}
                  onPress={() => setTypeActif(type)}>
                  <Text style={[styles.filtreTexte, typeActif === type && styles.filtreTexteActif]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {articlesFiltres.map(article => (
              <TouchableOpacity key={article.content_id} style={styles.carteArticle}
                onPress={() => setArticleOuvert(article)} activeOpacity={0.85}>
                <View style={styles.carteHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeTexte}>{article.Type}</Text>
                  </View>
                  {isAdmin && (
                    <TouchableOpacity style={styles.stylo} onPress={() => ouvrirEdit(article)} accessibilityLabel="Modifier le contenu" accessibilityRole="button">
                      <Text style={styles.styloTexte}>✏️</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.carteTitre}>{article.Title}</Text>
                <Text style={styles.carteExtrait} numberOfLines={2}>{article.Description}</Text>
                <Text style={styles.carteLire}>Lire les articles →</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Modal edition depuis liste */}
      <Modal visible={!!editModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitre}>Modifier le contenu</Text>
            <TextInput style={styles.inputEdit} value={editTitle}
              onChangeText={setEditTitle} placeholder="Titre" />
            <TextInput style={[styles.inputEdit, styles.inputEditMulti]}
              value={editDescription} onChangeText={setEditDescription}
              placeholder="Contenu" multiline numberOfLines={6} />
            <View style={styles.modalBoutons}>
              <TouchableOpacity style={styles.btnAnnuler} onPress={() => setEditModal(null)} accessibilityLabel="Annuler" accessibilityRole="button">
                <Text style={styles.btnAnnulerTexte}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSauvegarder} onPress={sauvegarderEdit} accessibilityLabel="Sauvegarder" accessibilityRole="button">
                <Text style={styles.btnSauvegarderTexte}>Sauvegarder</Text>
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
  header: {
  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: (StatusBar.currentHeight || 0) + 12,
  paddingBottom: 14,
  borderBottomWidth: 1, borderBottomColor: COLORS.violetBorder,
},
  retourTexte: { fontSize: 40, color: COLORS.violet, padding: 1 },
  logoText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 3, color: '#333' },
  placeholder: { width: 36 },
  scroll: { padding: 20 },
  titrePage: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  sousTitre: { fontSize: 15, color: '#888', marginBottom: 20 },
  erreur: { color: '#e74c3c', textAlign: 'center', marginTop: 40 },
  vide: { color: '#aaa', textAlign: 'center', marginTop: 40 },
  filtresContainer: { marginBottom: 20 },
  filtresContent: { gap: 8, paddingRight: 20 },
  filtre: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: '#ddd', backgroundColor: '#fff' },
  filtreActif: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  filtreTexte: { fontSize: 13, color: '#555' },
  filtreTexteActif: { color: '#fff', fontWeight: '600' },
  carteArticle: { backgroundColor: '#F7FAFF', borderRadius: 14, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: '#E8F0FE' },
  carteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E8F0FE',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTexte: { fontSize: 11, color: '#4A90E2', fontWeight: '600' },
  stylo: { padding: 4 },
  styloTexte: { fontSize: 18 },
  carteTitre: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  carteExtrait: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 10 },
  carteLire: { fontSize: 13, color: '#4A90E2', fontWeight: '600' },
  articleContainer: { padding: 24 },
  articleHeaderRow: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 14 },
  badgeCategorie: { alignSelf: 'flex-start', backgroundColor: '#E8F0FE',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeCategorieTexte: { fontSize: 12, color: '#4A90E2', fontWeight: '600' },
  btnEdit: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EBF3FB',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  btnEditTexte: { fontSize: 13, color: '#4A90E2', fontWeight: '600' },
  articleTitre: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  articleContenu: { fontSize: 16, color: '#444', lineHeight: 26 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24,
    width: '100%', maxWidth: 400 },
  modalTitre: { fontSize: 17, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  inputEdit: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8,
    padding: 12, fontSize: 15, marginBottom: 12 },
  inputEditMulti: { height: 120, textAlignVertical: 'top' },
  modalBoutons: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnAnnuler: { flex: 1, borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 13, alignItems: 'center' },
  btnAnnulerTexte: { color: '#888', fontWeight: '600' },
  btnSauvegarder: { flex: 1, backgroundColor: '#4A90E2',
    borderRadius: 8, padding: 13, alignItems: 'center' },
  btnSauvegarderTexte: { color: '#fff', fontWeight: '600' },
});