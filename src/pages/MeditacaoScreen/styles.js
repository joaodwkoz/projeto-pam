import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) =>
  StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#F0F4F7',
        padding: 0.0889 * width,
        gap: 0.0444 * width,
        position: 'relative',
        paddingBottom: 0.2222 * width, // respiro pro player
    },

    header: {
        width: '100%',
        height: 0.046 * height,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    headerBtn: {
        height: '100%',
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    musics: {
        gap: 0.0222 * width,
    },

    /* LISTA DE MÚSICAS */

    musicList: {
        width: '100%',
        gap: 0.0222 * width,
    },

    musicItem: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 0.0333 * width,
        paddingVertical: 0.0222 * width,
        backgroundColor: '#FFFFFF',
        borderRadius: 0.0222 * width,
    },

    musicLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    musicPlayCircle: {
        width: 0.0889 * width,
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        backgroundColor: '#F0F4F7',
        alignItems: 'center',
        justifyContent: 'center',
    },

    musicTexts: {
        flexDirection: 'column',
        gap: 0.0044 * width,
    },

    /* PLAYER INFERIOR */

    playerWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 0.0889 * width,
        paddingTop: 0.0222 * width,
        paddingBottom: 0.0666 * width,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 0.0444 * width,
        borderTopRightRadius: 0.0444 * width,
        gap: 0.0222 * width,
    },

    playerChevron: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    playerInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    playerTexts: {
        flexDirection: 'column',
        gap: 0.0044 * width,
    },

    playerControlsRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    playerMainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0444 * width,
    },

    playerPlayBtn: {
        width: 0.1222 * width,
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        backgroundColor: '#97B9E5',
        alignItems: 'center',
        justifyContent: 'center',
    },

    playerSmallBtn: {
        width: 0.0777 * width,
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },

    playerModeBtn: {
        width: 0.0777 * width,
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
});