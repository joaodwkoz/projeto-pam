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

    fruitOfTheDay: {
        gap: 0.0222 * width,
    },

    fruitIndicator: {
        position: 'absolute',
        left: 0.0222 * width,
        top: 0.0222 * width,
        height: 0.04 * height,
        aspectRatio: 1 / 1,
        backgroundColor: '#6C83A1',
        borderRadius: 0.0125 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    fruitContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        position: 'relative',
        gap: 0.0222 * width,
        padding: 0.0333 * width,
        alignItems: 'center',
    },

    fruitMetrics: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 0.0222 * width,
    },

    fruitMetric: {
        backgroundColor: '#6C83A1',
        borderRadius: 0.0125 * width,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.015 * width,
        padding: 0.015 * width,
    },

    fruitItem: {
        width: '100%',
        borderRadius: 0.025 * width,
        backgroundColor: '#fff',
        padding: 0.0222 * width,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    fruitItemInfo: {
        flex: 1,
        gap: 0.0222 * width,
    },

    fruitItemHeader: {
        height: 0.03 * height,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    fruitItemIndicator: {
        height: '100%',
        aspectRatio: 1 / 1,
        backgroundColor: '#6C83A1',
        borderRadius: 0.00625 * width,
        alignItems: 'center',
        justifyContent: 'center'
    },

    fruitItemDetails: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 0.0222 * width,
    },

    fruitItemMetric: {
        backgroundColor: '#f0f0f0',
        borderRadius: 0.0125 * width,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.015 * width,
        padding: 0.015 * width,
    },

    fruitDetails: {
        width: '100%',
        gap: 0.0222 * width,
    },

    fruitNutrition: {
        width: '100%',
        gap: 0.0222 * width,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },

    fruitNutritionItem: {
        width: ((width - 0.0888 * width) - 0.0444 * width) / 3,
        gap: 0.0222 * width,
    },

    fruitNutritionView: {
        height: 0.05 * height,
        borderRadius: 0.0125 * width,
        backgroundColor: '#fff',
        borderColor: '#d9e2eeff',
        borderWidth: 0.0075 * width,
        justifyContent: 'center',
        padding: 0.0222 * width,
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