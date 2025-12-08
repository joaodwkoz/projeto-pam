import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) =>
StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#F0F4F7',
        padding: 0.0889 * width,
        gap: 0.0444 * width,
        position: 'relative',
    },

    header: {
        width: '100%',
        height: 0.046 * height,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    headerBtn: {
        height: '100%',
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    sectionHeaderCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        padding: 0.0444 * width,
        gap: 0.0222 * width,
    },

    vacinaItem: {
        width: '100%',
        backgroundColor: '#fafafa',
        borderRadius: 0.02 * width,
        padding: 0.0333 * width,
    },

    separator: {
        width: '100%',
        height: 0.0222 * width,
    },
});
