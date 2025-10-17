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

    addCup: {
        width: '100%',
        alignItems: 'flex-end',
    },

    addCupBtn: {
        height: 0.0555 * height,
        aspectRatio: 1 / 1,
        backgroundColor: '#6C83A1',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.02 * width,
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

    modalSelect: {
        gap: 0.0222 * width,
    },

    select: {
        width: '100%',
        height: 0.0444 * height,
        padding: 0.008 * height,
        fontFamily: 'Poppins-M',
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: '#6C83A1',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 100,
    },

    optionsContainer: {
        width: '100%',
        height: 0.175 * height,
        position: 'absolute',
        left: 0,
        right: 0,
        top: '115%',
        padding: 0.0111 * height,
        backgroundColor: '#fff',
        borderRadius: 0.01 * height,
        zIndex: 9999,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        overflow: 'hidden',
    },

    option: {
        height: (0.175 * height - 2 * (0.0245 * height)) / 3, 
        width: '100%',
        backgroundColor: '#fafafa',
        borderRadius: 0.01 * height,
        flexDirection: 'row',
        gap: 0.0055 * height,
        alignItems: 'center',
        paddingLeft: 0.0055 * height,
    },

    optionIcon: {
        height: '100%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    actions: {
        width: '100%',
        height: 0.0555 * height,
        flexDirection: 'row',
        gap: 0.0111 * height,
    },

    actionsBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: 0.0075 * height,
    },
});