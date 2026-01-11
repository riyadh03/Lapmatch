import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Données fictives pour les laptops
const LAPTOPS = [
  { id: '1', model: 'MacBook Pro M2', brand: 'Apple', stock: 12, price: '24,500 dh', status: 'En stock', color: '#6366F1' },
  { id: '2', model: 'XPS 15', brand: 'Dell', stock: 5, price: '18,900 dh', status: 'Rupture', color: '#EC4899' },
  { id: '3', model: 'ROG Zephyrus', brand: 'Asus', stock: 8, price: '21,000 dh', status: 'En stock', color: '#10B981' },
  { id: '4', model: 'ThinkPad X1', brand: 'Lenovo', stock: 15, price: '15,500 dh', status: 'En stock', color: '#F59E0B' },
];

export default function ManageLaptops() {
  return (
    <View style={styles.container}>
      {/* Header Fixe */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={28} color="#F8FAFC" />{/*btn: takes you back to admin dashboard */}
        </TouchableOpacity>
        <Text style={styles.title}>Manage Laptops</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />{/* btn: adds a new laptop */}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/*les deux premieres cartes (revenu et total prod) */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Products</Text>
            <Text style={styles.summaryValue}>40</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Revenu</Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>79 dh</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Products List</Text>

        {/* Liste des Laptops */}
        {LAPTOPS.map((item) => (
          <View key={item.id} style={styles.laptopCard}>
            <View style={[styles.brandIndicator, { backgroundColor: item.color }]} />
            
            <View style={styles.laptopInfo}>
              <View style={styles.infoTop}>
                <Text style={styles.laptopName}>{item.model}</Text>
                <Text style={styles.laptopPrice}>{item.price}</Text>
              </View>
              
              <View style={styles.infoBottom}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.brand}</Text>
                </View>
                <View style={styles.actionIcons}>
                  <TouchableOpacity style={styles.iconBtnSmall}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#94A3B8" />{/* btn: edits laptop details */}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtnSmall}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />{/* btn: deletes the laptop */}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Thème sombre identique
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
  title: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  summaryCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 5,
  },
  summaryValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  laptopCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginBottom: 15,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  brandIndicator: {
    width: 6,
    height: '100%',
  },
  laptopInfo: {
    flex: 1,
    padding: 15,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  laptopName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  laptopPrice: {
    color: '#6366F1',
    fontWeight: '700',
  },
  laptopBrand: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  infoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtnSmall: {
    padding: 5,
  }
});
