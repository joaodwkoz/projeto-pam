import { View, StyleSheet, Pressable, Text, Image } from 'react-native';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import { useTheme } from '../hooks/useTheme';

const IconSelector = ({ data, selectedValue = null, onSelect }) => {
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    
    const { spacing, width, height, colors, fonts, scale } = useTheme();

    const styles = useMemo(() => dynamicStyles(width, height, spacing, colors, fonts, scale), [width, height, spacing, colors, fonts, scale]);

    return (
        <View style={styles.container}>
            <Pressable style={styles.select} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                <Text style={{
                fontFamily: 'Poppins-M',
                fontSize: 6 * scale,
                color: '#6C83A1',
                lineHeight: 9 * scale,
                }}>
                    {selectedValue !== null ? data[selectedValue].nome : "Selecione um ícone"}
                </Text>
            </Pressable>

            { mostrarOpcoes && <View style={styles.optionsContainer}>
                <BottomSheetFlatList
                    data={data}
                    keyExtractor={(item) => item.nome}
                    contentContainerStyle={{
                        alignItems: 'center',
                        gap: spacing.small
                    }}
                    renderItem={({ item, index }) => (
                        <Pressable style={[styles.option]} key={index} onPress={() => {
                            onSelect(index);
                            setMostrarOpcoes(false);  
                        }}>
                            <View style={styles.optionIcon}>
                                <Image source={{uri: item.caminho}} style={{
                                    height: '66%',
                                    width: '66%',
                                    objectFit: 'contain',
                                }} />
                            </View>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#6C83A1',
                                lineHeight: 9 * scale,
                            }}>{item.nome}</Text>
                        </Pressable> 
                    )}
                />
            </View> }
        </View>
    )
};

export default IconSelector;

const dynamicStyles = (width, height, spacing, colors, fonts, scale) => StyleSheet.create({
    container: {
        gap: spacing.medium,
    },

    select: {
        width: '100%',
        height: spacing.large,
        padding: 0.008 * height,
        fontFamily: fonts.medium,
        backgroundColor: colors.white,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: colors.text.primary,
        justifyContent: 'center',
        position: 'relative',
        zIndex: 100,
    },

   optionsContainer: {
        width: '100%',
        height: 0.175 * height,
        padding: spacing.small,
        backgroundColor: colors.white,
        borderRadius: 0.01 * height,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        overflow: 'hidden',
    }, 

    option: {
        height: (0.175 * height - 2 * (0.0245 * height)) / 3, 
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 0.01 * height,
        flexDirection: 'row',
        gap: spacing.small / 2,
        alignItems: 'center',
        paddingLeft: spacing.small / 2,
    },

    optionIcon: {
        height: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});