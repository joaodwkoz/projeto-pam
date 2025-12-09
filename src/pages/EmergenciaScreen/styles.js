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

    location: {
        gap: 0.0222 * width,
    },

    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    locationView: {
        width: '100%',
        height: 0.13 * height,
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        gap: 0.0222 * width,
        padding: 0.0222 * width,
    },

    locationAdress: {
        gap: 0.0111 * width,
    },

    locationInfo: {
        flex: 1,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    locationPrecision: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    locationAction: {
        backgroundColor: '#6C83A1',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0125 * width,
    },

    publicServices: {
        gap: 0.0222 * width,
    },

    services: {
        gap: 0.0222 * width,
    },

    serviceRow: {
        width: '100%',
        height: 0.1 * height,
        borderRadius: 0.025 * width,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    service: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0.0222 * width,
    },

    emmergencyContacts: {
        gap: 0.0222 * width,
        flex: 1,
    },

    contactList: {
        width: '100%',
        flex: 1,
    },

    contactListAction: {
        width: '100%',
        height: 0.06 * height,
        backgroundColor: '#6C83A1',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0125 * width,
    },

    contact: {
        width: '100%',
        height: 0.1 * height,
        backgroundColor: '#fff',
        borderRadius: 0.0175 * width,
        padding: 0.0222 * width,
        gap: 0.0222 * width,
    },

    contactActions: {
        flex: 1,
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    contactAction: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.0222 * width,
        flexDirection: 'row',
        backgroundColor: '#6C83A1',
        borderRadius: 0.0125 * width,
    },

    contactForm: {
        width: '100%',
        gap: 0.0222 * width,
    },

    contactFormGroup: {
        width: '100%',
        gap: 0.0111 * width,
    },

    contactFormAction: {
        width: '100%',
        height: 0.05 * height,
        backgroundColor: '#6C83A1',
        borderRadius: 0.0175 * width,
        alignItems: 'center',
        justifyContent: 'center',
    },

    contactCrud: {
        height: '100%',
        alignItems: 'center',
        gap: 0.0222 * width,
        flexDirection: 'row',
    },
});