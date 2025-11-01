import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import { useFonts } from 'expo-font';

import AuthRoutes from './auth';
import AppRoutes from './app';

import { useAuth } from '../hooks/useAuth';

export default function Routes() {
    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const { signed, isLoading } = useAuth();

    if (isLoading || !fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <NavigationContainer>
            { signed ? <AppRoutes /> : <AuthRoutes /> }
        </NavigationContainer>
    )
}