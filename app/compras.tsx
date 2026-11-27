import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
}

const STORAGE_KEY = '@lgd_lista_compras';

const QUICK_SUGGESTIONS = [
  'Gelo',
  'Limão Taiti',
  'Hortelã',
  'Açúcar',
  'Água Tônica',
  'Refrigerante Cola',
];

export default function ComprasScreen() {
  const [inputText, setInputText] = useState<string>('');
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadShoppingList() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erro ao carregar lista de compras:', error);
      } finally {
        setLoaded(true);
      }
    }

    loadShoppingList();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch((error) => {
      console.error('Erro ao salvar lista de compras:', error);
    });
  }, [items, loaded]);

  function addItem(rawName?: string) {
    const cleanName = (rawName ?? inputText).trim();
    if (!cleanName) return;

    const alreadyExists = items.some(
      (item) => item.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (alreadyExists) {
      if (!rawName) setInputText('');
      return;
    }

    const newItem: ShoppingItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      checked: false,
    };

    setItems((prev) => [newItem, ...prev]);
    if (!rawName) {
      setInputText('');
    }
  }

  function toggleItem(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCheckedItems() {
    setItems((prev) => prev.filter((item) => !item.checked));
  }

  const remainingCount = items.filter((item) => !item.checked).length;
  const checkedCount = items.filter((item) => item.checked).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>Checklist do Bar</Text>
        <Text style={styles.subtitle}>
          Monte sua lista de compras para preparar os drinks sem esquecer nenhum ingrediente.
        </Text>
      </View>

      {/* Campo de adição */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Gin, Maracujá, Xarope..."
          placeholderTextColor="#777"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => addItem()}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !inputText.trim() && styles.addButtonDisabled]}
          disabled={!inputText.trim()}
          activeOpacity={0.85}
          onPress={() => addItem()}
        >
          <Ionicons name="add" size={24} color="#121212" />
        </TouchableOpacity>
      </View>

      {/* Atalhos rápidos */}
      <View style={styles.suggestionsBox}>
        <Text style={styles.suggestionsLabel}>Atalhos rápidos:</Text>
        <View style={styles.chipsRow}>
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.chip}
              activeOpacity={0.8}
              onPress={() => addItem(suggestion)}
            >
              <Text style={styles.chipText}>+ {suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Resumo e limpeza de marcados */}
      {items.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>
            Pendentes: <Text style={styles.goldText}>{remainingCount}</Text> de {items.length}
          </Text>

          {checkedCount > 0 && (
            <TouchableOpacity onPress={clearCheckedItems} activeOpacity={0.8}>
              <Text style={styles.clearText}>Limpar comprados ({checkedCount})</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Lista */}
      {items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="cart-outline" size={56} color="#D4AF37" />
          <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
          <Text style={styles.emptySubtitle}>
            Adicione ingredientes acima ou toque nos atalhos rápidos para montar seu checklist.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.itemCard, item.checked && styles.itemCardChecked]}>
              <TouchableOpacity
                style={styles.itemLeft}
                activeOpacity={0.8}
                onPress={() => toggleItem(item.id)}
              >
                <Ionicons
                  name={item.checked ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={item.checked ? '#888' : '#D4AF37'}
                />
                <Text
                  style={[
                    styles.itemText,
                    item.checked && styles.itemTextChecked,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.8}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#E57373" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#AAA',
    lineHeight: 19,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 15,
  },
  addButton: {
    width: 48,
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#333',
  },
  suggestionsBox: {
    marginBottom: 16,
  },
  suggestionsLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  chipText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  summaryText: {
    color: '#CCC',
    fontSize: 13,
  },
  goldText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  clearText: {
    color: '#E57373',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 32,
  },
  itemCard: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemCardChecked: {
    opacity: 0.65,
    borderColor: '#252525',
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    color: '#FFF',
    fontSize: 15,
    flex: 1,
  },
  itemTextChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyTitle: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});