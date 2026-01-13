import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useAdminGuard from "../../hooks/useAdminGuard";
import { deleteAdminLaptop, fetchAdminLaptopSummary, fetchAdminLaptops } from '../../services/laptopsAdminApi';
const { width } = Dimensions.get('window');

export default function ManageLaptops({ navigation }) {
  const loading = useAdminGuard();

  const [laptops, setLaptops] = useState([]);
  const [summary, setSummary] = useState({ total_products: 0, revenue: 0 });

  const brandColors = useMemo(
    () => ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#8B5CF6'],
    []
  );

  const getBrand = (name) => {
    if (!name) return 'Laptop';
    const first = name.trim().split(' ')[0];
    return first || 'Laptop';
  };

  const getModel = (name) => {
    if (!name) return 'Unknown';
    const parts = name.trim().split(' ');
    if (parts.length <= 1) return name;
    return parts.slice(1).join(' ');
  };

  const getColorForBrand = (brand) => {
    const str = brand || 'Laptop';
    let sum = 0;
    for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
    return brandColors[sum % brandColors.length];
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || Number.isNaN(Number(price))) return 'Prix N/A';
    try {
      return `${Number(price).toLocaleString()} dh`;
    } catch {
      return `${price} dh`;
    }
  };

  const loadData = async () => {
    try {
      const [list, sum] = await Promise.all([
        fetchAdminLaptops(),
        fetchAdminLaptopSummary(),
      ]);

      setLaptops(list);
      setSummary({
        total_products: sum?.total_products ?? 0,
        revenue: sum?.revenue ?? 0,
      });
    } catch (e) {
      Alert.alert('Erreur', "Impossible de charger les laptops");
    }
  };

  useEffect(() => {
    if (!loading) loadData();
  }, [loading]);

  const handleDelete = async (laptopId) => {
    Alert.alert(
      'Confirmation',
      'Supprimer ce laptop ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAdminLaptop(laptopId);
              await loadData();
            } catch (e) {
              Alert.alert('Erreur', 'Suppression impossible');
            }
          },
        },
      ]
    );
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      {/* Header Fixe */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <Text style={styles.summaryValue}>{summary.total_products}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Revenu</Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>
              {formatPrice(summary.revenue)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Products List</Text>

        {/* Liste des Laptops */}
        {laptops.map((item) => {
          const brand = getBrand(item.name);
          const color = getColorForBrand(brand);
          return (
          <View key={item.laptop_id?.toString() || item.id?.toString()} style={styles.laptopCard}>
            <View style={[styles.brandIndicator, { backgroundColor: color }]} />
            
            <View style={styles.laptopInfo}>
              <View style={styles.infoTop}>
                <Text style={styles.laptopName}>{getModel(item.name)}</Text>
                <Text style={styles.laptopPrice}>{formatPrice(item.price)}</Text>
              </View>
              
              <View style={styles.infoBottom}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{brand}</Text>
                </View>
                <View style={styles.actionIcons}>
                  <TouchableOpacity style={styles.iconBtnSmall}>
                    <MaterialCommunityIcons name="pencil-outline" size={20} color="#94A3B8" />{/* btn: edits laptop details */}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtnSmall} onPress={() => handleDelete(item.laptop_id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />{/* btn: deletes the laptop */}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )})}

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
