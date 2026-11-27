import React, { createContext, useContext, useState } from 'react';

export interface Drink {
  id: string;
  name: string;
  category: string;
  image?: string;
  recipe?: string;
}

interface FavoritesContextData {
  favorites: Drink[];
  toggleFavorite: (drink: Drink) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Drink[]>([]);

  const toggleFavorite = (drink: Drink) => {
    setFavorites(prevFavorites => {
      const exists = prevFavorites.some(item => item.id === drink.id);
      if (exists) {
        return prevFavorites.filter(item => item.id !== drink.id);
      } else {
        return [...prevFavorites, drink];
      }
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  // Proteção de segurança caso o contexto seja chamado fora do provedor
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}