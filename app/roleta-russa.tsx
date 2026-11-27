import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface RouletteDrink {
  id: string;
  name: string;
  category: string;
  alcoholic: string;
  image: string;
  instructions: string;
  ingredients: string[];
}

export default function RoletaRussaScreen() {
  //armazenar os que forem sorteados.
  const [selectedDrinks, setSelectedDrinks] = useState<RouletteDrink[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  //os 3 const e a function abaixo servem para controlar a animação
  // da tela de carregamento, enquanto busca as bebidas.
  const spinScale = useSharedValue(1);
  const spinRotate = useSharedValue(0);

  
  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: spinScale.value },
      { rotate: `${spinRotate.value}deg` },
    ],
  }));


  function triggerRollAnimation() {
    spinScale.value = withSequence(
      withTiming(1.12, { duration: 140 }),
      withTiming(1, { duration: 180 })
    );
    spinRotate.value = withSequence(
      withTiming(-8, { duration: 90 }),
      withTiming(8, { duration: 90 }),
      withTiming(0, { duration: 100 })
    );
  }


  function formatDrink(item: any): RouletteDrink {
    //cria um array vazio, para guardar os ingredientes em formato de texto
    const ingredients: string[] = [];
    //faz um laço de 1 até 15 pq a api tem no máximo 15 ingredientes.
    for (let i = 1; i <= 15; i++) {
      //aqui vai guardando os ingredientes do 1 ao 15.
      const ing = item[`strIngredient${i}`];
      const measure = item[`strMeasure${i}`];
      //garante que não é nulo. - trim remove espaços em brano e vazios.
      if (ing && ing.trim()) {
        //monta a string final e joga pro array da bebida.
        ingredients.push(
          //aqui faz a tratativa dos ingredientes, de quantidade, tamanho...
          `${measure && measure.trim() ? measure.trim() + ' de ' : ''}${ing.trim()}`
        );
      }
    }

    return {
      id: item.idDrink,
      name: item.strDrink,
      category: item.strCategory || 'Coquetel',
      alcoholic: item.strAlcoholic || 'Alcoólico',
      image: item.strDrinkThumb,
      instructions: item.strInstructions || 'Modo de preparo indisponível.',
      ingredients,
    };
  }

  //Aqui faço o sorteio de fato.
  async function handleDrawThreeDrinks() {
    setLoading(true);
    setErrorMsg(null);
    triggerRollAnimation();

    try {
      //lista das bebidas capturadas na requisição à APi
      const picked: RouletteDrink[] = [];
      //evitar que o sorteio pegue bebidas repetidas.
      const usedIds = new Set<string>();
      let attempts = 0;
      const maxAttempts = 20;

      // enquanto não tiver buscado 3 drinks válidos, ele continua tentando.
      while (picked.length < 3 && attempts < maxAttempts) {
        attempts++;
        // Aqui solicita à APi.
        const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        const data = await res.json();

        // Verifica se há, ao menos, uma bebida na busca feita.
        if (data.drinks && data.drinks.length > 0) {
          //pega o primeiro e único drink retornado pelo random.php
          const raw = data.drinks[0];
          //garante que não é repetido
          if (!usedIds.has(raw.idDrink) && raw.strInstructions) {
            usedIds.add(raw.idDrink);
            picked.push(formatDrink(raw));
          }
        }
      }

      if (picked.length === 0) {
        setErrorMsg('Não foi possível sortear os drinks agora. Tente novamente.');
      }

      setSelectedDrinks(picked);
    } catch (error) {
      console.error('Erro no Modo Roleta Russa:', error);
      setErrorMsg('Erro de conexão ao sortear os drinks.');
    } finally {
      setLoading(false);
    }
  }

  //limpa a tela para um próximo sorteio.
  function handleReset() {
    setSelectedDrinks([]);
    setErrorMsg(null);
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Animated.View style={[styles.iconCircle, animatedBadgeStyle]}>
          <Ionicons name="flame" size={34} color="#121212" />
        </Animated.View>
        <Text style={styles.title}>Modo Roleta Russa</Text>
        <Text style={styles.subtitle}>
          Aperte o botão para sortear 3 drinks aleatórios e já ver a receita completa de cada um na tela.
        </Text>
      </View>

      {/* Controles: Sortear e Reiniciar */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.drawButton, loading && styles.buttonDisabled]}
          activeOpacity={0.85}
          disabled={loading}
          onPress={handleDrawThreeDrinks}
        >
          <Ionicons name="shuffle" size={20} color="#121212" />
          <Text style={styles.drawButtonText}>
            {selectedDrinks.length > 0 ? 'Sortear Outros 3' : 'Sortear 3 Drinks'}
          </Text>
        </TouchableOpacity>

        {selectedDrinks.length > 0 && !loading && (
          <TouchableOpacity
            style={styles.resetButton}
            activeOpacity={0.85}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={20} color="#D4AF37" />
            <Text style={styles.resetButtonText}>Reiniciar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Carregamento */}
      {loading && (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Girando a roleta e separando 3 receitas...</Text>
        </View>
      )}

      {/* Erro */}
      {!loading && errorMsg && (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* 3 Drinks Sorteados com Receita */}
      {!loading && selectedDrinks.length > 0 && (
        <View style={styles.resultsList}>
          {selectedDrinks.map((drink, index) => (
            <View key={drink.id} style={styles.drinkCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.slotBadge}>
                  <Text style={styles.slotBadgeText}>DRINK #{index + 1}</Text>
                </View>
                <Text style={styles.alcoholicText}>{drink.alcoholic}</Text>
              </View>

              <View style={styles.drinkHeader}>
                <Image source={{ uri: drink.image }} style={styles.drinkImage} />
                <View style={styles.drinkTitleBox}>
                  <Text style={styles.drinkName}>{drink.name}</Text>
                  <Text style={styles.drinkCategory}>{drink.category}</Text>
                </View>
              </View>

              <Text style={styles.subSectionTitle}>Ingredientes</Text>
              {drink.ingredients.map((ing, idx) => (
                <View key={idx} style={styles.ingredientItem}>
                  <Ionicons name="ellipse" size={7} color="#D4AF37" style={styles.bullet} />
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}

              <Text style={styles.subSectionTitle}>Modo de Preparo</Text>
              <Text style={styles.instructionsText}>{drink.instructions}</Text>
            </View>
          ))}
        </View>
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
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  drawButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  drawButtonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  resetButtonText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centerBox: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    color: '#D4AF37',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#E57373',
    fontSize: 14,
    textAlign: 'center',
  },
  resultsList: {
    gap: 18,
  },
  drinkCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  slotBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.16)',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  slotBadgeText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: 'bold',
  },
  alcoholicText: {
    color: '#999',
    fontSize: 12,
  },
  drinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  drinkImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#2A2A2A',
  },
  drinkTitleBox: {
    flex: 1,
  },
  drinkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  drinkCategory: {
    fontSize: 13,
    color: '#D4AF37',
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 8,
    marginBottom: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingLeft: 4,
  },
  bullet: {
    marginRight: 8,
  },
  ingredientText: {
    color: '#DDD',
    fontSize: 14,
  },
  instructionsText: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 21,
  },
});