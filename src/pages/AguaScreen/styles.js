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
        padding: 0.0111 * width,
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

    consumption: {
        width: width * 0.75,
        height: '51%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center', 
    },

    cupBtns: {
        width: '100%',
        height: 0.0555 * height,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    cupBtn: {
        height: '100%',
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
        aspectRatio: 2.5, 
        backgroundColor: '#839dbeff',
        borderRadius: 0.025 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalContainer: {
        flex: 1,
        backgroundColor: '#00000080',
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    modalBackdrop: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        width: '82%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        gap: 0.0222 * width,
    },

    helpModal: {
        width: '82%',
        maxHeight: '60%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        gap: 0.0222 * height, 
    },

    helpSection: {
        width: '100%',
        gap: 0.01 * height,
    },

    modalInput: {
        width: '100%',
        gap: 0.0222 * width,
    },

    modalSelect: {
        width: '100%',
        gap: 0.0222 * width,
        position: 'relative',
        zIndex: 10,
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
        textAlign: 'left',
    },

    select: {
        width: '100%',
        height: 0.0444 * height,
        padding: 0.02 * width,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    optionsContainer: {
        position: 'absolute',
        top: '115%',
        left: 0,
        width: '100%',
        height: 0.2 * height,
        padding: 0.0222 * width,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        zIndex: 9999,
        overflow: 'hidden',
    },

    optionsContainerUp: {
        position: 'absolute',
        bottom: '110%',
        left: 0,
        width: '100%',
        padding: 0.0222 * width,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        zIndex: 9999,
        overflow: 'hidden',
    },

    option: {
        width: '100%',
        height: 0.04 * height,
        backgroundColor: '#fafafa',
        borderRadius: 0.01 * height,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 0.02 * width,
        gap: 0.02 * width,
    },

    optionIcon: {
        height: '80%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 0.0075 * height,
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
        borderRadius: 0.0075 * height,
    },

    modalBtn: {
        flex: 1,
        width: '100%',
        maxHeight: 0.05 * height,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0125 * width,
        backgroundColor: '#f0f0f0',
        marginTop: 0.0222 * height
    },
});