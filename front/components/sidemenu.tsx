import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';

const LARGEUR = Dimensions.get('window').width * 0.75;

type Props = { visible: boolean; onClose: () => void; };

export default function SideMenu({ visible, onClose }: Props) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const naviguer = (route: string) => { onClose(); router.push(route as any); };
  const handleLogout = async () => { onClose(); await logout(); router.replace('/home' as any); };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback  accessibilityRole="button">
            <View style={styles.drawer}>
              <View style={styles.header}>
                {user ? (
                  <>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarTexte}>{user.name?.[0]}{user.surname?.[0]}</Text>
                    </View>
                    <Text style={styles.userName}>{user.name} {user.surname}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    {user.state === 'admin' && (
                      <View style={styles.adminBadge}><Text style={styles.adminBadgeTexte}>Admin</Text></View>
                    )}
                  </>
                ) : (
                  <>
                    <View style={styles.avatarGuest}><Text style={{ fontSize: 28 }}>👤</Text></View>
                    <Text style={styles.userName}>Invite</Text>
                    <Text style={styles.userEmail}>Non connecte</Text>
                  </>
                )}
              </View>

              <View style={styles.sep} />

              {[
                { route: '/home', icon: '🏠', label: 'Accueil' },
                { route: '/informations', icon: '📖', label: 'Informations' },
                { route: '/respiration', icon: '🌬️', label: 'Respiration' },
              ].map(item => (
                <TouchableOpacity key={item.route} style={styles.item} onPress={() => naviguer(item.route)} accessibilityRole="button">
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <Text style={styles.itemTexte}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              {user && (
                <TouchableOpacity style={styles.item} onPress={() => naviguer('/profil')} accessibilityRole="button">
                  <Text style={styles.itemIcon}>👤</Text>
                  <Text style={styles.itemTexte}>Mon profil</Text>
                </TouchableOpacity>
              )}

              {user?.state === 'admin' && (
                <TouchableOpacity style={styles.itemAdmin} onPress={() => naviguer('/admin')} accessibilityRole="button">
                  <Text style={styles.itemIcon}>⚙️</Text>
                  <Text style={styles.itemTexteAdmin}>Administration</Text>
                </TouchableOpacity>
              )}

              <View style={styles.sep} />

              {!user ? (
                <>
                  <TouchableOpacity 
                    style={styles.btnConnexion} 
                    onPress={() => naviguer('/login')}
                    accessibilityRole="button">
                    <Text style={styles.btnConnexionTexte}>Se connecter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnInscription} onPress={() => naviguer('/register')} accessibilityRole="button">
                    <Text style={styles.btnInscriptionTexte}>Inscription</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.btnDeconnexion} onPress={handleLogout} accessibilityRole="button">
                  <Text style={styles.btnDeconnexionTexte}>Se deconnecter</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(61,53,102,0.4)', flexDirection: 'row' },
  drawer: { width: LARGEUR, backgroundColor: COLORS.blanc, paddingTop: 60, paddingBottom: 40, elevation: 10 },
  header: { paddingHorizontal: 24, paddingBottom: 24, alignItems: 'flex-start' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.violet, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarTexte: { color: COLORS.blanc, fontSize: 22, fontWeight: '600' },
  avatarGuest: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.violetBg, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  userName: { fontSize: 17, fontWeight: '600', color: COLORS.titreDark },
  userEmail: { fontSize: 13, color: COLORS.texteMuted, marginTop: 2 },
  adminBadge: { marginTop: 6, backgroundColor: COLORS.violet, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  adminBadgeTexte: { color: COLORS.blanc, fontSize: 11, fontWeight: '600' },
  sep: { height: 1, backgroundColor: COLORS.violetBorder, marginVertical: 10, marginHorizontal: 24 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 24 },
  itemAdmin: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 24, backgroundColor: COLORS.violetBg },
  itemIcon: { fontSize: 18, marginRight: 14 },
  itemTexte: { fontSize: 15, color: COLORS.titreDark },
  itemTexteAdmin: { fontSize: 15, color: COLORS.violet, fontWeight: '600' },
  btnConnexion: { marginHorizontal: 24, marginTop: 8, backgroundColor: COLORS.violet, padding: 13, borderRadius: 12, alignItems: 'center' },
  btnConnexionTexte: { color: COLORS.blanc, fontWeight: '600', fontSize: 14 },
  btnInscription: { marginHorizontal: 24, marginTop: 8, borderWidth: 1.5, borderColor: COLORS.violet, padding: 12, borderRadius: 12, alignItems: 'center' },
  btnInscriptionTexte: { color: COLORS.violet, fontWeight: '600', fontSize: 14 },
  btnDeconnexion: { marginHorizontal: 24, marginTop: 8, borderWidth: 1.5, borderColor: '#e74c3c', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnDeconnexionTexte: { color: '#e74c3c', fontWeight: '600', fontSize: 14 },
});