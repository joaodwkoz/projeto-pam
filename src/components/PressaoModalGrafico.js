import { BlurView } from 'expo-blur';
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Pressable,
    Modal,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { LineChart } from 'react-native-gifted-charts';

const PressaoModalGrafico = ({ visible, setVisible, width, height, scale = 3 }) => {
    const { usuario } = useAuth();

    const MODAL_VIEW_WIDTH = 0.82 * width;
    const MODAL_PADDING = 0.0444 * width;
    const CHART_CONTAINER_WIDTH = MODAL_VIEW_WIDTH - 2 * MODAL_PADDING;

    const styles = React.useMemo(() => dynamicStyles(width, height), [width, height]);

    const [periodo, setPeriodo] = useState('7d');

    const [dataSistolica, setDataSistolica] = useState([]);
    const [dataDiastolica, setDataDiastolica] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const fetchChart = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await api.get(
                `/usuario/${usuario.id}/medicoes-pressao/grafico?periodo=${periodo}`
            );

            const raw = res.data.dados_grafico;

            const sistolicaArr = raw.map(item => ({
                value: item.sistolica,
                label: item.label,
                dataPointText: `${item.sistolica}`,
            }));

            const diastolicaArr = raw.map(item => ({
                value: item.diastolica,
                label: item.label,
                dataPointText: `${item.diastolica}`,
            }));

            setDataSistolica(sistolicaArr);
            setDataDiastolica(diastolicaArr);

        } catch (e) {
            console.error('Erro ao carregar gráfico!', e);
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
        <Modal transparent animation="slide" visible={visible}>
            <BlurView
                intensity={8}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView"
                style={styles.modalContainer}
            >
                <View style={styles.modal}>
                    {!isLoading ? (
                        <>
                            {/* HEADER */}
                            <View style={styles.modalHeader}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 8 * scale,
                                        color: '#6C83A1',
                                    }}
                                >
                                    Visualizar dados de pressão
                                </Text>

                                <Pressable
                                    style={styles.closeModalBtn}
                                    onPress={() => setVisible(false)}
                                >
                                    <Ionicons name="close" size={24} color="#6C83A1" />
                                </Pressable>
                            </View>

                            {/* PERÍODOS */}
                            <View style={styles.modalBody}>
                                <View style={styles.periodFilters}>
                                    {['24h', '7d', '30d', '365d'].map(p => (
                                        <Pressable
                                            key={p}
                                            style={[
                                                styles.filter,
                                                {
                                                    backgroundColor:
                                                        periodo === p ? '#6C83A1' : '#f0f0f0',
                                                },
                                            ]}
                                            onPress={() => setPeriodo(p)}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Poppins-M',
                                                    fontSize: 6 * scale,
                                                    color: periodo === p ? '#fff' : '#6C83A1',
                                                }}
                                            >
                                                {p}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                {/* Legenda */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 20,
                                        alignItems: 'center',
                                        marginTop: 10,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ width: 10, height: 10, backgroundColor: '#6C83A1', borderRadius: 5 }} />
                                        <Text style={{ color: '#6C83A1', fontFamily: 'Poppins-M', fontSize: 6 * scale }}>
                                            Sistólica
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ width: 10, height: 10, backgroundColor: '#FF6B6B', borderRadius: 5 }} />
                                        <Text style={{ color: '#FF6B6B', fontFamily: 'Poppins-M', fontSize: 6 * scale }}>
                                            Diastólica
                                        </Text>
                                    </View>
                                </View>

                                {/* GRÁFICO */}
                                <View style={styles.modalContent}>
                                    {dataSistolica.length > 0 ? (
                                        <View
                                            style={{
                                                width: '100%',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <LineChart
                                                data={dataSistolica}
                                                data2={dataDiastolica}
                                                curved
                                                areaChart
                                                startFillColor="#6C83A1"
                                                endFillColor="#ffffff"
                                                startOpacity={0.18}
                                                endOpacity={0}
                                                thickness={3}
                                                thickness2={3}
                                                color="#6C83A1"
                                                color2="#FF6B6B"
                                                dataPointsColor="#6C83A1"
                                                dataPointsColor2="#FF6B6B"
                                                height={0.25 * height}
                                                width={CHART_CONTAINER_WIDTH * 0.95}
                                                xAxisColor="#6C83A1"
                                                yAxisColor="#6C83A1"
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
                                                minValue={60}
                                                maxValue={200}
                                                yAxisLabelWidth={0.1 * width}
                                            />
                                        </View>
                                    ) : (
                                        <View
                                            style={{
                                                height: 0.1 * height,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Poppins-M',
                                                    fontSize: 8 * scale,
                                                    color: '#6C83A1',
                                                }}
                                            >
                                                Sem dados para mostrar
                                            </Text>
                                        </View>
                                    )}
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

const dynamicStyles = (width, height) =>
    StyleSheet.create({
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

export default PressaoModalGrafico;