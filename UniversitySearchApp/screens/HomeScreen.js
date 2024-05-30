import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [universities, setUniversities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const searchUniversities = async () => {
    try {
      const response = await axios.get(`http://universities.hipolabs.com/search?name=${name}&country=${country}`);
      if (response.data.length === 0) {
        setErrorMessage('Nenhuma universidade encontrada. Tente outras palavras-chave.');
      } else {
        setErrorMessage('');
        setUniversities(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome do País"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />
      <TextInput
        placeholder="Nome da Universidade"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="PESQUISAR" onPress={searchUniversities} color="#2196F3" />
        <Button title="FAVORITOS" onPress={() => navigation.navigate('Favorites')} color="#2196F3" />
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <ScrollView style={{ marginTop: 20 }}>
        {universities.map((university, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('UniversityDetails', { university })}>
            <View style={styles.universityItem}>
              <Text>{university.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  universityItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
