import { StyleSheet, View, Text, useWindowDimensions, Pressable, PixelRatio } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons, Octicons, MaterialIcons } from '@expo/vector-icons';

const getColors = (type) => {
    const map = {
        success: {
            bg: '#f2fcf2ff',
            color: '#96d689ff',
            close: '#476947ff',
        },

        info: {
            bg: '#eaf0ffff',
            color: '#9db5f5ff',
            close: '#344655ff',
        },

        warning: {
            bg: '#fff9deff',
            color: '#f5e19dff',
            close: '#9b831cff',
        },

        error: {
            bg: '#ffeaeaff',
            color: '#f59d9dff',
            close: '#9b1c1cff',
        },
    }

    return map[type];
};

const getIcon = (type) => {
    const map = {
        success: {
            lib: Octicons,
            name: "check-circle",
        },

        info: {
            lib: MaterialIcons,
            name: "info"
        },

        warning: {
            lib: Ionicons,
            name: "warning"
        },

        error: {
            lib: MaterialIcons,
            name: "error"
        }
    }

    return map[type];
}

export const AlertItem = ({ message, type, obs, onClose, style }) => {
    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const { width, height } = useWindowDimensions();

    const colors = getColors(type);

    const icon = getIcon(type);

    const IconLib = icon.lib
    const IconName = icon.name

    const styles = dynamicStyles(width, height, colors);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={[styles.alert, style]}>
            <View style={styles.alertIcon}>
                <IconLib name={IconName} size={20} color={colors.color} />
            </View>

            <View style={styles.alertInfo}>
                <View>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        lineHeight: 10 * scale,
                        color: colors.color
                    }}>
                        { message }
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 5 * scale,
                        lineHeight: 8 * scale,
                        color: colors.color
                    }}>
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

const dynamicStyles = (width, height, colors) => StyleSheet.create({
    alert: {
        backgroundColor: colors.bg,
        width: '100%',
        height: 0.07 * height,
        borderRadius: 0.0125 * width,
        padding: 0.0222 * width,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    alertIcon: {
        paddingTop: 0.0025 * height,
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
});