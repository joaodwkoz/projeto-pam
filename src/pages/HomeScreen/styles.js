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
        justifyContent: 'center'
    },

    user: {
        height: '100%',
        flexDirection: 'row',
        gap: 0.0222 * width,
        alignItems: 'center',
    },

    userImg: {
        height: '85%',
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    userInfo: {
        justifyContent: 'center',
    },

    userImgOptions: {
        position: 'absolute',
        width: 0.35 * width,
        height: 0.11 * height,
        padding: 0.0222 * width,
        borderRadius: 0.0175 * width,
        top: 0.135 * height,
        left: 0.0889 * width,
        backgroundColor: '#fefefe',
        zIndex: 100,
        gap: 0.0111 * width,
    },

    userImgOption: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        borderRadius: 0.0111 * width,
    },

    sectionContainer: {
        width: '100%',
    },

    featuredGrid: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 0.0444 * width,
    },

    featuredCard: {
        flex: 1,
        height: 0.15 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0175 * width,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0.0222 * width,
        gap: 0.0222 * width,
    },

    featuredIcon: {
        flex: 1,
        aspectRatio: 1 / 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    featuredIconCircle: {
        width: '80%',
        aspectRatio: 1 / 1,
        borderRadius: 9999,
        backgroundColor: '#F0F4F7',
        alignItems: 'center',
        justifyContent: 'center',
    },

    listContainer: {
        flex: 1,
        width: '100%',
    },

    scrollView: {
        width: '100%',
        flex: 1,
    },

    scrollContent: {
        gap: 0.0444 * width,
        paddingBottom: 0.0444 * width,
    },

    appCard: {
        width: '100%',
        height: 0.09 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0175 * width,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 0.0444 * width,
        gap: 0.0444 * width,
    },

    listIconCircle: {
        width: width * 0.12,
        height: width * 0.12,
        borderRadius: 9999,
        backgroundColor: '#F0F4F7',
        alignItems: 'center',
        justifyContent: 'center',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
});