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

    myAllergies: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    addAllergy: {
        height: 0.04 * height,
        width: '35%',
        backgroundColor: '#6C83A1',
        borderRadius: 0.0075 * height,
        alignItems: 'center',
        justifyContent: 'center'
    },

    allergy: {
        width: '100%',
        height: 0.1 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0195 * height,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0.0444 * width,
    },

    allergyInfo: {
        flexDirection: 'row',
        gap: 0.0444 * width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    reactions: {
        width: '100%',
        height: 0.05 * height,
        gap: 0.0444 * width,
        flexDirection: 'row',
    },

    reactionsBtns: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0125 * height,
    },

    allergyModalContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    allergyModal: {
        width: '80%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        gap: 0.0222 * height,
    },

    allergyModalInput: {
        gap: 0.0222 * height,
    },

    allergyModalSelect: {
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
        zIndex: 110,
    },

    allergyModalOptionsContainer: {
        position: 'absolute',
        top: '115%',
        width: '100%',
        height: 0.15 * height,
        padding: 0.0222 * width,
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        zIndex: 110,
        borderColor: '#eee',
        borderWidth: 0.002 * height,
        borderRadius: 0.01 * height,
        overflow: 'hidden',
    },

    allergyModalOption: {
        width: '100%',
        height: (0.15 * height - 0.0888 * width) / 3,
        backgroundColor: '#fafafa',
        borderRadius: 0.0125 * width,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 0.0111 * width,
        gap: 0.0111 * width,
    },

    allergyModalRadioBtns: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    allergyModalRadioBtn: {
        flexDirection: 'row',
        gap: 0.0222 * width,
        alignItems: 'center'
    },

    circle: {
        width: 0.05 * width,
        aspectRatio: 1,
        borderRadius: 9999,
        borderWidth: 0.005 * width,
        borderColor: '#000',
    },

    allergyModalChipInput: {
        width: '100%',
        height: 0.0444 * height,
        alignItems: 'center',
        position: 'relative',
        zIndex: 100,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    allergyModalAddReactionBtn: {
        height: '100%',
        aspectRatio: 1,
        backgroundColor: '#6C83A1',
        borderRadius: 0.0125 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    allergyModalReactionsContainer: {
        width: '100%',
        maxHeight: 0.15 * height,
    },

    allergyModalReaction: {
        width: '100%',
        height: (0.15 * height - 0.0444 * width) / 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f0f0f0',
        borderRadius: 0.0075 * width,
        padding: 0.0222 * width,
    },

    allergyModalActions: {
        width: '100%',
        height: 0.05 * height,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    allergyModalBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0125 * width,
        backgroundColor: '#f0f0f0'
    },
});