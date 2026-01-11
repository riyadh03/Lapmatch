// // import React from 'react';
// // import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// // import { AntDesign } from '@expo/vector-icons'; // Assuming you have expo vector icons installed

// // const PcCard = ({ pc, onPress }) => {
// //   return (
// //     <TouchableOpacity style={styles.card} onPress={onPress}>
// //       <Image source={{ uri: pc.image }} style={styles.image} resizeMode="cover" />
// //       <View style={styles.infoContainer}>
// //         <View style={styles.headerRow}>
// //           <Text style={styles.brandText}>{pc.brand}</Text>
// //           <View style={styles.ratingContainer}>
// //             <AntDesign name="star" size={14} color="#f1c40f" />
// //             <Text style={styles.ratingText}>{pc.rating}</Text>
// //           </View>
// //         </View>
// //         <Text style={styles.nameText}>{pc.name}</Text>
// //         <View style={styles.footerRow}>
// //             {/* Displaying price with a dollar sign as in the image mock */}
// //             <Text style={styles.priceText}>{pc.price.toLocaleString()} dh</Text>
// //             <View style={styles.viewButton}>
// //                 <Text style={styles.viewText}>View →</Text>
// //             </View>
// //         </View>
// //       </View>
// //     </TouchableOpacity>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   card: {
// //     marginBottom: 20,
// //     borderRadius: 15,
// //     overflow: 'hidden',
// //     backgroundColor: '#353a7c', // The dark blue background of the cards
// //     elevation: 5,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.25,
// //     shadowRadius: 3.84,
// //   },
// //   image: {
// //     width: '100%',
// //     height: 150, // Image height within the card
// //   },
// //   infoContainer: {
// //     padding: 15,
// //   },
// //   headerRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   brandText: {
// //     color: '#7f8c8d', // Greyish text for brand name
// //     fontSize: 14,
// //     fontWeight: '500',
// //   },
// //   ratingContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1e273b', // Background for rating badge
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   ratingText: {
// //     marginLeft: 4,
// //     color: '#ecf0f1',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   nameText: {
// //     color: '#ecf0f1', // White/Off-white for the main laptop name
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 15,
// //   },
// //   footerRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   priceText: {
// //     color: '#2ecc71', // Green color for the price
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //   },
// //   viewButton: {
// //     // The "View →" text itself acts like a button link in the image
// //   },
// //   viewText: {
// //     color: '#7f8c8d', // Grey color for the view link
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default PcCard;
// import React, { useState } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import { AntDesign } from '@expo/vector-icons';

// const PcCard = ({ pc, onPress }) => {
//   // État local pour le favori
//   const [isFavorite, setIsFavorite] = useState(false);

//   // Fonction pour basculer le favori
//   const toggleFavorite = () => {
//     setIsFavorite(!isFavorite);
//   };

//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress}>
//       <Image source={{ uri: pc.image }} style={styles.image} resizeMode="cover" />
//       <View style={styles.infoContainer}>
//         <View style={styles.headerRow}>
//           <Text style={styles.brandText}>{pc.brand}</Text>
//           <View style={styles.ratingContainer}>
//             <AntDesign name="star" size={14} color="#f1c40f" />
//                   {/* Bouton favoris */}
//       <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
//         <AntDesign
//           name={isFavorite ? "heart" : "hearto"} // plein ou vide selon l'état
//           size={24}
//           color={isFavorite ? "red" : "white"}
//         />
//       </TouchableOpacity>
//             <Text style={styles.ratingText}>{pc.rating}</Text>
//           </View>
//         </View>
//         <Text style={styles.nameText}>{pc.name}</Text>
//         <View style={styles.footerRow}>
//           <Text style={styles.priceText}>{pc.price.toLocaleString()} dh</Text>
//           <View style={styles.viewButton}>
//             <Text style={styles.viewText}>View →</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     marginBottom: 20,
//     borderRadius: 15,
//     overflow: 'hidden',
//     backgroundColor: '#353a7c',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   image: {
//     width: '100%',
//     height: 150,
//   },
//   favoriteIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 10,
//   },
//   infoContainer: {
//     padding: 15,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   brandText: {
//     color: '#7f8c8d',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1e273b',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   ratingText: {
//     marginLeft: 4,
//     color: '#ecf0f1',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   nameText: {
//     color: '#ecf0f1',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//   },
//   footerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   priceText: {
//     color: '#2ecc71',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   viewButton: {},
//   viewText: {
//     color: '#7f8c8d',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   card: {
//     marginBottom: 20,
//     borderRadius: 15,
//     overflow: 'hidden',
//     backgroundColor: '#353a7c',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     position: 'relative', // <-- Ajouté
//   },
//   image: {
//     width: '100%',
//     height: 150,
//   },
//   favoriteIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 10,
//   }
// });

// export default PcCard;

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';



const PcCard = ({ pc, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: pc.image }} style={styles.image} resizeMode="cover" />
            <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "red" : "white"}
        />

      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.brandText}>{pc.brand}</Text>
          <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#f1c40f" />
          <Text style={styles.ratingText}>{pc.rating}</Text>
        </View>
      </View>
        <Text style={styles.nameText}>{pc.name}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.priceText}>{pc.price.toLocaleString()} dh</Text>
          <View style={styles.viewButton}>
            <Text style={styles.viewText}>View →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#353a7c',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative', // Assure que l'icône absolue se positionne par rapport à la carte
  },
  image: {
    width: '100%',
    height: 150,
  },
  favoriteIcon: { // Style pour positionner l'icône en haut à droite de l'image/carte
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, // S'assure que l'icône est au-dessus des autres éléments
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optionnel: un fond semi-transparent pour la visibilité
    borderRadius: 15,
    padding: 5,
  },
  infoContainer: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e273b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: '#ecf0f1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  nameText: {
    color: '#ecf0f1',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    color: '#2ecc71',
    fontSize: 22,
    fontWeight: 'bold',
  },
  viewButton: {},
  viewText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PcCard;

