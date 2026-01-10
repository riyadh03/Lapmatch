import { View, Text, Image, StyleSheet, Linking, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PcDetailsScreen({ route, navigation }) {
  const { pc } = route.params;
  const insets = useSafeAreaInsets();

  const specifications = [
    { id: 1, name: 'CPU', value: 'Intel Core i9-13980HX', icon: 'server-outline', type: 'Ionicons' },
    { id: 2, name: 'GPU', value: 'NVIDIA RTX 4070', icon: 'monitor', type: 'MaterialCommunity' },
    { id: 3, name: 'RAM', value: '16GB', icon: 'memory', type: 'MaterialCommunity' },
    { id: 4, name: 'Storage', value: '1TB SSD', icon: 'sd', type: 'MaterialCommunity' },
  ];

  const renderIcon = (item) => {
    if (item.type === 'Ionicons') {
      return <Ionicons name={item.icon} size={24} color="#7f8c8d" />;
    } else if (item.type === 'MaterialCommunity') {
      return <MaterialCommunityIcons name={item.icon} size={24} color="#7f8c8d" />;
    }
    return null;
  };

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" />      
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: pc.image }}
          style={styles.image}
        />

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            {/* Ajout d'un fallback textuel pour éviter l'erreur si la donnée est undefined */}
            <Text style={styles.brandText}>{pc.brand || 'Marque inconnue'}</Text> 
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={14} color="#f1c40f" />
              {/* Ajout d'un fallback textuel pour éviter l'erreur si la donnée est undefined */}
              <Text style={styles.ratingText}>{pc.rating || 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.nameText}>
            {pc.name}
          </Text>
          
          <Text style={styles.priceText}>
            {pc.price.toLocaleString()} dh
          </Text>

          {/* Section Spécifications */}
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsContainer}>
            {specifications.map((item) => (
              <View key={item.id} style={styles.specCard}>
                <View style={styles.specIcon}>
                    {renderIcon(item)}
                </View>
                <View>
                    <Text style={styles.specName}>{item.name}</Text>
                    <Text style={styles.specValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Le bouton d'achat de l'image est plus stylisé qu'un simple <Button> */}
          <TouchableOpacity style={styles.buyButton} onPress={() => Linking.openURL(pc.link)} >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
            <MaterialCommunityIcons 
               name="arrow-top-right"  // Icône qui indique un lien externe
               size={16} 
               color="#fff" 
              style={{ marginLeft: 5 }} // un petit espace entre le texte et l'icône
            />
          </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F1424', // Fond principal bleu nuit
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 60, // Standard header height
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#ecf0f1',
    marginLeft: 5,
    fontSize: 16,
  },
  headerTitle: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250, // Hauteur d'image adaptée au design
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    color: '#7f8c8d', // Gris pour la marque
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e273b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingText: {
    marginLeft: 5,
    color: '#ecf0f1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 15,
  },
  priceText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2ecc71', // Vert vif pour le prix
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 15,
  },
  specsContainer: {
    marginBottom: 30,
  },
  specCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161d2d', // Fond des cartes de spécifications
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  specIcon: {
    marginRight: 15,
  },
  specName: {
    color: '#7f8c8d',
    fontSize: 12,
  },
  specValue: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: '600',
  },
  buyButton: {
    backgroundColor: '#3498db', // Un bleu clair pour le bouton d'action
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
