import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Données d'exemple - seulement User et Admin
const usersData = [
  { 
    id: '1', 
    name: 'Ahmed Benali', 
    email: 'ahmed@example.com', 
    role: 'Admin', 
    joinDate: '15/03/2023',
    totalSpent: '45,600 dh'
  },
  { 
    id: '2', 
    name: 'Fatima Zahra', 
    email: 'fatima.z@example.com', 
    role: 'User', 
    joinDate: '22/06/2023',
    totalSpent: '28,900 dh'
  },
  { 
    id: '3', 
    name: 'Karim Idrissi', 
    email: 'karim.i@example.com', 
    role: 'User', 
    joinDate: '10/01/2024',
    totalSpent: '0 dh'
  },
  { 
    id: '4', 
    name: 'Sara Mekki', 
    email: 'sara.m@example.com', 
    role: 'User', 
    joinDate: '05/11/2023',
    totalSpent: '15,300 dh'
  },
  { 
    id: '5', 
    name: 'Youssef Alaoui', 
    email: 'youssef.a@example.com', 
    role: 'Admin', 
    joinDate: '18/09/2023',
    totalSpent: '67,800 dh'
  },
  { 
    id: '6', 
    name: 'Lina Chraibi', 
    email: 'lina.c@example.com', 
    role: 'User', 
    joinDate: '30/04/2024',
    totalSpent: '9,200 dh'
  },
  { 
    id: '7', 
    name: 'Omar Bennani', 
    email: 'omar.b@example.com', 
    role: 'User', 
    joinDate: '12/12/2023',
    totalSpent: '5,700 dh'
  },
  { 
    id: '8', 
    name: 'Nadia El Fassi', 
    email: 'nadia.ef@example.com', 
    role: 'User', 
    joinDate: '08/02/2024',
    totalSpent: '31,500 dh'
  },
];

export default function ManageUsers() {
  const [searchText, setSearchText] = useState('');

  const filteredUsers = usersData.filter(user => {
    return user.name.toLowerCase().includes(searchText.toLowerCase()) ||
           user.email.toLowerCase().includes(searchText.toLowerCase());
  });

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return '#4285F4'; // Bleu Google pour Admin
      case 'User': return '#10B981';  // Vert pour User (inchangé)
      default: return '#94A3B8';
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
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
            <Text style={styles.joinDate}>Joined: {item.joinDate}</Text>
          </View>
        </View>
      </View>
      
      {/* Stats simplifiées - seulement Total Spent */}
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="cash" size={18} color="#94A3B8" />
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>{item.totalSpent}</Text>
        </View>
      </View>
      
      {/* Actions simplifiées - seulement Change Role (gris) et Delete */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.roleToggleBtn}>
          <Ionicons name="swap-vertical" size={18} color="#94A3B8" />
          <Text style={styles.roleToggleText}>Change Role</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Users</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#6366F115' }]}>
            <Ionicons name="people-outline" size={22} color="#6366F1" />
          </View>
          <Text style={styles.statNumber}>{usersData.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#10B98115' }]}>
            <Ionicons name="person-outline" size={22} color="#10B981" />
          </View>
          <Text style={styles.statNumber}>
            {usersData.filter(u => u.role === 'User').length}
          </Text>
          <Text style={styles.statLabel}>Regular Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: '#4285F415' }]}>
            <Ionicons name="shield-outline" size={22} color="#4285F4" />
          </View>
          <Text style={styles.statNumber}>
            {usersData.filter(u => u.role === 'Admin').length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      {/* Search Bar */}
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

      {/* Users List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'} Found
        </Text>
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

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
  backButton: {
    padding: 4,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6366F1', // Violet
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
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
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
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
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginLeft: 12,
    marginRight: 8,
  },
  listHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  listTitle: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 30,
  },
  userCard: {
    backgroundColor: '#162032',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6365f120', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#6366F1', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  joinDate: {
    color: '#64748B',
    fontSize: 12,
  },
  userStats: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
    paddingTop: 16,
  },
  roleToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#334155', // Gris
    borderRadius: 10,
    gap: 8,
  },
  roleToggleText: {
    color: '#94A3B8', // Texte gris
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#EF444415',
    borderRadius: 10,
    gap: 8,
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});