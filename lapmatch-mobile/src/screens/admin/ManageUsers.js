import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  FlatList,
  Alert,
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminGuard from "../../hooks/useAdminGuard";
import {
  fetchAdminUsers,
  createAdminUser,
  deleteUser,
} from "../../services/adminApi";

const { width } = Dimensions.get('window');
// Données d'exemple - seulement User et Admin
// const usersData = [
//   { 
//     id: '1', 
//     name: 'Ahmed Benali', 
//     email: 'ahmed@example.com', 
//     role: 'Admin', 
//     joinDate: '15/03/2023',
//     totalSpent: '45,600 dh'
//   },
//   { 
//     id: '2', 
//     name: 'Fatima Zahra', 
//     email: 'fatima.z@example.com', 
//     role: 'User', 
//     joinDate: '22/06/2023',
//     totalSpent: '28,900 dh'
//   },
//   { 
//     id: '3', 
//     name: 'Karim Idrissi', 
//     email: 'karim.i@example.com', 
//     role: 'User', 
//     joinDate: '10/01/2024',
//     totalSpent: '0 dh'
//   },
//   { 
//     id: '4', 
//     name: 'Sara Mekki', 
//     email: 'sara.m@example.com', 
//     role: 'User', 
//     joinDate: '05/11/2023',
//     totalSpent: '15,300 dh'
//   },
//   { 
//     id: '5', 
//     name: 'Youssef Alaoui', 
//     email: 'youssef.a@example.com', 
//     role: 'Admin', 
//     joinDate: '18/09/2023',
//     totalSpent: '67,800 dh'
//   },
//   { 
//     id: '6', 
//     name: 'Lina Chraibi', 
//     email: 'lina.c@example.com', 
//     role: 'User', 
//     joinDate: '30/04/2024',
//     totalSpent: '9,200 dh'
//   },
//   { 
//     id: '7', 
//     name: 'Omar Bennani', 
//     email: 'omar.b@example.com', 
//     role: 'User', 
//     joinDate: '12/12/2023',
//     totalSpent: '5,700 dh'
//   },
//   { 
//     id: '8', 
//     name: 'Nadia El Fassi', 
//     email: 'nadia.ef@example.com', 
//     role: 'User', 
//     joinDate: '08/02/2024',
//     totalSpent: '31,500 dh'
//   },
// ];


export default function ManageUsers({ navigation }) {
  const loading = useAdminGuard();

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [createAdminVisible, setCreateAdminVisible] = useState(false);
  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminFullName, setNewAdminFullName] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setRefreshing(true);
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (e) {
      Alert.alert("Erreur", "Impossible de charger les utilisateurs");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return null;

  const filteredUsers = users.filter(user => {
    return user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
           user.email?.toLowerCase().includes(searchText.toLowerCase());
  });

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return '#4285F4';
      case 'User': return '#10B981';
      default: return '#94A3B8';
    }
  };

  const openCreateAdmin = () => {
    setNewAdminUid('');
    setNewAdminEmail('');
    setNewAdminFullName('');
    setCreateAdminVisible(true);
  };

  const closeCreateAdmin = () => {
    if (creatingAdmin) return;
    setCreateAdminVisible(false);
  };

  const handleCreateAdmin = async () => {
    const uid = newAdminUid.trim();
    const email = newAdminEmail.trim();
    const full_name = newAdminFullName.trim();

    if (!uid) {
      Alert.alert('Erreur', 'UID Firebase obligatoire');
      return;
    }
    if (!email) {
      Alert.alert('Erreur', 'Email obligatoire');
      return;
    }

    try {
      setCreatingAdmin(true);
      await createAdminUser({ uid, email, full_name: full_name || undefined });
      setCreateAdminVisible(false);
      await loadUsers();
    } catch (e) {
      Alert.alert('Erreur', "Impossible de créer l'admin");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleDeleteUser = async (uid) => {
    Alert.alert(
      "Confirmation",
      "Supprimer cet utilisateur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUser(uid);
              loadUsers();
            } catch {
              Alert.alert("Erreur", "Suppression impossible");
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name?.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
              <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
                {item.role}
              </Text>
            </View>
          </View>
          
          <Text style={styles.userEmail}>{item.email}</Text>
          
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.joinDate}>Joined: {item.joinDate || 'N/A'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="cash" size={18} color="#94A3B8" />
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>{item.totalSpent || 0}</Text>
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteUser(item.uid)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Users</Text>
        <TouchableOpacity style={styles.addButton} onPress={openCreateAdmin}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={createAdminVisible}
        transparent
        animationType="fade"
        onRequestClose={closeCreateAdmin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Admin</Text>
              <TouchableOpacity onPress={closeCreateAdmin} disabled={creatingAdmin}>
                <Ionicons name="close" size={22} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Firebase UID</Text>
            <TextInput
              style={styles.modalInput}
              value={newAdminUid}
              onChangeText={setNewAdminUid}
              placeholder="ex: GqBlZmmDG2Mo0SOGOk5PLiTwXFk1"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
            />

            <Text style={styles.modalLabel}>Email</Text>
            <TextInput
              style={styles.modalInput}
              value={newAdminEmail}
              onChangeText={setNewAdminEmail}
              placeholder="ex: admin@lapmatch.com"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.modalLabel}>Full name (optionnel)</Text>
            <TextInput
              style={styles.modalInput}
              value={newAdminFullName}
              onChangeText={setNewAdminFullName}
              placeholder="ex: Admin LapMatch"
              placeholderTextColor="#64748B"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={closeCreateAdmin}
                disabled={creatingAdmin}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCreateBtn}
                onPress={handleCreateAdmin}
                disabled={creatingAdmin}
              >
                <Text style={styles.modalCreateText}>
                  {creatingAdmin ? 'Creating...' : 'Create Admin'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#6366F115' }]}>
            <Ionicons name="people-outline" size={22} color="#6366F1" />
          </View>
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#10B98115' }]}>
            <Ionicons name="person-outline" size={22} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>
            {users.filter(u => u.role === 'User').length}
          </Text>
          <Text style={styles.statLabel}>Regular Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4285F415' }]}>
            <Ionicons name="shield-outline" size={22} color="#4285F4" />
          </View>
          <Text style={styles.statNumber}>
            {users.filter(u => u.role === 'Admin').length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            placeholderTextColor="#64748B"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} Found
        </Text>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.uid}
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={loadUsers}
      />
    </View>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  backButton: { padding: 4 },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 25 },
  statCard: {
    flex: 1,
    backgroundColor: '#162032',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statNumber: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '500' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162032',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 14, marginLeft: 12, marginRight: 8 },
  listHeader: { paddingHorizontal: 20, marginBottom: 15 },
  listTitle: { color: '#CBD5E1', fontSize: 14, fontWeight: '600' },
  listContainer: { flex: 1, paddingHorizontal: 20, marginBottom: 20 },
  listContent: { paddingBottom: 30 },
  userCard: { backgroundColor: '#162032', borderRadius: 16, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: '#2D3748', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  userHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#6365f120', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#6366F1', fontSize: 18, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  userName: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  roleText: { fontSize: 12, fontWeight: '600' },
  userEmail: { color: '#94A3B8', fontSize: 13, marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  joinDate: { color: '#64748B', fontSize: 12 },
  userStats: { backgroundColor: '#1E293B', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center' },
  statItem: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#2D3748', paddingTop: 16 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#EF444415', borderRadius: 10, gap: 8 },
  deleteBtnText: { color: '#EF4444', fontSize: 14, fontWeight: '600' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '800' },
  modalLabel: { color: '#CBD5E1', fontSize: 12, fontWeight: '600', marginTop: 10, marginBottom: 6 },
  modalInput: {
    backgroundColor: '#162032',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  modalCancelText: { color: '#CBD5E1', fontSize: 14, fontWeight: '700' },
  modalCreateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  modalCreateText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
