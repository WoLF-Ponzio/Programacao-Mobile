import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        let favorites = await AsyncStorage.getItem('favorites');
        favorites = favorites ? JSON.parse(favorites) : [];
        setFavorites(favorites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (university) => {
    try {
      let favorites = await AsyncStorage.getItem('favorites');
      favorites = favorites ? JSON.parse(favorites) : [];
      favorites = favorites.filter(fav => fav.name !== university.name);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setFavorites(favorites);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={{ padding: 10 }}>
      {favorites.map((university, index) => (
        <View key={index} style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
          <Text style={{paddingBottom: 3}}>{university.name}</Text>
          <Button title="Remover" onPress={() => removeFromFavorites(university)} />
        </View>
      ))}
    </ScrollView>
  );
}
