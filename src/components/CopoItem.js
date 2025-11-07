import { View, StyleSheet, Pressable, Image, Text } from 'react-native';
import { useState, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { BASE_URL_STORAGE } from '../constants/api';

const CopoItem = ({ nome, capacidade, icone = null, onPress, onLongPress }) => {
    const { colors, fonts, spacing, width, height, scale } = useTheme();

    const styles = useMemo(() => dynamicStyles(width, height, colors, fonts, spacing, scale), [width, height, colors, fonts, spacing, scale])

    return (
        <View style={styles.cup}>
            <Pressable style={styles.cupBox}>
                <Image source={{uri: icone?.caminhoFoto 
                    ? BASE_URL_STORAGE + icone.caminhoFoto 
                    : null}} style={{
                        height: '66%',
                        width: '66%',
                        objectFit: 'contain',
                    }} 
                />

                <View style={styles.cupCapacity}>
                    <Text style={styles.capacityText}>{capacidade}</Text>
                </View>
            </Pressable>
        </View>
    )
}

export default CopoItem;

const dynamicStyles = (width, height, colors, fonts, spacing, scale) => StyleSheet.create({
    cup: {
        width: 0.1722 * width,
        gap: spacing.large,
        alignItems: 'center',
    },

    cupBox: {
        width: '100%',
        aspectRatio: 1 / 1,
        backgroundColor: colors.white,
        borderRadius: 0.025 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cupCapacity: {
        width: '75%',
        aspectRatio: 5 / 2,
        backgroundColor: colors.text.secondary,
        borderRadius: 0.025 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },

    capacityText: {
        fontFamily: fonts.medium,
        fontSize: 6 * scale,
        color: colors.text.primary,
        lineHeight: 6.6 * scale,
    },
});