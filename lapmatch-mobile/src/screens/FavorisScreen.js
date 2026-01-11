import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import PcCard from '../components/PcCard';

export default function FavorisScreen({ route, navigation }) {

    const { searchData = null } = route?.params || {}; 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.listContainer}>
        <Text style={styles.headerText}>
          {MOCK_PCS.length} laptops found
        </Text>

        <FlatList
          data={MOCK_PCS}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <PcCard
              pc={item}
              onPress={() => navigation.navigate('PcDetails', { pc: item })}
              style={{ marginTop: index === 0 ? 0 : 15 }} 
              isFavoriteInitial={true} // <-- ici on indique que c'est un favori pour que le coeur soit rempli!!!

            />
          )}//when clicking on a PcCard, navigate to PcDetails screen with the selected pc as parameter
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12122C',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerText: {
    fontSize: 16,
    color: '#aaa',
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
