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

    menuOptions: {
        position: 'absolute',
        width: 0.35 * width,
        padding: 0.0222 * width,
        borderRadius: 0.0175 * width,
        top: 0.06 * height, 
        right: 0.0889 * width,
        backgroundColor: '#fefefe',
        zIndex: 100,
        gap: 0.0111 * width,
    },

    menuOption: {
        flex: 1,
        width: '100%',
        paddingVertical: 0.01 * height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 0.0111 * width,
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

    listFoodItem: {
        paddingVertical: 0.002 * height,
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
        backgroundColor: '#00000080',
    },

    modal: {
        width: '82%',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        backgroundColor: '#fefefe',
        gap: 0.0444 * width,
    },
    
    modalBackdrop: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    helpModal: {
        width: '82%',
        maxHeight: '60%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        alignItems: 'center',
        gap: 0.0222 * height, 
    },

    helpSection: {
        width: '100%',
        gap: 0.01 * height,
    },
    
    searchFood: {
        gap: 0.0444 * width,
    },
    
    textInput: {
        width: '100%',
        height: 0.0444 * height,
        padding: 0.01 * width,
        fontFamily: 'Poppins-M',
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: '#6C83A1',
    },

    options: {
        width: '100%',
        height: 0.235 * height,
        backgroundColor: '#fff',
        borderRadius: 0.015 * width,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        zIndex: 100,
        padding: 0.0222 * width,
    },

    option: {
        width: '100%',
        paddingTop: 0.01 * height,
        gap: 0.01 * height,
    },

    optionPressable: {
        height: 'auto',
        justifyContent: 'center',
    },

    optionsSeparator: {
        width: '100%',
        height: 0.002 * height,
        backgroundColor: '#eee',
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
        backgroundColor: '#6C83A1',
    },

    portionInput: {
        width: '40%',
        height: 0.045 * height,
        padding: 0.01 * width,
        fontFamily: 'Poppins-M',
        backgroundColor: '#fff',
        borderRadius: 0.015 * width,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        color: '#6C83A1',
        textAlign: 'center'
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
        backgroundColor: '#6C83A1',
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
    
    modalInput: {
        width: '100%',
        gap: 0.0222 * width,
    },
});