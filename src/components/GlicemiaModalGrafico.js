import { BlurView } from "expo-blur";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, Pressable, Modal, StyleSheet, Text, ActivityIndicator } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from "../hooks/useAuth"; // Ajuste o caminho se necessário
import api from "../services/api"; // Ajuste o caminho se necessário
import { LineChart } from 'react-native-gifted-charts';
import * as Notifications from 'expo-notifications';

const GlicemiaModalGrafico = ({ visible, setVisible, width, height, scale = 3 }) => {
    const { usuario } = useAuth();
    const [periodo, setPeriodo] = useState('7d');
    const [lineData, setLineData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const notifiedRef = useRef(false); 

    const MODAL_VIEW_WIDTH = 0.82 * width;
    const MODAL_PADDING = 0.0444 * width;
    const CHART_CONTAINER_WIDTH = MODAL_VIEW_WIDTH - (2 * MODAL_PADDING);

    const styles = React.useMemo(() => dynamicStyles(width, height, scale), [width, height, scale]);

    const sendNotification = async (title, body) => {
        await Notifications.scheduleNotificationAsync({
            content: { title, body },
            trigger: null,
        });
    };

    const fetchChart = useCallback(async () => {
        setIsLoading(true);

        try {
            // Endpoint ajustado para glicemia
            const res = await api.get(`/usuario/${usuario.id}/glicemias/grafico?periodo=${periodo}`); 
            setLineData(res.data.dados_grafico);

            if (res.data.dados_grafico && res.data.dados_grafico.length > 0) {
                const lastValue = res.data.dados_grafico[res.data.dados_grafico.length - 1].value;

                let mensagem = '';
                // Lógica de alerta para Glicemia (Hipoglicemia < 70, Hiperglicemia > 140 - valores de exemplo)
                if (lastValue < 70 && lastValue > 0) mensagem = `Atenção: Glicemia baixa (${lastValue} mg/dL)`;
                else if (lastValue > 140) mensagem = `Atenção: Glicemia alta (${lastValue} mg/dL)`;

                if (mensagem && !notifiedRef.current) {
                    sendNotification("Alerta de Glicemia", mensagem);
                    notifiedRef.current = true; 
                }
            }

        } catch(e) {
            console.error('Ocorreu um erro no gráfico!', e);
        } finally {
            setIsLoading(false);
        }
    }, [usuario.id, periodo]);

    useEffect(() => {
        if (visible) { 
            fetchChart();
            notifiedRef.current = false;
        }
    }, [visible, fetchChart]);

    return (
        <Modal transparent animationType='slide' visible={visible}>
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
                                    {['24h', '7d', '30d', '365d'].map(p => (
                                        <Pressable
                                            key={p}
                                            style={[styles.filter, { backgroundColor: periodo === p ? '#6C83A1' : '#f0f0f0' }]}
                                            onPress={() => setPeriodo(p)}
                                        >
                                            <Text style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 6 * scale,
                                                color: periodo === p ? '#fff' : '#6C83A1',
                                                lineHeight: 9 * scale
                                            }}>{p}</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View style={styles.modalContent}>
                                    {
                                        lineData && lineData.length > 0 ? ( 
                                            <View style={{
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                            }}>
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
                                                    minValue={0} // Ajuste conforme necessário
                                                    maxValue={300} // Ajuste conforme necessário para glicemia
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

const dynamicStyles = (width, height, scale) => StyleSheet.create({
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

    modalContent: {
        maxHeight: 0.3 * height,
        width: '100%',
    },
});

export default GlicemiaModalGrafico;