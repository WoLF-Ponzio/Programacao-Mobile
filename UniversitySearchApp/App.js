import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import UniversityDetailsScreen from './screens/UniversityDetailsScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Principal' }} />
        <Stack.Screen name="UniversityDetails" component={UniversityDetailsScreen} options={{ title: 'Detalhes da Universidade' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoritos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
