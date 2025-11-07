import { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { ICONS } from '../constants/app';

import { useTheme } from '../hooks/useTheme';

import { IconSelector } from './IconSelector';

const CopoBottomSheet = ({ bottomRef, initialData, onSubmit, onDelete }) => {
    const { colors, fonts, spacing, width, height, scale } = useTheme();

    const styles = useMemo(() => dynamicStyles(height, colors, fonts, spacing, scale), [height, colors, fonts, spacing, scale]);

    const snapPoints = useMemo(() => ['50%', '80%'], []);

    const [nome, setNome] = useState('');
    const [capacidade, setCapacidade] = useState('');
    const [iconeEscolhido, setIconeEscolhido] = useState(-1);

    const [mode, setMode] = useState('Create');

    useEffect(() => {
        if (initialData) {
            setMode('Edit');
            setNome(initialData.nome);
            setCapacidade(String(initialData.capacidade_ml));
            const index = ICONS.findIndex(icon => icon.nome === initialData.icone?.nome);
            setIconeEscolhido(index !== -1 ? index : null);
        } else {
            setMode('Create');
            setNome('');
            setCapacidade('');
            setIconeEscolhido(null);
        }
    }, [initialData]);

    const handleContinue = () => {
        const dados = {
            nome: nome,
            capacidade_ml: Number(capacidade),
            icone_id: iconeEscolhido !== null ? ICONS[iconeEscolhido].id : null, 
        };
        onSubmit(dados);
    };

    const handleDelete = () => {
        onDelete();
    };

    const handleCancel = () => {
        bottomRef.current?.dismiss();
    };

    return (
        <BottomSheetModal ref={bottomRef} snapPoints={snapPoints} enablePanDownToClose={true} index={0} backgroundStyle={{
            backgroundColor: colors.white,
        }}>
            <BottomSheetScrollView contentContainerStyle={{
                padding: spacing.medium,
                gap: spacing.medium,
            }}>
                <Text style={styles.title}>
                    {mode === 'Create' ? 'Adicionar Copo' : 'Editar Copo'}
                </Text>

                <Text style={styles.label}>
                    Nome
                </Text>

                <BottomSheetTextInput style={styles.input} value={nome} onChangeText={setNome} placeholder='Ex.: Garrafa de casa' />

                <Text style={styles.label}>
                    Capacidade (ml)
                </Text>

                <BottomSheetTextInput style={styles.input} value={capacidade} onChangeText={setCapacidade} placeholder='Ex.: 500' keyboardType='numeric' />

                <Text style={styles.label}>
                    Ícone
                </Text>

                <IconSelector data={ICONS} selectedValue={iconeEscolhido} onSelect={setIconeEscolhido} />

                <View style={styles.actions}>
                    {mode === 'Edit' && <Pressable style={[styles.actionsBtn, { backgroundColor: colors.danger }]} onPress={() => handleDelete()}>
                        <Text style={{
                        fontFamily: fonts.medium,
                        fontSize: 5 * scale,
                        lineHeight: 5.5 * scale,
                        color: colors.white,
                        }}>Remover</Text>
                    </Pressable>}

                    <Pressable style={[styles.actionsBtn, { backgroundColor: colors.secondaryWhite }]} onPress={() => handleCancel()}>
                        <Text style={{
                        fontFamily: fonts.medium,
                        fontSize: 5 * scale,
                        lineHeight: 5.5 * scale,
                        color: colors.text.primary,
                        }}>Cancelar</Text>
                    </Pressable>

                    <Pressable style={[styles.actionsBtn, { backgroundColor: colors.primary }]} onPress={() => {
                        handleContinue();
                    }}>
                        <Text style={{
                        fontFamily: fonts.medium,
                        fontSize: 5 * scale,
                        lineHeight: 5.5 * scale,
                        color: colors.white,
                        }}>Continuar</Text>
                    </Pressable>
                </View>
            </BottomSheetScrollView>
        </BottomSheetModal>
    )
};

export default CopoBottomSheet;

const dynamicStyles = (height, colors, fonts, spacing, scale) => StyleSheet.create({
    title: {
        fontFamily: fonts.medium,
        fontSize: 8 * scale,
        color: colors.text.primary,
        lineHeight: 11 * scale,
    },

    input: {
        width: '100%',
        height: 0.0444 * height,
        padding: 3 * scale,
        fontFamily: fonts.medium,
        fontSize: 6 * scale,
        lineHeight: 8 * scale,
        backgroundColor: colors.white,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: colors.text.primary,
    },

    label: {
        fontFamily: fonts.medium,
        fontSize: 7 * scale,
        color: colors.text.primary,
        lineHeight: 7.7 * scale,
    },

    actions: {
        width: '100%',
        height: 0.0555 * height,
        flexDirection: 'row',
        gap: spacing.small,
    },

    actionsBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 0.0075 * height,
    },
});