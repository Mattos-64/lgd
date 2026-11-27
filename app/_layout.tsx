import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { FavoritesProvider } from '../context/FavoriteContext'; // <--- Importando o nosso contexto da raiz

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider> {/* <--- Envolvendo toda a navegação */}
        <Drawer
          screenOptions={{
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#D4AF37',
            drawerStyle: {
              backgroundColor: '#121212',
              width: 280,
            },
            drawerActiveTintColor: '#D4AF37',
            drawerInactiveTintColor: '#AAA',
          }}
        >
          {/* Tela Inicial (Home com o gradiente dourado) */}
          <Drawer.Screen
            name="index"
            options={{
              drawerItemStyle: { display: 'none' },
              headerShown: false,
              title: 'Início',
            }}
          />

          {/* Grupo de Drinks */}
          <Drawer.Screen
            name="(drinks)"
            options={{
              drawerLabel: 'Explorar Drinks',
              title: 'LGD - Bartender de Bolso',
            }}
          />

          {/* Tela Meu Bar */}
          <Drawer.Screen
            name="meu-bar"
            options={{
              drawerLabel: 'Meu Bar (Ingredientes)',
              title: 'Meu Bar',
            }}
          />

          {/* Tela Sobre */}
          <Drawer.Screen
            name="sobre"
            options={{
              drawerLabel: 'Sobre o App',
              title: 'Sobre o LGD',
            }}
          />

          {/* tela de favoritos */}
          <Drawer.Screen
            name="favoritos"
            options={{
              drawerLabel: 'Favoritos',
              title: 'Meus Drinks Favoritos',
            }}
          />

          {/* Tela do sorteio Roleta Russa */}
          <Drawer.Screen
            name="roleta-russa"
            options={{
              drawerLabel: 'Roleta Russa',
              title:'Surpreeenda-me, se for capaz',
            }}
          />

          <Drawer.Screen
            name= "compras"
            options={{
              drawerLabel: 'Lista de compras',
              title: 'CheckList do Bar'
            }}
          />
          
        </Drawer>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}