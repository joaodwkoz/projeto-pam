import { View, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import api from '../services/api';
import CopoItem from './CopoItem';
import { BASE_URL_STORAGE } from '../constants/api';

const Copos = ({setTotal}) => {
    const { usuario } = useAuth();

    const { spacing, width, colors, fonts, scale } = useTheme();

    const styles = useMemo(() => dynamicStyles(width, spacing, colors,  fonts, scale), [width, spacing, colors, fonts, scale]);

    const [isLoadingCups, setIsLoadingCups] = useState(true);
    const [copos, setCopos] = useState(null);

    const fetchUserCups = useCallback(async () => {
        try {
            const res = await api.get(`/usuario/${usuario.id}/copos`);
            setCopos(res.data);
        } catch(e) {
            console.error("Erro ao buscar copos do usuário:", e);
        } finally {
            setIsLoadingCups(false);
        }
    }, [usuario.id]);

    const handleNewConsumo = useCallback(async (volume, idCopo) => {
        const data = {
        'volume_ml': volume,
        'usuario_id': usuario.id,
        'copo_id': idCopo
        }

        try {
            await api.post('/consumo', data);
            setTotal(prev => prev + volume);
        } catch (e) {
            console.error("Erro ao salvar consumo:", e.response?.data || e.message);
            Alert.alert('Erro', 'Não foi possível salvar o consumo.');
        }
    }, [usuario.id, setTotal]);

    useEffect(() => {
        fetchUserCups();
    }, [fetchUserCups]);

    if (isLoadingCups) {
        return ( 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color='#6C83A1' size="large" />
            </View>
        )
    }

    return (
        <View style={styles.cupsContainer}>
            { copos && copos.length > 0 ? (
                <ScrollView style={styles.cups} contentContainerStyle={styles.cupsContainerStyle} horizontal>
                    { copos.map((c) => (
                        <CopoItem key={c.id} nome={c.nome} capacidade={c.capacidade_ml} icone={c.icone} scale={scale} onPress={() => handleNewConsumo(c.capacidade_ml, c.id)}></CopoItem>
                    ))}
                </ScrollView>
            ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.noCupsText}>
                        Você não tem copos
                    </Text>
                </View>
            )}
        </View>
    )
}

export default Copos;

const dynamicStyles = (width, spacing, colors, fonts, scale) => StyleSheet.create({
    cupsContainer: {
        width: '100%',
        height: 0.1722 * width + spacing.large + 0.24666 * width
    },

    cups: {
        width: '100%',
    },

    cupsContainerStyle: {
        gap: spacing.large,
        justifyContent: 'center',
        alignItems: 'center',
    },

    noCupsText: {
        fontFamily: fonts.medium,
        fontSize: 8 * scale,
        color: colors.text.app,
        lineHeight: 11 * scale,
    },
});