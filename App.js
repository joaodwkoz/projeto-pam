import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { AlertProvider } from './src/contexts/AlertContext';

import Routes from './src/routes/index';

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';



Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,  
        shouldPlaySound: true,   
        shouldSetBadge: false,   
    }),
});

export default function App() {

    useEffect(() => {
        const registerNotifications = async () => {
            
            const { status } = await Notifications.requestPermissionsAsync();

            if (status !== 'granted') {
                console.log("Permissão negada para notificações");
            }
        };

        registerNotifications();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthProvider>
                <AlertProvider>
                    <Routes />
                </AlertProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
}
