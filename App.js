import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { AlertProvider } from './src/contexts/AlertContext';

import Routes from './src/routes/index';

export default function App() {
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
