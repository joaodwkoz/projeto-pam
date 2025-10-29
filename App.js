import 'react-native-gesture-handler';
import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthContext, AuthProvider } from './contexts/AuthContext';

import Home from './src/pages/HomeScreen/Home';
import Login from './src/pages/LoginScreen/Login';
import Signup from './src/pages/SignupScreen/Signup';
import Calorias from './src/pages/CaloriasScreen/Calorias';
import Profile from './src/pages/ProfileScreen/Profile';
import Agua from './src/pages/AguaScreen/Agua';
import Imc from './src/pages/ImcScreen/Imc';
import Alergias from './src/pages/AlergiasScreen/Alergias';
import Glicemia from './src/pages/GlicemiaScreen/Glicemia';
import Meditacao from './src/pages/MeditacaoScreen/Meditacao';
import Batimentos from './src/pages/BatimentosScreen/Batimentos';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { signed, isLoading } = useContext(AuthContext);

  if(isLoading){    
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
        }}>
          {signed ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Calorias" component={Calorias} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Agua" component={Agua} />
              <Stack.Screen name="Imc" component={Imc} />
              <Stack.Screen name="Alergias" component={Alergias} />
              <Stack.Screen name="Glicemia" component={Glicemia} />
              <Stack.Screen name="Meditacao" component={Meditacao} />
              <Stack.Screen name="Batimentos" component={Batimentos} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  )
}