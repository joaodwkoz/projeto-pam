import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) => StyleSheet.create({
    container: {
        width: '100%',
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

    headerTitle: {
        width: 'auto',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerTextBtn: {
        width: 'auto',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    editProfile: {
        width: '100%',
        gap: 0.0444 * width,
    },

    editUserImg: {
        width: '100%',
        gap: 0.0444 * width,
        alignItems: 'center'
    },

    userImg: {
        width: '100%',
        height: 0.125 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },

    editImgBtn: {
        width: '40%',
        height: 0.05 * height,
        backgroundColor: '#fefefe',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.01 * height,
    },

    editProfileBody: {
        gap: 0.0222 * width,
    },

    editInfo: {
        gap: 0.0222 * width,
    },

    editInputs: {
        gap: 0.0222 * width,
    },

    editInput: {
        gap: 0.0222 * width,
    },

    editBtn: {
        width: '100%',
        height: 0.0614 * height,
        backgroundColor: '#ADCBF3',
        borderRadius: 0.1 * height,
        alignItems: 'center',
        justifyContent: 'center',
    },

    userImgOptions: {
        position: 'absolute',
        width: 0.3 * width,
        height: 0.1 * height,
        padding: 0.0222 * width,
        borderRadius: 0.0222 * width,
        top: '15.4%',
        left: '83.5%',
        backgroundColor: '#fefefe',
        zIndex: 100,
        gap: 0.0222 * width,
    },

    userImgOption: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 0.01 * width,
    },
});