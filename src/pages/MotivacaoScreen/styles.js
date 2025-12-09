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

    advice: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        padding: 0.0222 * height,
        gap: 0.0222 * width,
        alignItems: 'flex-end'
    },

    actions: {
        width: '100%',
        height: 0.05 * height,
        backgroundColor: '#fafafa',
        borderRadius: 0.0125 * width,
        gap: 0.0222 * width,
        flexDirection: 'row',
    },

    action: {
        flex: 1,
        backgroundColor: '#fafafa',
        borderRadius: 0.0125 * width,
        alignItems: 'center',
        justifyContent: 'center'
    },

    categories: {
        gap: 0.0222 * width,
    },

    categoriesList: {
        width: '100%',
        height: 0.05 * height,
        flexDirection: 'row',
        gap: 0.0222 * width 
    },

    category: {
        flex: 1,
        backgroundColor:'#fafafa',
        borderRadius: 0.0125 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    quickTip: {
        gap: 0.0222 * width,
    },

    quickTipContainer: {
        width: '100%',
        height: 0.1 * height,
        maxHeight: 0.2 * height,
        padding: 0.0222 * width,
        backgroundColor: '#fff',
        borderRadius: 0.0125 * width
    },
});