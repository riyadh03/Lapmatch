import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // On utilise Ionicons pour toutes les icônes



// --- Composant SearchCard Intégré ---
const SearchCard = ({ title, description, badgeText, onPress, iconName, badgeColor, iconColor }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        {/* Icône dans la carte */}
        <View style={[styles.iconContainer, { backgroundColor: iconColor || '#6200EE' }]}>
          <Ionicons name={iconName} size={24} color="#FFF" />
        </View>
        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeColor || '#2ecc71' }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );
};


export default function HomeScreen({ navigation }) {
  const [pcList, setPcList] = useState([]);
  useEffect(() => {
    const auth = getAuth();
    if (!auth.currentUser) {
      navigation.replace("Login");
    }
  }, []);
  return (
    <ScrollView style={styles.container}>
      {/* 🔍 Icône loupe en haut à droite */}
      

      <Text style={styles.mainTitle}>How do you want to search?</Text>
      <Text style={styles.subtitle}>Choose based on your technical knowledge</Text>

      <View style={styles.cardsContainer}>
        {/* ✅ Simple Search avec icône de PC */}
        <SearchCard 
          title="Simple Search"
          description="Answer a few easy questions about your needs and budget. Perfect for beginners."
          badgeText="Recommended"
          badgeColor="#2ecc71"
          iconColor="#2ecc71"
          iconName="sparkles" // Icône simple
          onPress={() => navigation.navigate('SimpleSearch')}
        />

        {/* ✅ Advanced Search avec icône settings */}
        <SearchCard
          title="Advanced Search"
          description="Specify exact technical requirements like CPU, GPU, RAM, and more."
          badgeText="For Experts"
          badgeColor="#4285F4"
          iconColor="#4285F4"
          iconName="settings" // Icône settings
          onPress={() => navigation.navigate('AdvancedSearch')}
        />
        <SearchCard
          title="Laptop comparison"
          description="Compare multiple laptops side by side to find the best deal."
          badgeText="Hot"
          badgeColor="#7C4DFF"
          iconColor="#7C4DFF"
          iconName="laptop" 
          onPress={() => navigation.navigate('PcComparison')}
        />
        <SearchCard
          title="Search by name"
          description="Find laptops by their model names or brands quickly."
          badgeText="new"
          badgeColor="#ff8307"
          iconColor="#ff8307"
          iconName="search" 
          onPress={() => navigation.navigate('SearchByName')}//fix it
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#12122C',
  },

  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40,
    marginBottom: 5,
  },
  subtitle: {
    color: '#A0A0BC',
    marginBottom: 40,
  },
  cardsContainer: {},
  card: {
    backgroundColor: '#1E1E3F',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A4A6A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardDescription: {
    color: '#A0A0BC',
    fontSize: 14,
  },
  scrollContent: {
  paddingBottom: 40, // espace en bas pour bien scroller
},
});
