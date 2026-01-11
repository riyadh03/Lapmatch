import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import PcCard from '../components/PcCard';
//peu importe le type de recherche
//j'affiche toujours MOCK_PCS !!!!!!!!!!!!!!!!
//search type simple avancé ou par nom 
export default function ResultsScreen({ route, navigation }) {
  const { results } = route.params || {};
  const laptops = results?.data || results?.laptops || results || [];
  
  console.log("[ResultsScreen] Données reçues:", laptops?.length || 0, "laptops");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* La section d'en-tête fait partie du design de l'image mais pas du code React Native fourni. Je me concentre sur la partie liste. */}
      
      <View style={styles.listContainer}>
        <Text style={styles.headerText}>
          {laptops.length} laptop{laptops.length !== 1 ? 's' : ''} found
        </Text>

        <FlatList
          data={laptops.length > 0 ? laptops : MOCK_PCS}
          keyExtractor={(item, index) => item.id?.toString() || item.laptop_id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <PcCard
              pc={item}
              onPress={() =>
                navigation.navigate('PcDetails', { pc: item })
              }
            />
          )}
        />
      </View>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12122C', // Couleur d'arrière-plan bleu nuit foncée
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 16,
    color: '#aaa', // Couleur gris clair pour le texte du compteur
    marginBottom: 10,
    marginLeft: 10,
  },
});

const MOCK_PCS = [
  {
    id: 1,
    name: "ASUS TUF Gaming",
    price: 9500,
    image: "https://images.unsplash.com/photo-1640955014216-75201056c829?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "PC gaming performant",
    link: "https://www.asus.com/Laptops/For-Gaming/TUF-Gaming/"

  },
  {
    id: 2,
    name: "HP Pavilion",
    price: 7800,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Idéal pour études et bureautique",
    link: "https://www.asus.com/Laptops/For-Gaming/TUF-Gaming/"
  },
  {
    id: 3,
    name: "Dell Inspiron",
    price: 8200,
    image: "https://images.unsplash.com/photo-1592919933511-ea9d487c85e4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Bon pour développement",
    link: "https://www.asus.com/Laptops/For-Gaming/TUF-Gaming/"
  }
];
