import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) => StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#F0F4F7',
        padding: 0.0889 * width,
        gap: 0.0444 * width,
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

    meal: {
        width: '100%',
        gap: 0.0444 * width,
    },

    mealHeader: {
        width: '100%',
        height: 0.1 * width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    mealIdentity: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    calCounter: {
        height: 0.05 * width,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    counter: {
        height: '100%',
        aspectRatio: 2 / 1,
        backgroundColor: '#607DA3',
        borderRadius: 0.0055556 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addFoodBtn: {
        height: 0.0358 * height,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    listStyle: {
        height: '100%',
        width: 0.00833333 * width,
        backgroundColor: '#607DA3',
        borderRadius: 0.0025 * width,
    }
});