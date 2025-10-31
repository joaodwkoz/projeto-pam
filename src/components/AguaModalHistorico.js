import { BlurView } from "expo-blur";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, Image, Pressable, Modal, StyleSheet, Text, SectionList, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
import { LineChart } from 'react-native-gifted-charts';

const AguaModalHistorico = ({ visible, setVisible, width, height, scale = 3 }) => {
    const { usuario } = useContext(AuthContext);

    const PADDING_VERTICAL = React.useMemo(() => 0.0444 * width, [width]);
    const PADDING_BOTTOM = React.useMemo(() => 0.0444 * width, [width]);

    const MODAL_VIEW_WIDTH = 0.82 * width;
    const MODAL_PADDING = 0.0444 * width;
    const CHART_CONTAINER_WIDTH = MODAL_VIEW_WIDTH - (2 * MODAL_PADDING);
    const FINAL_CHART_WIDTH = CHART_CONTAINER_WIDTH - 20; 
    const NUM_SPACES = 6; 
    const FINAL_SPACING = FINAL_CHART_WIDTH / NUM_SPACES;

    const styles = React.useMemo(() => dynamicStyles(width, height), [width, height]);

    const [periodo, setPeriodo] = useState('Semana');
    const [aba, setAba] = useState('Histórico');

    const [history, setHistory] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const BASE_URL_STORAGE = 'http://192.168.0.7:8000/';

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await api.get(`/usuario/${usuario.id}/consumos-por-periodo?periodo=${periodo.toLowerCase()}`); 
            setHistory(res.data.historico);
            console.log(res.data.historico);
        } catch(e) {
            console.error('Ocorreu um erro!', e);
        } finally {
            setIsLoading(false);
        }
    }, [usuario.id, periodo]);

    const fetchChart = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await api.get(`/usuario/${usuario.id}/consumos-grafico?periodo=${periodo.toLowerCase()}`); 
            setLineData(res.data.dados_grafico);
            console.log(res.data.dados_grafico);
        } catch(e) {
            console.error('Ocorreu um erro!', e);
        } finally {
            setIsLoading(false);
        }
    }, [usuario.id, periodo]);

    useEffect(() => {
        if (visible) { 
            fetchHistory();
            fetchChart();
        }
    }, [visible, fetchHistory, fetchChart]);

    return (
        <Modal transparent animation='slide' visible={visible}>
            <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalContainer}>
                <View style={styles.modal}>
                    {!isLoading ? (
                        <>
                            <View style={styles.modalHeader}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 8 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 8.8 * scale
                                }}>
                                    Visualizar Dados
                                </Text>

                                <Pressable style={styles.closeModalBtn} onPress={() => setVisible(false)}>
                                    <Ionicons name="close" size={24} color="#6C83A1" />
                                </Pressable>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.periodFilters}>
                                    <Pressable style={[styles.filter, { backgroundColor: periodo === 'Hoje' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('Hoje')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === 'Hoje' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            24h
                                        </Text>
                                    </Pressable>

                                    <Pressable style={[styles.filter, { backgroundColor: periodo === 'Semana' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('Semana')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === 'Semana' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            7d
                                        </Text>
                                    </Pressable>

                                    <Pressable style={[styles.filter, { backgroundColor: periodo === 'Mes' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('Mes')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === 'Mes' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            30d
                                        </Text>
                                    </Pressable>

                                    <Pressable style={[styles.filter, { backgroundColor: periodo === 'Ano' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('Ano')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === 'Ano' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            365d
                                        </Text>
                                    </Pressable>
                                </View>

                                <View style={styles.tabSwitch}>
                                    <Pressable style={styles.tab} onPress={() => setAba('Histórico')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: aba === 'Histórico' ? '#6C83A1' : '#6C83A140',
                                            lineHeight: 9 * scale
                                        }}>
                                            Histórico
                                        </Text>
                                    </Pressable>

                                    <Pressable style={styles.tab} onPress={() => setAba('Gráficos')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: aba === 'Gráficos' ? '#6C83A1' : '#6C83A140',
                                            lineHeight: 9 * scale
                                        }}>
                                            Gráficos
                                        </Text>
                                    </Pressable>

                                    <View style={[styles.tabSwitchWrapper, { left: aba === 'Histórico' ? 0.0125 * width : 0.23 * width }]}></View>
                                </View>

                                <View style={styles.tabContent}>
                                    {
                                        aba === 'Histórico' ? (
                                            history && history.length > 0 ? (
                                                <SectionList
                                                    sections={history}
                                                    keyExtractor={(item, index) => item + index}
                                                    renderItem={({item}) => (
                                                        <View style={styles.historyItem}>
                                                            <Image source={{uri: item.copo_icone_caminho ? BASE_URL_STORAGE + item.copo_icone_caminho : null}} 
                                                                style={{ height: '100%', aspectRatio: 1 / 1,   objectFit: 'contain' }} 
                                                            />
                                                            
                                                            <View style={styles.historyItemInfo}>
                                                                <Text style={{
                                                                    fontFamily: 'Poppins-M',
                                                                    fontSize: 6 * scale,
                                                                    color: '#6C83A1',
                                                                    lineHeight: 9 * scale
                                                                }}>
                                                                    {item.volume_ml} ml - {item.copo_nome}
                                                                </Text>
                                                                
                                                                <Text style={{ 
                                                                    fontFamily: 'Poppins-M',
                                                                    fontSize: 5 * scale,
                                                                    color: '#6C83A1',
                                                                    lineHeight: 8 * scale
                                                                }}>{item.hora}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    ItemSeparatorComponent={() => (
                                                        <View style={{
                                                            width: '100%',
                                                            height: 0.0444 * width,
                                                        }}></View>
                                                    )}
                                                    renderSectionHeader={({ section }) => 
                                                        {
                                                            const sectionIndex = history.indexOf(section);
                                                            const isFirst = sectionIndex === 0;
                                                            const isLast = sectionIndex === history.length - 1;

                                                            let headerStyles = {
                                                                fontFamily: 'Poppins-M',
                                                                fontSize: 7 * scale,
                                                                color: '#6C83A1',
                                                                lineHeight: 10 * scale,
                                                                paddingBottom: 0,
                                                                paddingTop: 0,
                                                            };

                                                            if (isFirst) {
                                                                headerStyles.paddingBottom = PADDING_BOTTOM;
                                                                headerStyles.paddingTop = 0;
                                                            } else if (isLast) {
                                                                headerStyles.paddingTop = PADDING_VERTICAL;
                                                                headerStyles.paddingBottom = 0;
                                                            } else {
                                                                headerStyles.paddingTop = PADDING_VERTICAL;
                                                                headerStyles.paddingBottom = PADDING_BOTTOM;
                                                            }

                                                            return (
                                                                <Text style={headerStyles}>
                                                                    {section.title} ({section.total_diario}ml)
                                                                </Text>
                                                            );
                                                        }
                                                    }
                                                />
                                            ) : (
                                                <View style={{
                                                    height: 0.1 * height,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Text style={{
                                                        fontFamily: 'Poppins-M',
                                                        fontSize: 8 * scale,
                                                        color: '#6C83A1',
                                                        lineHeight: 11 * scale,
                                                    }}>
                                                        Sem dados para mostrar
                                                    </Text>
                                                </View>
                                            )
                                        ) : (
                                            lineData && lineData.length > 0 ? ( 
                                                <View
                                                    style={{
                                                        width: '100%',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                    }}
                                                    >
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
                                                        AxisExtraSpace={20}
                                                        color="#6C83A1"
                                                        height={0.25 * height}
                                                        width={CHART_CONTAINER_WIDTH * 0.95}
                                                        dataPointsColor="#6C83A1"
                                                        dataPointsWidth={8}
                                                        dataPointsHeight={8}
                                                        xAxisLabelTextStyle={{
                                                            fontFamily: 'Poppins-M',
                                                            fontSize: 5 * scale,
                                                            color: '#6C83A1',
                                                        }}
                                                        yAxisTextStyle={{
                                                            fontFamily: 'Poppins-M',
                                                            fontSize: 5 * scale,
                                                            color: '#6C83A1',
                                                        }}
                                                        minValue={0}
                                                        maxValue={4000}
                                                        yAxisLabelWidth={0.1 * width}
                                                        isSecondaryDataPoints
                                                    />
                                                </View>
                                            ) : (
                                                <View style={{
                                                    height: 0.1 * height,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <Text style={{
                                                        fontFamily: 'Poppins-M',
                                                        fontSize: 8 * scale,
                                                        color: '#6C83A1',
                                                        lineHeight: 11 * scale,
                                                    }}>
                                                        Sem dados para mostrar
                                                    </Text>
                                                </View>  
                                            )
                                        )
                                    }
                                </View>
                            </View>
                        </>
                    ) : (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color="#6C83A1" /> 
                        </View>
                    )}
                </View>
            </BlurView>
        </Modal>
    );
};

const dynamicStyles = (width, height) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        width: '82%',
        backgroundColor: '#fff',
        borderRadius: 0.025 * width,
        padding: 0.0444 * width,
        gap: 0.0222 * width,
    },

    modalHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    modalBody: {
        gap: 0.0222 * width,
    },

    closeModalBtn: {
        height: 0.04 * height,
        aspectRatio: 1 / 1,
        borderRadius: 0.0125 * width,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },

    periodFilters: {
        width: '100%',
        flexDirection: 'row',
        gap: 0.0222 * width,
    },

    filter: {
        padding: 0.0222 * width,
        backgroundColor: '#f0f0f0',
        borderRadius: 0.0125 * width,
    },

    tabSwitch: {
        width: 'auto',
        height: 0.05 * height,
        backgroundColor: '#fafafa',
        flexDirection: 'row',
        borderRadius: 0.0125 * width,
        padding: 0.015 * width,
        gap: 0.015 * width,
        position: 'relative',
    },

    tab: {
        height: '100%',
        width: 0.2 * width,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
    },

    tabSwitchWrapper: {
        position: 'absolute',
        top: 0.015 * width,
        left: 0.015 * width,
        width: 0.2 * width,
        height: '100%',
        backgroundColor: '#fff',
        zIndex: 1,
        borderRadius: 0.0125 * width,
    },

    tabContent: {
        maxHeight: 0.3 * height,
        width: '100%',
    },

    historyItem: {
        width: '100%',
        height: 0.025 * height,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.0222 * width,
    },

    historyItemInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
});

export default AguaModalHistorico;