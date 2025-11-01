import { StyleSheet, View, Text, Pressable, PixelRatio } from 'react-native';
import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export const AlertItem = ({ message, type, obs, onClose, style }) => {
    const scale = PixelRatio.get();

    const { alerts, spacing, fonts, width, height } = useTheme();

    const colors = useMemo(() => {
        return alerts[type];
    }, [type]);

    const icon = useMemo(() => {
        return alerts[type].icon;
    }, [type]);

    const { name: IconName, lib: IconLib, color: IconColor } = icon;

    const styles = useMemo(() => dynamicStyles(width, height, colors, fonts, spacing, scale), [width, height, colors, spacing, scale]);

    return (
        <View style={[styles.alert, style]}>
            <View style={styles.alertIcon}>
                <IconLib name={IconName} size={20} color={IconColor} />
            </View>

            <View style={styles.alertInfo}>
                <View>
                    <Text style={styles.messageText}>
                        { message }
                    </Text>

                    <Text style={styles.messageType}>
                        { obs }
                    </Text>
                </View>

                <Pressable style={styles.close} onPress={onClose}>
                    <Ionicons name="close" size={24} color={colors.close} />
                </Pressable>
            </View>
        </View>
    )
};

const dynamicStyles = (width, height, colors, fonts, spacing, scale) => StyleSheet.create({
    alert: {
        backgroundColor: colors.bg,
        width: '100%',
        height: 0.07 * height,
        borderRadius: 0.0125 * width,
        padding: 0.0222 * width,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.medium,
    },

    alertInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    close: {
        height: '100%',
        justifyContent: 'center',
    },

    messageText: {
        fontFamily: fonts.medium,
        fontSize: 7 * scale,
        lineHeight: 10 * scale,
        color: colors.text
    },
    
    messageType: {
        fontFamily: fonts.medium,
        fontSize: 5 * scale,
        lineHeight: 8 * scale,
        color: colors.text
    }
});