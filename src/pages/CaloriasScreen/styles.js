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

    listItem: {
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
    },

    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        width: '75%',
        borderRadius: 0.05 * width,
        padding: 0.0444 * width,
        backgroundColor: '#597497',
        gap: 0.0444 * width,
    },

    searchFood: {
        gap: 0.0444 * width,
    },
    
    options: {
        width: 0.75 * width - 0.0444 * width * 2,
        height: 0.1525 * height,
        position: 'absolute',
        left: 0 * width,
        top: 0.115 * height,
        backgroundColor: '#324156',
        borderRadius: 0.015 * width,
        zIndex: 9999,
        padding: 0.0222 * width,
    },

    option: {
        width: '100%',
        height: ((0.1525 * height - 0.0222 * width * 2) - 3 * 0.002 * height) / 4,
        justifyContent: 'center',
    },

    optionsSeparator: {
        width: '100%',
        height: 0.002 * height,
        backgroundColor: '#293445',
        borderRadius: 0.001 * height,
    },

    portionCount: {
        gap: 0.0444 * width,
    },

    portionCounter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    
    portionCounterBtn: {
        height: 0.045 * height,
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#354E70',
    },

    total: {
        height: 0.045 * height,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    totalCal: {
        width: '32.5%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2B3F59',
        borderRadius: 0.015 * width,
    },

    actions: {
        height: 0.06 * height,
        width: '100%',
        flexDirection: 'row',
        gap: 0.0444 * width,
        alignItems: 'center',
    },

    btn: {
        flex: 1,
        height: '100%',
        borderRadius: 0.015 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },
});