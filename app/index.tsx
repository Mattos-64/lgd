import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Page() {
  return (
    <View style={styles.container}>
      {/* Sombra de Luz no topo da tela */}
      <LinearGradient
        colors={['rgba(212, 175, 55, 0.65)', 'transparent']} 
        style={styles.topGlow}
      />

      <Text style={styles.title}>LGD - Bartender de Bolso 🍸</Text>
      <Text style={styles.subtitle}>O que vamos preparar para hoje?</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/(drinks)')}
      >
        <Text style={styles.buttonText}>Entrar no App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#121212',
    padding: 20,
    position: 'relative'
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300, // Altura do feixe de luz
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFF', 
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    color: '#AAA', 
    marginBottom: 24,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});