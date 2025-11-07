import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height, colors, spacing, scale) => StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: colors.bg,
        padding: spacing.app * width,
        gap: spacing.large * width,
        position: 'relative',
    },

    header: {
        width: '100%',
        height: 0.046 * height,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    headerBtn: {
        height: '100%',
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },

    widgets: {
        width: '100%',
        height: 0.0921 * height,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    
    widgets: {
        width: '100%',
        height: 0.0921 * height,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    widget: {
        width: 0.3889 * width,
        height: '100%',
        borderRadius: 0.0222 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    consumption: {
        width: width * 0.75,
        height: '51%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    cups: {
        width: '100%',
    },

    cup: {
        width: 0.1722 * width,
        gap: 0.0444 * width,
        alignItems: 'center',
    },

    cupBox: {
        width: '100%',
        aspectRatio: 1 / 1,
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cupCapacity: {
        width: '75%',
        aspectRatio: '5 / 2',
        backgroundColor: '#839dbeff',
        borderRadius: 0.025 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        width: '82%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * height,
        gap: 0.0222 * width,
    },

    modalInput: {
        gap: 0.0222 * width,
    },
});