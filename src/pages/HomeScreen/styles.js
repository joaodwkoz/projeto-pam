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
        height: 0.1151 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0444 * width,
        padding: 0.0444 * width,
    },

    user: {
        height: '100%',
        flexDirection: 'row',
        gap: 0.0222 * width,
        position: 'relative'
    },

    userImg: {
        height: '100%',
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    userImgOptions: {
        position: 'absolute',
        width: 0.3 * width,
        height: 0.1 * height,
        padding: 0.0222 * width,
        borderRadius: 0.0222 * width,
        top: '15%',
        left: '7%',
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

    userInfo: {
        height: '100%',
        justifyContent: 'center',
    },

    apps: {
        gap: 0.0444 * width,
    },

    appsHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    
    appsContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: 0.0889 * width,
    },

    mainApp: {
        width: 0.3806 * width,
        height: 0.1637 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0444 * width,
        alignItems: 'center',
        justifyContent: 'center'
    },

    otherApps: {
        gap: 0.0889 * width,
    },

    app: {
        width: 0.3528 * width,
        height: 0.0614 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0333 * width
    },

    navbar: {
        width: width - 0.0889 * 2 * width,
        height: 0.1 * height,
        padding: 0.0444 * width,
        position: 'absolute',
        bottom: 0.0889 * width,
        left: 0.0889 * width,
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 0.0444 * width,
        borderRadius: 9999
    },

    navbarApp: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 9999,
    },
});