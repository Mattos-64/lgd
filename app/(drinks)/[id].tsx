import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../context/FavoriteContext';

interface DrinkDetail {
  id: string;
  name: string;
  category: string;
  alcoholic: string;
  image: string;
  instructions: string;
  ingredients: string[];
}

export default function DrinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [drink, setDrink] = useState<DrinkDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!id) return;

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.drinks && data.drinks.length > 0) {
          const item = data.drinks[0];
          
          const extractedIngredients: string[] = [];
          for (let i = 1; i <= 15; i++) {
            const ingredient = item[`strIngredient${i}`];
            const measure = item[`strMeasure${i}`];
            if (ingredient) {
              extractedIngredients.push(`${measure ? measure.trim() + ' de ' : ''}${ingredient.trim()}`);
            }
          }

          setDrink({
            id: item.idDrink,
            name: item.strDrink,
            category: item.strCategory || 'Coquetel',
            alcoholic: item.strAlcoholic || 'Alcoólico',
            image: item.strDrinkThumb,
            instructions: item.strInstructions || 'Modo de preparo indisponível.',
            ingredients: extractedIngredients,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar detalhes:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>A carregar receita...</Text>
      </View>
    );
  }

  if (!drink) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Drink não encontrado.</Text>
      </View>
    );
  }

  const favoritado = isFavorite(drink.id);

  const drinkObjectForFavorite = {
    id: drink.id,
    name: drink.name,
    category: drink.category,
    image: drink.image,
    recipe: drink.instructions,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: drink.image }} style={styles.drinkImage} />
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => toggleFavorite(drinkObjectForFavorite)}
        >
          <Ionicons 
            name={favoritado ? "star" : "star-outline"} 
            size={24} 
            color="#D4AF37" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.title}>{drink.name}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{drink.category}</Text>
          </View>
          <View style={[styles.badge, styles.badgeAlcohol]}>
            <Text style={styles.badgeText}>{drink.alcoholic}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {drink.ingredients.map((ing, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Ionicons name="ellipse" size={8} color="#D4AF37" style={{ marginRight: 8 }} />
            <Text style={styles.ingredientText}>{ing}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Modo de Preparo</Text>
        <Text style={styles.instructionsText}>{drink.instructions}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#D4AF37',
    marginTop: 12,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  drinkImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  detailsBox: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 8,
  },
  badgeAlcohol: {
    borderColor: '#D4AF37',
  },
  badgeText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 16,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingLeft: 4,
  },
  ingredientText: {
    color: '#CCC',
    fontSize: 15,
  },
  instructionsText: {
    color: '#CCC',
    fontSize: 15,
    lineHeight: 22,
  },
});