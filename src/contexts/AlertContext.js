import { StyleSheet, View } from 'react-native';
import { createContext, useState, useContext, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { AlertItem } from '../components/AlertItem';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const { spacing } = useTheme();

    const styles = useMemo(() => dynamicStyles(spacing), [spacing])

    const [alerts, setAlerts] = useState(null);
    
    const hideAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const showAlert = (message, type = 'info', obs = null) => {
        setAlerts(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: message,
            type: type,
            obs: obs
        }]);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            { children }

            <View style={styles.alertContainer}> 
                {alerts && alerts.length > 0 && (
                    alerts.map((alert, index) => (
                        <AlertItem
                            key={alert.id}
                            message={alert.message}
                            type={alert.type}
                            obs={alert.obs}
                            onClose={() => hideAlert(alert.id)}
                        />
                    ))
                )}
            </View>
        </AlertContext.Provider>
    )
};

const dynamicStyles = (spacing) => StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: spacing.app,
        left: spacing.app,
        right: spacing.app,
        zIndex: 9999,
        gap: spacing.medium,
    },
});