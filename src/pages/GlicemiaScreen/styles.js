import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height) => StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        padding: 0.0889 * width,
        gap: 0.0444 * width,
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

    headerSection: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    graphViewBtn: {
        width: '12.5%',
        aspectRatio: 1 / 1,
        backgroundColor: '#6C83A1',
        borderRadius: 0.02 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    resumeSection: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 0.0444 * width,
    },

    resumeCard: {
        width: (0.82219 * width - 0.0444 * width) / 2,
        height: 0.085 * height,
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0.0222 * width,
    },

    resumeCardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    historyOptions: {
        width: '100%',
        flexDirection: 'row',
        gap: 0.0222 * width,
        alignItems: 'center',
    },

    historyOption: {
        padding: 0.0125 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0125 * width,
    },

    history: {
        flex: 1,
        width: '100%',
        gap: 0.0444 * width,
    },

    historyItem: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 0.0333 * width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 0.0125 * width,
    },

    historyItemInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    fab: {
        position: 'absolute',
        height: 0.06 * height,
        aspectRatio: 1 / 1,
        backgroundColor: '#6C83A1',
        borderRadius: 0.0125 * width,
        bottom: 0.0889 * width,
        right: 0.0889 * width,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },

    modalInput: {
        width: '100%',
        gap: 0.0444 * width,
    },

    modalDateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.0222 * width,
    },

    modalTimeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
        justifyContent: 'center',
    },

    modalChipInput: {
        flexDirection: 'row',
        gap: 0.0222 * width,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    modalChipInputOption: {
        padding: 0.025 * width,
        backgroundColor: '#f0f0f0',
        borderRadius: 0.0125 * width,
    },

    bottomSheetInput: {
        width: '100%',
        height: 0.05 * height,
        padding: 0.008 * height,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: '#6C83A1',
    },

    dateInput: {
        width: '15%',
        height: 0.05 * height,
        padding: 0.008 * height,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: '#6C83A1',
        textAlign: 'center',
    },

    yearInput: {
        width: '20%',
        height: 0.05 * height,
        padding: 0.008 * height,
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        color: '#6C83A1',
        textAlign: 'center',
    },

    saveBtn: {
        width: '100%',
        height: 0.0625 * height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6C83A1',
        borderRadius: 0.1 * width,
    },

    modalBackdrop: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    helpModal: {
        width: '82%',
        maxHeight: '60%',
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