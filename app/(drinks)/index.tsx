import React, { useEffect, useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- Importando o router
import { useFavorites, Drink } from '../../context/FavoriteContext';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

const CLASSIC_DRINKS = [
  'Margarita', 'Mojito', 'Old Fashioned', 'Negroni', 'Cosmopolitan', 
  'Dry Martini', 'Piña Colada', 'Daiquiri', 'Manhattan', 'Moscow Mule', 
  'Caipirinha', 'Whiskey Sour', 'Mai Tai', 'Aperol Spritz', 'Espresso Martini',
  'Gin Tonic', 'Sangria', 'Tom Collins', 'Bloody Mary', 'Cuba Libre',
  'Sex on the Beach', 'B52', 'Long Island Iced Tea', 'Teor de Rosa', 'Pisco Sour',
  'Amaretto Sour', 'French 75', 'Dark and Stormy', 'Paloma', 'Bellini'
];

export default function DrinksScreen() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter(); // <--- Instanciando o router

  useEffect(() => {
    //Aqui eu buscoa da api os 30 drinks delimitados acima.
    // Ele puxa da api os dinks e seus ingredientes.
    async function fetchClassicDrinks() {
      try {
        const promises = CLASSIC_DRINKS.map(async (name): Promise<Drink | null> => {
          //faz a pesquisa pelo nome do drink.
          const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
          const data = await response.json();
          //se a busca retornou um drink, ele o armazena e o formata para a tela.
          if (data.drinks && data.drinks.length > 0) {
            const item = data.drinks[0];
            return {
              id: item.idDrink,
              name: item.strDrink,
              category: item.strCategory || 'Coquetel Clássico',
              image: item.strDrinkThumb,
              recipe: item.strInstructions,
            };
          }
          return null;
        });

        // aguarda todos os processos terminarem
        //armazena tud qe não é nulo.
        const results = await Promise.all(promises);
        const validDrinks = results.filter((item): item is Drink => item !== null);
        
        // salva a lista final
        setDrinks(validDrinks);
      } catch (error) {
        console.error('Erro ao buscar os clássicos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchClassicDrinks();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>A preparar o bar com 30 clássicos...</Text>
      </View>
    );
  }

  // Aqui preparamos a tela para as buscas e recebimetnos dos resultados.
  return (
    <View style={styles.container}>
      <FlatList
        data={drinks}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => {
          const favoritado = isFavorite(item.id);

          return (
            /* foto clicável que vai para a tela de detalhes */
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={() => router.push(`/(drinks)/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <TouchableOpacity 
              //botão clicável da estrela de favoritos.
                style={styles.favoriteButton} 
                onPress={(e) => {
                  e.stopPropagation(); // Evita que clique na estrela abra a tela de detalhes ao mesmo tempo
                  toggleFavorite(item);
                }}
              >
                <Ionicons 
                  name={favoritado ? "star" : "star-outline"} 
                  size={20} 
                  color="#D4AF37" 
                />
              </TouchableOpacity>

              
              <View style={styles.cardInfo}>
                <Text style={styles.drinkName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.drinkCategory} numberOfLines={1}>{item.category}</Text>
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
    paddingTop: 16,
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
  listContainer: {
    paddingBottom: 20,
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
    backgroundColor: 'rgba(18, 18, 18, 0.7)',
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
  }
});