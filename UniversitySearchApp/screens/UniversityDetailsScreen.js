import React from 'react';
import { View, Text, Button, Linking, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UniversityDetailsScreen({ route }) {
  const { university } = route.params;

  const saveToFavorites = async () => {
    try {
      let favorites = await AsyncStorage.getItem('favorites');
      favorites = favorites ? JSON.parse(favorites) : [];
      if (!favorites.some(fav => fav.name === university.name)) {
        favorites.push(university);
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Adicionado aos favoritos');
      } else {
        alert('Esta universidade já está nos favoritos');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <Text style={styles.value}>{university.name}</Text>
      <Text style={styles.label}>País:</Text>
      <Text style={styles.value}>{university.country}</Text>
      <Text style={styles.label}>Website:</Text>
      <Text style={styles.link} onPress={() => Linking.openURL(university.web_pages[0])}>
        {university.web_pages[0]}
      </Text>
      <Button title="Favoritar" onPress={saveToFavorites} color="#2196F3" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    marginBottom: 10,
  },
  link: {
    color: 'blue',
    marginBottom: 20,
  },
});
