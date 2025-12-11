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

    status: {
        width: '100%',
        height: 0.125 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0195 * height,
        justifyContent: 'center',
        padding: 0.0666 * width,
    },

    statusCard: {
        flexDirection: 'row',
        gap: 0.0444 * width,
        alignItems: 'center'
    },

    myRemedies: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    addRemedy: {
        height: 0.04 * height,
        width: '35%',
        backgroundColor: '#6C83A1',
        borderRadius: 0.0075 * height,
        alignItems: 'center',
        justifyContent: 'center'
    },

    remedy: {
        width: '100%',
        height: 0.1 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0195 * height,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0.0444 * width,
    },

    remedyInfo: {
        flexDirection: 'row',
        gap: 0.03 * width,
        alignItems: 'center',
        flex: 1
    },

    iconContainer: {
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.03,
        alignItems: 'center',
        justifyContent: 'center',
    },

    remedyModalContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalBackdrop: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    remedyModal: {
        width: '82%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        gap: 0.0222 * height,
    },

    remedyModalInput: {
        gap: 0.01 * height,
        position: 'relative',
        zIndex: 10
    },

    textInputStyle: {
        width: '100%',
        height: 0.0444 * height,
        padding: 0.008 * height,
        fontFamily: 'Poppins-M',
        fontSize: 0.015 * height,
        lineHeight: 0.02 * height,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: '#6C83A1',
    },

    remedyModalSelect: {
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
    },

    remedyModalOptionsContainer: {
        position: 'absolute',
        bottom: '110%', 
        left: 0,
        width: '100%',
        padding: 0.0222 * width,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        zIndex: 100, 
    },

    remedyModalOption: {
        width: '100%',
        height: 0.045 * height,
        backgroundColor: '#fafafa',
        borderRadius: 0.0125 * width,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0.0222 * width,
        gap: 0.0222 * width,
    },

    remedyModalActions: {
        width: '100%',
        height: 0.05 * height,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    remedyModalBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0125 * width,
        backgroundColor: '#f0f0f0'
    },

    helpModal: {
        width: '82%',
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
});