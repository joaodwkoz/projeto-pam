import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/pages/HomeScreen/Home';
import Login from './src/pages/LoginScreen/Login';
import Signup from './src/pages/SignupScreen/Signup';
import Calorias from './src/pages/CaloriasScreen/Calorias';
import Profile from './src/pages/ProfileScreen/Profile'

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}