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

const BatimentoModalGrafico = ({ visible, setVisible, width, height, scale = 3 }) => {
    const { usuario } = useContext(AuthContext);

    const PADDING_VERTICAL = React.useMemo(() => 0.0444 * width, [width]);
    const PADDING_BOTTOM = React.useMemo(() => 0.0444 * width, [width]);

    const MODAL_VIEW_WIDTH = 0.82 * width;
    const MODAL_PADDING = 0.0444 * width;
    const CHART_CONTAINER_WIDTH = MODAL_VIEW_WIDTH - (2 * MODAL_PADDING);

    const styles = React.useMemo(() => dynamicStyles(width, height), [width, height]);

    const [periodo, setPeriodo] = useState('7d');

    const [lineData, setLineData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchChart = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await api.get(`/usuario/${usuario.id}/batimentos-grafico?periodo=${periodo}`); 
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
            fetchChart();
        }
    }, [visible, fetchChart]);

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
                                    <Pressable style={[styles.filter, { backgroundColor: periodo === '24h' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('24h')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === '24h' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            24h
                                        </Text>
                                    </Pressable>

                                    <Pressable style={[styles.filter, { backgroundColor: periodo === '7d' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('7d')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === '7d' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            7d
                                        </Text>
                                    </Pressable>

                                    <Pressable style={[styles.filter, { backgroundColor: periodo === '30d' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('30d')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === '30d' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            30d
                                        </Text>
                                    </Pressable>

                                    <Pressable style={[styles.filter, { backgroundColor: periodo === '365d' ? '#6C83A1' : '#f0f0f0' }]} onPress={() => setPeriodo('365d')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: periodo === '365d' ? '#fff' : '#6C83A1',
                                            lineHeight: 9 * scale
                                        }}>
                                            365d
                                        </Text>
                                    </Pressable>
                                </View>

                                <View style={styles.modalContent}>
                                    {
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
                                                    minValue={30}
                                                    maxValue={300}
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

    modalContent: {
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

export default BatimentoModalGrafico;