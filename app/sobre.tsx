import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SobreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Ícone de Destaque / Logo */}
      <View style={styles.headerIconContainer}>
        <Ionicons name="wine" size={64} color="#D4AF37" />
        <Text style={styles.appName}>LGD</Text>
        <Text style={styles.appSubName}>Bartender de Bolso</Text>
      </View>

      {/* Card de Apresentação */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>A Arte da Coquetelaria na Palma da Sua Mão</Text>
        <Text style={styles.paragraph}>
          O <Text style={styles.goldText}>LGD - Bartender de Bolso</Text> nasceu para transformar qualquer momento em uma experiência de alta coquetelaria. Seja para impressionar convidados em uma recepção em casa ou para descobrir novos sabores no fim de semana, o nosso app reúne uma curadoria impecável com os coquetéis mais icónicos do mundo.
        </Text>
      </View>

      {/* Funcionalidades em Destaque */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>O Que Você Encontra Aqui</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="grid-outline" size={22} color="#D4AF37" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Apresentação de Clássicos</Text>
            <Text style={styles.featureDesc}>Uma seleção refinada com 30 drinks lendários, receitas detalhadas e proporções exatas.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="star-outline" size={22} color="#D4AF37" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Favoritos Personalizados</Text>
            <Text style={styles.featureDesc}>Marque as suas receitas preferidas e acesse-as instantaneamente no seu painel exclusivo.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="flask-outline" size={22} color="#D4AF37" style={styles.featureIcon} />
          <View style={styles.featureTextContainer}>
            <Text style={styles.featureTitle}>Ingredientes e Modo de Preparo</Text>
            <Text style={styles.featureDesc}>Instruções passo a passo fáceis de seguir para acertar no ponto e na apresentação do drink.</Text>
          </View>
        </View>
      </View>

      {/* Rodapé / Créditos */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Desenvolvido por Lucas Mattos.</Text>
        <Text style={styles.versionText}>Versão 1.0.0 - Edição de Faculdade</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(drinks)')}>
          <Text style={styles.buttonText}>Explorar o Bar</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 40,
  },
  headerIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    letterSpacing: 2,
    marginTop: 8,
  },
  appSubName: {
    fontSize: 14,
    color: '#AAA',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 12,
  },
  paragraph: {
    color: '#CCC',
    fontSize: 15,
    lineHeight: 22,
  },
  goldText: {
    color: '#D4AF37',
    fontWeight: '600',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDesc: {
    color: '#999',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 4,
  },
  versionText: {
    color: '#D4AF37',
    fontSize: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#121212',
    fontSize: 15,
    fontWeight: 'bold',
  },
});