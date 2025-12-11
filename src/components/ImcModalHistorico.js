import { BlurView } from "expo-blur";
import React, { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { 
    View, 
    Pressable, 
    Modal, 
    StyleSheet, 
    Text, 
    SectionList, 
    ActivityIndicator 
} from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { LineChart } from 'react-native-gifted-charts';

const ImcModalHistorico = ({ visible, setVisible, width, height, scale = 3 }) => {
    
    const { usuario } = useContext(AuthContext);

    // --- Definição de Espaçamentos Dinâmicos ---
    const MODAL_WIDTH = 0.82 * width;
    const LABEL_WIDTH = 0.14 * width; 
    const CHART_WIDTH = MODAL_WIDTH - (0.0444 * width * 2) - LABEL_WIDTH - (0.0222 * width); 
    const CHART_HEIGHT = 0.25 * height;
    const ICON_SIZE = 0.065 * width;

    const styles = useMemo(() => dynamicStyles(width, height, scale), [width, height, scale]);

    // --- Estados ---
    const [aba, setAba] = useState('Histórico');
    const [viewMode, setViewMode] = useState('list'); 
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [history, setHistory] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Lógica de Cores IMC ---
    const getImcIndicator = (imc) => {
        if (imc < 18.5) return '#a8d0e6'; // Abaixo
        if (imc < 25) return '#b0e3c7';   // Normal
        if (imc < 30) return '#fff1a8';   // Sobrepeso
        if (imc < 35) return '#ffd3a8';   // Obesidade I
        return '#f4978e';                 // Obesidade II+
    }

    // --- Funções API ---
    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/usuario/${usuario.id}/imc/historico`); 
            setHistory(res.data.historico);
        } catch(e) {
            console.error('Erro historico IMC:', e);
        } finally {
            setIsLoading(false);
        }
    }, [usuario.id]);

    const fetchChart = useCallback(async () => {
        try {
            const res = await api.get(`/usuario/${usuario.id}/imc/grafico`); 
            setLineData(res.data.dados_grafico);
        } catch(e) {
            console.error('Erro grafico IMC:', e);
        }
    }, [usuario.id]);

    // --- Ações de Exclusão ---
    const requestDelete = (item) => {
        setSelectedItem(item);
        setViewMode('delete');
    };

    const cancelDelete = () => {
        setSelectedItem(null);
        setViewMode('list');
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        setIsDeleting(true);
        try {
            await api.delete(`/imc/${selectedItem.id}`);
            await fetchHistory();
            await fetchChart();
            setViewMode('list');
            setSelectedItem(null);
        } catch (e) {
            console.error("Erro delete IMC:", e);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (visible) { 
            fetchHistory();
            fetchChart();
            setViewMode('list');
        }
    }, [visible, fetchHistory, fetchChart]);

    return (
        <Modal transparent animationType='fade' visible={visible}>
            <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalContainer}>
                
                <View style={styles.modal}>
                    
                    {/* HEADER */}
                    <View style={styles.modalHeader}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 8.8 * scale }}>
                            {viewMode === 'delete' ? 'Excluir Registro' : 'Histórico de IMC'}
                        </Text>
                        <Pressable style={styles.closeModalBtn} onPress={() => setVisible(false)}>
                            <Ionicons name="close" size={ICON_SIZE * 0.8} color="#6C83A1" />
                        </Pressable>
                    </View>

                    <View style={styles.modalBody}>
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#6C83A1" />
                            </View>
                        ) : (
                            <>
                                {viewMode === 'list' && (
                                    <>
                                        {/* ABAS */}
                                        <View style={styles.tabSwitch}>
                                            <Pressable style={styles.tab} onPress={() => setAba('Histórico')}>
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: aba === 'Histórico' ? '#6C83A1' : '#6C83A140', lineHeight: 9 * scale }}>
                                                    Histórico
                                                </Text>
                                            </Pressable>
                                            <Pressable style={styles.tab} onPress={() => setAba('Gráficos')}>
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: aba === 'Gráficos' ? '#6C83A1' : '#6C83A140', lineHeight: 9 * scale }}>
                                                    Gráficos
                                                </Text>
                                            </Pressable>
                                            <View style={[styles.tabSwitchWrapper, { left: aba === 'Histórico' ? 0.0111 * width : (0.2 * width) + (0.0111 * width * 2) }]}></View>
                                        </View>

                                        {/* CONTEÚDO */}
                                        <View style={styles.tabContent}>
                                            {aba === 'Histórico' ? (
                                                history && history.length > 0 ? (
                                                    <SectionList
                                                        sections={history}
                                                        keyExtractor={(item, index) => `${item.id}-${index}`}
                                                        contentContainerStyle={styles.listContent}
                                                        renderItem={({ item }) => (
                                                            <View style={styles.historyItem}>
                                                                <View style={styles.historyLeftInfo}>
                                                                    {/* Indicador de Cor */}
                                                                    <View style={{
                                                                        height: 0.04 * width,
                                                                        width: 0.04 * width,
                                                                        borderRadius: 9999,
                                                                        backgroundColor: getImcIndicator(item.imc)
                                                                    }} />
                                                                    
                                                                    <View style={styles.historyItemText}>
                                                                        {/* APENAS O IMC - 1 LINHA */}
                                                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1' }}>
                                                                            {item.imc} kg/m²
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <Pressable style={styles.deleteIconBtn} onPress={() => requestDelete(item)}>
                                                                    <AntDesign name="delete" size={ICON_SIZE * 0.6} color="#6C83A1" />
                                                                </Pressable>
                                                            </View>
                                                        )}
                                                        renderSectionHeader={({ section: { title } }) => (
                                                            <View style={styles.sectionHeader}>
                                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', opacity: 0.7 }}>
                                                                    {title}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    />
                                                ) : (
                                                    <View style={styles.emptyState}>
                                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 4.7 * scale, color: '#6C83A1' }}>
                                                            Sem dados para mostrar
                                                        </Text>
                                                    </View>
                                                )
                                            ) : (
                                                // --- GRÁFICO ---
                                                lineData && lineData.length > 0 ? (
                                                    <View style={styles.chartContainer}>
                                                        <LineChart
                                                            data={lineData}
                                                            areaChart
                                                            startFillColor="#6C83A1"
                                                            endFillColor="#fff"
                                                            startOpacity={0.5}
                                                            endOpacity={0}
                                                            bezier
                                                            smoothness={0.7}
                                                            thickness={2}
                                                            yAxisColor="#6C83A1"
                                                            xAxisColor="#6C83A1"
                                                            xAxisThickness={1}
                                                            yAxisThickness={1}
                                                            color="#6C83A1"
                                                            height={CHART_HEIGHT}
                                                            width={CHART_WIDTH}
                                                            dataPointsColor="#6C83A1"
                                                            dataPointsWidth={8}
                                                            dataPointsHeight={8}
                                                            maxValue={40}
                                                            noOfSections={4}
                                                            yAxisLabelWidth={LABEL_WIDTH} 
                                                            xAxisLabelTextStyle={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: '#6C83A1' }}
                                                            yAxisTextStyle={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: '#6C83A1' }}
                                                            isSecondaryDataPoints
                                                        />
                                                    </View>
                                                ) : (
                                                    <View style={styles.emptyState}>
                                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 4.7 * scale, color: '#6C83A1' }}>
                                                            Sem dados para mostrar
                                                        </Text>
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    </>
                                )}

                                {viewMode === 'delete' && selectedItem && (
                                    <View style={styles.deleteContainer}>
                                        <AntDesign name="warning" size={ICON_SIZE * 1.5} color="#e11d48" />
                                        
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', textAlign: 'center' }}>
                                            Tem certeza que deseja excluir este registro?
                                        </Text>
                                        
                                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1', textAlign: 'center' }}>
                                            IMC: {selectedItem.imc}
                                        </Text>
                                        
                                        <View style={styles.actionButtonsRow}>
                                            <Pressable 
                                                style={[styles.actionBtn, { backgroundColor: '#ccc' }]} 
                                                onPress={cancelDelete} 
                                                disabled={isDeleting}
                                            >
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Cancelar</Text>
                                            </Pressable>
                                            
                                            <Pressable 
                                                style={[styles.actionBtn, { backgroundColor: '#e11d48' }]} 
                                                onPress={confirmDelete} 
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? <ActivityIndicator color="#fff" /> : <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Confirmar</Text>}
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const dynamicStyles = (width, height, scale) => {
    return StyleSheet.create({
        modalContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        modal: {
            width: 0.82 * width,
            backgroundColor: '#fff',
            borderRadius: 0.025 * width,
            padding: 0.0444 * width,
            gap: 0.0222 * width,
        },

        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        modalBody: {
            gap: 0.0222 * width,
        },

        loadingContainer: {
            height: 0.2 * height, 
            justifyContent: 'center', 
            alignItems: 'center'
        },

        closeModalBtn: {
            width: 0.04 * height,
            aspectRatio: 1 / 1,
            borderRadius: 0.0111 * width,
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
        },

        tabSwitch: {
            height: 0.05 * height,
            backgroundColor: '#fafafa',
            flexDirection: 'row',
            borderRadius: 0.0111 * width,
            padding: 0.0111 * width,
            gap: 0.0111 * width,
            position: 'relative',
        },

        tab: {
            height: '100%',
            width: 0.2 * width,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
        },

        tabSwitchWrapper: {
            position: 'absolute',
            top: 0.0111 * width,
            width: 0.2 * width,
            height: '100%',
            backgroundColor: '#fff',
            zIndex: 1,
            borderRadius: 0.0111 * width,
        },

        tabContent: {
            maxHeight: 0.4 * height,
        },

        listContent: {
            gap: 0.0222 * width,
        },

        sectionHeader: {
            backgroundColor: '#fff',
            padding: 0.0111 * width,
        },

        historyItem: {
            width: '100%',
            height: 0.055 * height,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f9f9f9',
            padding: 0.0222 * width,
            borderRadius: 0.0222 * width,
            gap: 0.0222 * width,
        },

        historyLeftInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 0.0222 * width,
            height: '100%',
        },

        historyItemText: {
            justifyContent: 'center',
        },

        deleteIconBtn: {
            padding: 0.0111 * width,
        },

        chartContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: 0.0222 * width,
        },

        emptyState: {
            height: 0.2 * height,
            alignItems: 'center',
            justifyContent: 'center',
        },
        
        deleteContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.0222 * width,
        },

        actionButtonsRow: {
            flexDirection: 'row',
            gap: 0.0222 * width,
            width: '100%',
        },

        actionBtn: {
            flex: 1,
            height: 0.06 * height,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 9999,
        }
    });
};

export default ImcModalHistorico;