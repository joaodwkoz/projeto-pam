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

const ImcModalHistorico = ({ visible, setVisible, width, height, scale = 3 }) => {
    const { usuario } = useContext(AuthContext);

    const PADDING_VERTICAL = React.useMemo(() => 0.0444 * width, [width]);
    const PADDING_BOTTOM = React.useMemo(() => 0.0444 * width, [width]);

    const styles = React.useMemo(() => dynamicStyles(width, height), [width, height]);

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);

        try {
            const res = await api.get(`/usuario/${usuario.id}/imc/historico`); 
            setHistory(res.data.historico);
            console.log(res.data.historico);
        } catch(e) {
            console.error('Ocorreu um erro!', e);
        } finally {
            setIsLoading(false);
        }
    }, [usuario.id]);

    useEffect(() => {
        if (visible) { 
            fetchHistory();
        }
    }, [visible, fetchHistory]);

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
                                <View style={styles.tabContent}>
                                    { history.length > 0 ? (
                                        <SectionList
                                            sections={history}
                                            keyExtractor={(item, index) => item + index}
                                            renderItem={({item}) => (
                                                <View style={styles.historyItem}>
                                                    <View style={styles.historyItemInfo}>
                                                        <Text style={{
                                                            fontFamily: 'Poppins-M',
                                                            fontSize: 6 * scale,
                                                            color: '#6C83A1',
                                                            lineHeight: 9 * scale
                                                        }}>
                                                            {item.imc} kg/m² ({Math.round(item.peso)}kg e {Math.round(item.altura * 100)}cm)
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
                                                            {section.title}
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

export default ImcModalHistorico;