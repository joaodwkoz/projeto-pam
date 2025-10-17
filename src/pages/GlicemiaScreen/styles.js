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
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    statusCardIndicator: {
        height: 0.035 * height,
        aspectRatio: 1,
        borderRadius: 9999,
        backgroundColor: '#000'
    },

    history: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    historyBtns: {
        flexDirection: 'row',
        gap: 0.0444 * width,
    },

    historyBtn: {
        height: 0.05 * height,
        aspectRatio: 1,
        backgroundColor: '#6C83A1',
        borderRadius: 0.0075 * height,
        alignItems: 'center',
        justifyContent: 'center'
    },

    historyDate: {
        gap: 0.0444 * width,
    },

    historyDateMeditions: {
        gap: 0.0444 * width,
    },

    historyDateMedition: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        height: 0.1 * height,
        borderRadius: 0.025 * width,
        padding: 0.0333 * width,
    },

    meditionInfo: {
        gap: 0.0222 * width,
    },

    meditionInfoValue: {
        flexDirection: 'row',
        gap: 0.0222 * width,
        alignItems: 'center',
    },

    meditionIndicator: {
        height: 0.03 * height,
        aspectRatio: 1,
        borderRadius: 9999,
        backgroundColor: '#000'
    },

    meditionModalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    meditionModalWrapper: {
        width: '82%',
        height: '45%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        gap: 0.0222 * width,
    },

    meditionModalInput: {
        gap: 0.0222 * width,
    },

    meditionModalChipInput: {
        flexDirection: 'row',
        gap: 0.0222 * width,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    meditionModalChipInputOption: {
        padding: 0.0222 * width,
        backgroundColor: '#f0f0f0',
        borderRadius: 0.0125 * width,
    },

    meditionModalDatePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width
    },

    meditionModalTimePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
        justifyContent: 'center'
    },

    meditionModalActions: {
        width: '100%',
        height: 0.06 * height,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    meditionModalBtn: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 0.0125 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },
});