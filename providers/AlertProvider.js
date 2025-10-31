import { StyleSheet, View, useWindowDimensions } from 'react-native';
import React, { createContext, useState, useContext, useEffect, Children } from 'react';
import { AlertItem } from '../src/components/AlertItem';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const { width, height} = useWindowDimensions();

    const styles = dynamicStyles(width, height)

    const [alerts, setAlerts] = useState([
        {
            id: 252351,
            message: 'Sucesso!',
            type: 'success',
            obs: 'A sua implementação funcionou!',
        },

        {
            id: 86723,
            message: 'Você deve saber que!',
            type: 'info',
            obs: 'Por pouco não deu errado!',
        },

        {
            id: 23523,
            message: 'Não repita esse erro!',
            type: 'warning',
            obs: 'Tá complicado ein colega!',
        },

        {
            id: 547431,
            message: 'Erro!',
            type: 'error',
            obs: 'A sua implementação não funcionou!',
        }
    ]);
    
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
                            obs={alert.obs ?? null}
                            onClose={() => hideAlert(alert.id)}
                        />
                    ))
                )}
            </View>
        </AlertContext.Provider>
    )
};

const dynamicStyles = (width, height) => StyleSheet.create({
    alertContainer: {
        position: 'absolute',
        top: 0.0889 * width,
        left: 0.0889 * width,
        right: 0.0889 * width,
        zIndex: 9999,
        gap: 0.0222 * width,
    },
});

export const useAlert = () => {
    const context = useContext(AlertContext);

    if (!context) {
        throw new Error('useAlert deve ser usado dentro de um AlertProvider');
    }

    return context;
}