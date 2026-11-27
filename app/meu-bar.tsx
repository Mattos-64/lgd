import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

// Duas bebidas por linha.
const cardWidth = (screenWidth - 48) / 2;

// Lista fixa de ingredientes.
const AVAILABLE_INGREDIENTS = [
  'Vodka', 'Gin', 'Rum', 'Tequila', 'Whiskey', 
  'Lemon', 'Lime', 'Sugar', 'Mint', 'Ice', 
  'Orange juice', 'Cola', 'Tonic water', 'Vermouth', 'Grenadine'
];

interface BarDrink {
  id: string;
  name: string;
  image: string;
}

export default function MeuBarScreen() {
  //Guarda os ingredientes.
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  //após eu selecionar os ingredientes, ele guarda as bebidas puxadas da api.
  const [drinks, setDrinks] = useState<BarDrink[]>([]);
  //Apenas mostra a tela carregando, enquanto ele busca as bebidas.
  const [loading, setLoading] = useState<boolean>(false);
  
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const router = useRouter();

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  //Função para buscar os drinks por ingrediente.
  const searchDrinksByIngredients = async () => {
    if (selectedIngredients.length === 0) return;

    setLoading(true);
    setHasSearched(true);

    try {
      let allFoundDrinks: BarDrink[] = [];
      const seenIds = new Set<string>();

      // Para cada ingrediente selecionado, fazemos uma busca flexível na API
      for (const ingredient of selectedIngredients) {
        // Tenta o filtro direto por ingrediente
        //O tratamento é feito pela api. eu só peço a busca por ingrediente que a API me retorna.
        const resFilter = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        //converte de http para json.
        const dataFilter = await resFilter.json();

        if (dataFilter.drinks) {
          dataFilter.drinks.forEach((item: any) => {
            if (!seenIds.has(item.idDrink)) {
              seenIds.add(item.idDrink);
              allFoundDrinks.push({
                id: item.idDrink,
                name: item.strDrink,
                image: item.strDrinkThumb,
              });
            }
          });
        }
      }

      // Se o filtro direto retornou poucos ou nenhum coquetel (ex: Ice, Sugar, Lemon),
      // fazemos uma busca complementar por nome base para garantir que a tela não fique vazia
      if (allFoundDrinks.length <= 2) {
        const fallbackQueries = ['Margarita', 'Mojito', 'Daiquiri', 'Punch', 'Sour', 'Tonic', 'Fizz'];
        for (const query of fallbackQueries) {
          const resSearch = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
          const dataSearch = await resSearch.json();

          if (dataSearch.drinks) {
            dataSearch.drinks.forEach((item: any) => {
              if (!seenIds.has(item.idDrink)) {
                seenIds.add(item.idDrink);
                allFoundDrinks.push({
                  id: item.idDrink,
                  name: item.strDrink,
                  image: item.strDrinkThumb,
                });
              }
            });
          }
        }
      }

      setDrinks(allFoundDrinks);
    } catch (error) {
      console.error('Erro ao buscar drinks do bar:', error);
      setDrinks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>O que tem no seu bar?</Text>
      <Text style={styles.headerSubtitle}>
        Selecione os ingredientes disponíveis para descobrir coquetéis que pode preparar agora mesmo.
      </Text>

      <View style={styles.ingredientsContainer}>
        {AVAILABLE_INGREDIENTS.map((item) => {
          const isSelected = selectedIngredients.includes(item);
          return (
            <TouchableOpacity
              key={item}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => toggleIngredient(item)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity 
        style={[styles.searchButton, selectedIngredients.length === 0 && styles.buttonDisabled]} 
        disabled={selectedIngredients.length === 0}
        onPress={searchDrinksByIngredients}
      >
        <Text style={styles.searchButtonText}>Encontrar Coquetéis</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>A misturar opções...</Text>
        </View>
      ) : (
        hasSearched && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              Coquetéis Possíveis ({drinks.length})
            </Text>

            {drinks.length === 0 ? (
              <Text style={styles.noResultsText}>Nenhum drink encontrado com estes ingredientes.</Text>
            ) : (
              <View style={styles.grid}>
                {drinks.map((drink) => (
                  <TouchableOpacity 
                    key={drink.id} 
                    style={styles.card}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/(drinks)/${drink.id}`)}
                  >
                    <Image source={{ uri: drink.image }} style={styles.cardImage} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.drinkName} numberOfLines={1}>{drink.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 20,
    lineHeight: 20,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  chipText: {
    color: '#CCC',
    fontSize: 13,
  },
  chipTextSelected: {
    color: '#121212',
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#333',
  },
  searchButtonText: {
    color: '#121212',
    fontSize: 15,
    fontWeight: 'bold',
  },
  centerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#D4AF37',
    marginTop: 10,
  },
  resultsSection: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  noResultsText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: cardWidth,
    backgroundColor: '#2A2A2A',
  },
  cardInfo: {
    padding: 10,
  },
  drinkName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});