import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites, Drink } from '../context/FavoriteContext';
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

export default function FavoritosScreen() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="star-outline" size={64} color="#D4AF37" />
        <Text style={styles.title}>Meus Drinks Favoritos ❤️</Text>
        <Text style={styles.subtitle}>
          Seus drinks favoritos estão aqui. Toque na estrela de qualquer drink para salvá-lo.
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          activeOpacity={0.8}
          onPress={() => router.push('/(drinks)')}
        >
          <Text style={styles.exploreButtonText}>Explorar Drinks</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Meus Drinks Favoritos ❤️</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item: Drink) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => {
          const favoritado = isFavorite(item.id);

          return (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(`/(drinks)/${item.id}`)}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.cardImage} />
              ) : (
                <View style={styles.cardImage} />
              )}

              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
              >
                <Ionicons
                  name={favoritado ? 'star' : 'star-outline'}
                  size={20}
                  color="#D4AF37"
                />
              </TouchableOpacity>

              <View style={styles.cardInfo}>
                <Text style={styles.drinkName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.drinkCategory} numberOfLines={1}>
                  {item.category || 'Coquetel Clássico'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listContainer: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: cardWidth,
    backgroundColor: '#2A2A2A',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(18, 18, 18, 0.75)',
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  cardInfo: {
    padding: 10,
  },
  drinkName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  drinkCategory: {
    fontSize: 12,
    color: '#D4AF37',
  },
});