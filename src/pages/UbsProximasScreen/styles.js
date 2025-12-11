import { StyleSheet } from 'react-native';

export const dynamicStyles = (width, height, scale) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F7', 
        position: 'relative',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F4F7',
    },

    // --- MAPA ---
    mapContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
    },

    map: {
        width: '100%',
        height: '100%',
    },

    // --- BARRA DE BUSCA FLUTUANTE (Estilo similar ao Agua) ---
    searchContainer: {
        position: 'absolute',
        top: 0.06 * height, 
        left: 0.0444 * width,
        right: 0.0444 * width,
        zIndex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    backButton: {
        width: 0.12 * width,
        aspectRatio: 1 / 1,
        borderRadius: 0.025 * width,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        // Sem sombra
    },

    searchBar: {
        flex: 1,
        height: 0.06 * height, // Um pouco maior para acomodar a fonte
        backgroundColor: '#fff', 
        borderRadius: 0.025 * width,
        justifyContent: 'center',
        paddingHorizontal: 0.0444 * width,
    },

    // --- MODAL (Adaptado do padrão Agua) ---
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modal: {
        width: '82%',
        backgroundColor: '#fefefe',
        borderRadius: 0.025 * height,
        padding: 0.0444 * width,
        gap: 0.0222 * width,
        alignItems: 'center',
    },

    modalImage: {
        width: '100%',
        height: 0.2 * height,
        borderRadius: 0.025 * width,
        backgroundColor: '#eee',
    },

    actions: {
        width: '100%',
        height: 0.0555 * height,
        flexDirection: 'row',
        gap: 0.0111 * height,
        marginTop: 0.0111 * height,
    },

    actionsBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0.0075 * height,
    },
});