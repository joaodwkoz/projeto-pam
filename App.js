import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';

import { AuthContext, AuthProvider } from './contexts/AuthContext';

import Home from './src/pages/HomeScreen/Home';
import Login from './src/pages/LoginScreen/Login';
import Signup from './src/pages/SignupScreen/Signup';
import Calorias from './src/pages/CaloriasScreen/Calorias';
import Profile from './src/pages/ProfileScreen/Profile'

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { signed, isLoading } = useContext(AuthContext);

  if(isLoading){    
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{
        headerShown: false,
      }}>
        {signed ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Calorias" component={Calorias} />
            <Stack.Screen name="Profile" component={Profile} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  )
}