import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) => StyleSheet.create({
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

    history: {
        gap: 0.0444 * width,
    },

    historyCard: {
        width: '100%',
        height: 0.125 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0195 * height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0.0666 * width,
    },

    historyCardInfo: {
        width: '80%',
        gap: 0.0222 * width,
    },

    historyCardBtn: {
        width: '20%',
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        backgroundColor: '#CAD8EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
});