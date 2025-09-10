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

    signupForm: {
        position: 'absolute',
        width: width,
        bottom: 0,
        left: 0,
        gap: 0.0444 * width,
        backgroundColor: '#fff',
        padding: 0.0889 * width,
        borderTopLeftRadius: 0.0889 * width,
        borderTopRightRadius: 0.0889 * width,
    },
    
    input: {
        width: '100%',
        height: 0.0614 * height,
        borderColor: '#9FBBE0',
        borderWidth: 0.0015 * height,
        borderRadius: 0.1 * height,
        padding: 0.0222 * width,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    inputGroup: {
        flexDirection: 'row',
        gap: 0.0666 * width,
    },

    inputIcon: {
        height: '100%',
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center' 
    },

    inputExtra: {
        height: '100%',
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center' 
    },

    inputArea: {
        flex: 1,
        height: '100%',
        justifyContent: 'center'
    },

    signupBtn: {
        width: '100%',
        height: 0.0614 * height,
        backgroundColor: '#ADCBF3',
        borderRadius: 0.1 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },

    accountOptions: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    orLoginWith: {
        width: '100%',
        alignItems: 'center',
        gap: 0.0666 * width,
    },

    orLoginWithBtns: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    orLoginWithBtn: {
        width: '45%',
        height: 0.0614 * height,
        borderRadius: 0.1 * height,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#6C83A1',
        borderWidth: 0.0015 * height,
        borderRadius: 0.1 * height,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },
});