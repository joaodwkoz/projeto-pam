import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../pages/LoginScreen/Login';
import Signup from '../pages/SignupScreen/Signup';

const Stack = createNativeStackNavigator();

export default function AuthRoutes() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
    );
}