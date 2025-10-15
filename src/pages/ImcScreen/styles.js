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

    result: {
        width: '100%',
        height: 0.29 * height,
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        padding: 0.0222 * height,
    },

    resultInfo: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'flex-end',
    },

    wheelInput: {
        width: '100%',
        gap: 0.0444 * width,
    },

    wheel: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },

    actions: {
        width: '100%',
        height:  0.0675 * height,
        flexDirection: 'row',
        gap: 0.0444 * width,
    },

    btn: {
        flex: 1,
        borderRadius: 0.0075 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },
});