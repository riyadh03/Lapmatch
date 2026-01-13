import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminGuard from "../../hooks/useAdminGuard";
const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const loading = useAdminGuard();

  if (loading) return null;
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* Header avec un look plus aéré */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Admin</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={42} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards avec icônes colorées */}
      <View style={styles.cardsContainer}>
        {[
          { label: 'Users', val: '120', icon: 'account-group', color: '#6366F1' },
          { label: 'Orders', val: '75', icon: 'cart', color: '#10B981' },
          { label: 'Revenue', val: '3,450 dh', icon: 'cash', color: '#F59E0B' },
          { label: 'Laptops', val: '48', icon: 'laptop', color: '#EC4899' },
        ].map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
              <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
            </View>
            <Text style={styles.cardNumber}>{item.val}</Text>
            <Text style={styles.cardTitle}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Action Section simplifiée */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: '#6366F1' }]}>
              <Ionicons name="cube-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.actionText}>Manage laptops</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: '#8B5CF6' }]}>
              <Ionicons name="people-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.actionText}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: '#334155' }]}>
              <Ionicons name="settings-outline" size={26} color="#fff" />
            </View>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileContainer: {
    padding: 2,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    width: '47%',
    backgroundColor: '#162032', // Changement: couleur plus douce et harmonieuse
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3748', // Bordure légèrement plus claire
    // Effet de brillance subtil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#CBD5E1', // Texte légèrement plus clair
    fontSize: 13,
    fontWeight: '500',
  },
  cardNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  actionsContainer: {
    marginTop: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#162032', // Même couleur que les cartes pour cohérence
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
    // Même effet d'ombre que les cartes
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});