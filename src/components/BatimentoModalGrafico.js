import { BlurView } from "expo-blur";
import React, { useEffect, useState, useCallback, useContext, useRef } from "react";
import { View, Pressable, Modal, StyleSheet, Text, ActivityIndicator } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { LineChart } from 'react-native-gifted-charts';
import * as Notifications from 'expo-notifications';

const BatimentoModalGrafico = ({ visible, setVisible, width, height, scale = 3 }) => {
    const { usuario } = useAuth();
    const [periodo, setPeriodo] = useState('7d');
    const [lineData, setLineData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const notifiedRef = useRef(false); 

    const MODAL_VIEW_WIDTH = 0.82 * width;
    const MODAL_PADDING = 0.0444 * width;
    const CHART_CONTAINER_WIDTH = MODAL_VIEW_WIDTH - (2 * MODAL_PADDING);

    const styles = React.useMemo(() => dynamicStyles(width, height), [width, height]);

    // Função para enviar notificação
    const sendNotification = async (title, body) => {
        await Notifications.scheduleNotificationAsync({
            content: { title, body },
            trigger: null,
        });
    };

    const fetchChart = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await api.get(`/usuario/${usuario.id}/batimentos-grafico?periodo=${periodo}`); 
            setLineData(res.data.dados_grafico);

          
            if (res.data.dados_grafico && res.data.dados_grafico.length > 0) {
                const lastValue = res.data.dados_grafico[res.data.dados_grafico.length - 1].value;

                let mensagem = '';
                if (lastValue < 50) mensagem = `Seu batimento está muito baixo: ${lastValue} bpm`;
                else if (lastValue > 100) mensagem = `Seu batimento está alto: ${lastValue} bpm`;

                if (mensagem && !notifiedRef.current) {
                    sendNotification("Alerta de Batimento", mensagem);
                    notifiedRef.current = true; 
                }
            }

        } catch(e) {
            console.error('Ocorreu um erro!', e);
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
                                {/* Filtros de período */}
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

                                {/* Gráfico */}
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

export default BatimentoModalGrafico;
