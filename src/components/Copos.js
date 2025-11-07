import { View, Text, Pressable, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useState, useMemo, useRef } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { BASE_URL_STORAGE } from '../constants/api';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import api from '../services/api';

import CopoItem from './CopoItem';
import CopoBottomSheet from './CopoBottomSheet';

import { Octicons, Entypo } from '@expo/vector-icons';

const Copos = ({setTotal, onOpenHistory}) => {
    const { usuario } = useAuth();

    if (!usuario) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color='#6C83A1' size="large" />; 
            </View>
        )
    }

    const { width, height, spacing, colors, fonts, scale } = useTheme();

    const styles = useMemo(() => dynamicStyles(width, spacing, colors,  fonts, scale), [width, spacing, colors, fonts, scale]);

    const [isLoadingCups, setIsLoadingCups] = useState(true);
    const [copos, setCopos] = useState([]);

    const bottomSheetRef = useRef(null);

    const [copoSelecionado, setCopoSelecionado] = useState(null);

    const handleOpenModalCreate = () => {
        setCopoSelecionado(null);
        bottomSheetRef.current?.present();
    }

    const handleOpenModalEdit = (copo) => {
        setCopoSelecionado(copo);
        bottomSheetRef.current?.present();
    }

    const handleSaveCup = async (dados) => {
        const dados = {...dados, 'usuario_id': usuario.id};

        try {
            const res = await api.post('/copo', dados);
            setCopos(prevCopos => [...prevCopos, res.data]);
        } catch(e) {
            console.error('Ocorreu um erro ao salvar o copo', e);
        }
    }

    const handleUpdateCup = async (dados) => {
        const dados = {...dados, 'usuario_id': usuario.id};

        try {
            const res = await api.put(`/copos/${copoSelecionado.id}`, dados);
            const copoAtualizado = res.data;
            setCopos(prevCopos =>
            prevCopos.map(c => 
                c.id === copoAtualizado.id
                ? copoAtualizado
                : c
            )
            );
        } catch(e) {
            console.error('Ocorreu um erro ao atualizar o copo', e);
        }
    }

    const handleDeleteCup = async () => {
        try {
            await api.delete(`/copos/${copoSelecionado.id}`);
            setCopos(prevCopos =>
                prevCopos.filter(c => c.id !== copoSelecionado.id)
            );
        } catch(e) {
            console.error('Ocorreu um erro ao remover o copo', e);
        }
    }

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
        <BottomSheetModalProvider>
            <View style={styles.cupsContainer}>
                <View style={styles.cupBtns}>
                    <Pressable style={styles.cupBtn} onPress={() => onOpenHistory()}>
                        <Octicons name="graph" size={24} color={colors.white} />
                    </Pressable>

                    <Pressable style={styles.cupBtn} onPress={() => handleOpenModalCreate()}>
                        <Entypo name="plus" size={24} color={colors.white} />
                    </Pressable>
                </View>

                { copos && copos.length > 0 ? (
                    <ScrollView style={styles.cups} contentContainerStyle={styles.cupsContainerStyle} horizontal>
                        { copos.map((c) => (
                            <CopoItem key={c.id} nome={c.nome} capacidade={c.capacidade_ml} icone={c.icone} onPress={() => handleNewConsumo(c.capacidade_ml, c.id)} onLongPress={() => handleOpenModalEdit(c)}></CopoItem>
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

            <CopoBottomSheet
                bottomRef={bottomSheetRef}
                initialData={copoSelecionado}
                onSubmit={copoSelecionado ? handleUpdateCup : handleSaveCup}
                onDelete={handleDeleteCup}
            />
        </BottomSheetModalProvider>
    )
}

export default Copos;

const dynamicStyles = (width, spacing, colors, fonts, scale) => StyleSheet.create({
    cupsContainer: {
        width: '100%',
        height: 0.1722 * width + spacing.large + 0.24666 * width,
        gap: spacing.medium,
    },

    cupBtns: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    cupBtn: {
        height: 0.0555 * height,
        aspectRatio: 1 / 1,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.02 * width,
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
        color: colors.text.primary,
        lineHeight: 11 * scale,
    },
});