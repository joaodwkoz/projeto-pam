import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) =>
StyleSheet.create({
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
        position: 'relative',
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

    notifications: {
        // placeholder pra futuros ícones/sino
    },

    apps: {
        gap: 0.0444 * width,
    },

    appsHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    appsContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0.0222 * width,
    },

    // 3 por linha, considerando padding do container e gap entre eles
    appSquare: {
        width:
            (width -
                0.0889 * 2 * width - // padding horizontal total
                0.0222 * 2 * width) / // 2 gaps entre 3 itens
            3,
        height: 0.09 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0333 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    targets: {
        gap: 0.0222 * width,
    },

    targetsHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        borderRadius: 9999,
    },

    navbarAppSelected: {
        flex: 2,
        backgroundColor: '#bbcce4bf',
        borderRadius: 9999,
    },

    navbarApp: {
        flex: 1,
        backgroundColor: '#bbcce4bf',
        borderRadius: 9999,
    },
});
