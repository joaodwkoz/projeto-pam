import { View, Pressable, Text, PixelRatio, useWindowDimensions, ActivityIndicator, SectionList, ScrollView, Modal } from 'react-native';
import { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import BottomSheet, { BottomSheetModal, BottomSheetTextInput, BottomSheetScrollView, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BlurView } from 'expo-blur';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// Adicionei MaterialIcons caso precise, mas tentei usar os mesmos libs do seu exemplo
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { dynamicStyles } from './styles';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Se não tiver o gráfico de glicemia, comente a linha abaixo ou use o de batimentos renomeado
import BatimentoModalGrafico from '../../components/BatimentoModalGrafico';

let atual = new Date();

const Glicemia = () => {
    const { width, height } = useWindowDimensions();

    const PADDING_VERTICAL = useMemo(() => 0.0444 * width, [width]);
    const PADDING_BOTTOM = useMemo(() => 0.0444 * width, [width]);
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);

    // Estado do Modal de Ajuda
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    // Cores baseadas nos níveis de glicemia
    const getGlicemiaColor = (valor) => {
        if (valor > 140) {
            return '#f09b9b'; // Alto
        } else if (valor < 70) {
            return '#abc4f1'; // Baixo
        } else {
            return '#d6f1ab'; // Normal
        }
    }

    // Tradução do ENUM do banco para visualização
    const getTipoMedicaoLabel = (tipo) => {
        const mp = {
            'jejum': 'Jejum',
            'pre_refeicao': 'Pré-refeição',
            'pos_refeicao': 'Pós-refeição',
            'aleatoria': 'Aleatória'
        }
        return mp[tipo] || tipo;
    }

    const bottomSheetRef = useRef(null);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const snapPoints = useMemo(() => [height * 0.6], []);
    const [modalState, setModalState] = useState('Create');

    const handleOpenModal = () => {
        bottomSheetRef.current?.present();
    }

    const handleCloseModal = () => {
        bottomSheetRef.current?.dismiss();
        clearModal();
    }

    const clearModal = () => {
        setModalState('Create');
        setGlicemiaId(-1);
        setValor('');
        setTipoMedicao(''); // Enum do banco
        setObservacoes('');

        atual = new Date();

        setHorario({
            hora: atual.getHours(),
            minuto: atual.getMinutes(),
        });

        setData({
            dia: atual.getDate(),
            mes: atual.getMonth() + 1,
            ano: atual.getFullYear(),
        });
    }

    const handleUpdateInfoModal = (id, valor, tipo_medicao, hora, data, observacoes) => {
        setModalState('Edit');
        setGlicemiaId(id);
        setValor(valor.toString());
        setTipoMedicao(tipo_medicao);
        setObservacoes(observacoes);

        const h = hora.substring(0, 2);
        const m = hora.substring(3, 5);

        setHorario({
            hora: h,
            minuto: m,
        });

        const d = data.substring(0, 2);
        const me = data.substring(3, 5);
        const a = data.substring(6, 10);

        setData({
            dia: d,
            mes: me,
            ano: a,
        });

        handleOpenModal();
    }

    const [periodo, setPeriodo] = useState('7d');
    const [glicemiaId, setGlicemiaId] = useState(-1);
    const [valor, setValor] = useState('');
    const [tipoMedicao, setTipoMedicao] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [horario, setHorario] = useState({
        hora: atual.getHours(),
        minuto: atual.getMinutes(),
    });
    const [data, setData] = useState({
        dia: atual.getDate(),
        mes: atual.getMonth() + 1,
        ano: atual.getFullYear(),
    });

    const handleChangeData = (key, value) => {
        setData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChangeHorario = (key, value) => {
        setHorario(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveMedition = async () => {
        const valorInt = Number(valor);
        const pad = (num) => String(num).padStart(2, '0');
        const dataFormatada = `${data.ano}-${pad(data.mes)}-${pad(data.dia)}`;
        const horaFormatada = `${pad(horario.hora)}:${pad(horario.minuto)}:00`;
        const dataHoraMedicao = `${dataFormatada} ${horaFormatada}`;

        const dataNovaGlicemia = {
            valor: valorInt,
            tipo_medicao: tipoMedicao, // Enum: jejum, pre_refeicao, pos_refeicao, aleatoria
            data_hora_medicao: dataHoraMedicao,
            observacoes: observacoes.trim() ? observacoes.trim() : null,
        };

        try {
            await api.post('/glicemias', dataNovaGlicemia);
            handleCloseModal();
            fetchUserHistory();
            fetchUserCards();
        } catch(e) {
            console.error('Ocorreu um erro ao salvar glicemia', e);
        }
    }

    const handleUpdateMedition = async () => {
        const valorInt = Number(valor);
        const pad = (num) => String(num).padStart(2, '0');
        const dataFormatada = `${data.ano}-${pad(data.mes)}-${pad(data.dia)}`;
        const horaFormatada = `${pad(horario.hora)}:${pad(horario.minuto)}:00`;
        const dataHoraMedicao = `${dataFormatada} ${horaFormatada}`;

        const dataNovaGlicemia = {
            valor: valorInt,
            tipo_medicao: tipoMedicao,
            data_hora_medicao: dataHoraMedicao,
            observacoes: observacoes.trim() ? observacoes.trim() : null,
        };

        try {
            await api.put('/glicemias/' + glicemiaId, dataNovaGlicemia);
            handleCloseModal();
            fetchUserHistory();
            fetchUserCards();
        } catch(e) {
            console.error('Ocorreu um erro ao atualizar glicemia', e);
        }
    }

    const helperSave = () => {
        if (modalState === 'Create') {
            handleSaveMedition();
        } else {
            handleUpdateMedition();
        }
    }

    const handleSheetChanges = useCallback((index) => {
        if (sheetIndex >= 0 && index === -1) {
            dismissModal();
        }
        setSheetIndex(index);
    }, [sheetIndex]);

    const dismissModal = () => {
        clearModal();
    }

    const [cards, setCards] = useState({});
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const fetchUserCards = useCallback(async () => {
        try {
            const res = await api.get(`/usuario/${usuario.id}/glicemias/resumo`);
            setCards(res.data);
        } catch(e) {
            console.error("Erro ao buscar cards de glicemia:", e);
        } finally {
            setIsLoadingCards(false);
        }
    }, [usuario.id]);

    const fetchUserHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const res = await api.get(`/usuario/${usuario.id}/glicemias/historico?periodo=${periodo}`); 
            setHistory(res.data.historico);
            console.log(res.data.historico);
        } catch(e) {
            console.error('Ocorreu um erro ao buscar histórico!', e);
        } finally {
            setIsLoadingHistory(false);
        }
    }, [usuario.id, periodo]);

    useEffect(() => {
        fetchUserCards();
        fetchUserHistory();
    }, [fetchUserCards, fetchUserHistory]);

    const [graficoModalVisible, setGraficoModalVisible] = useState(false);

    if (isLoadingCards && isLoadingHistory && !fontsLoaded) {
        return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F0F4F7' }}>
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                            <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                        </Pressable>

                        <Pressable style={styles.headerBtn} onPress={() => setMostrarModalAjuda(true)}>
                            <Ionicons name="help-circle" size={0.05 * width} color="#97B9E5" />
                        </Pressable>
                    </View>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1',
                        lineHeight: 17 * scale
                    }}>Glicemia</Text>

                    <View style={styles.headerSection}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 9 * scale,
                            color: '#6C83A1',
                            lineHeight: 9.9 * scale
                        }}>
                            Histórico
                        </Text>

                        <Pressable style={styles.graphViewBtn} onPress={() => setGraficoModalVisible(true)}>
                            <Octicons name="graph" size={20} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.resumeSection}>
                        {isLoadingCards ? (
                            <View style={{ 
                                width: '100%',
                                height: height * 0.17 + 0.0222 * width,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <ActivityIndicator color='#6C83A1' size="large" /> 
                            </View>
                        ): (
                            <>
                                {/* CARD 1: Última (Igual estrutura "Repouso" do Batimentos, mas com Gota) */}
                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <Entypo name="drop" size={0.025 * height} color="#baabf1ff" />
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#baabf1ff',
                                            lineHeight: 8 * scale
                                        }}>Última</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#baabf1ff',
                                        lineHeight: 9 * scale
                                    }}>{cards.ultima ? Math.round(cards.ultima) : 0}mg/dL</Text>
                                </View>

                                {/* CARD 2: Média (Igual estrutura "Média" do Batimentos, mas com Prancheta) */}
                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <FontAwesome5 name="clipboard-list" size={24} color="#abc4f1ff" />
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#abc4f1ff',
                                            lineHeight: 8 * scale
                                        }}>Média</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#abc4f1ff',
                                        lineHeight: 9 * scale
                                    }}>{cards.media ? Math.round(cards.media) : 0}mg/dL</Text>
                                </View>

                                {/* CARD 3: Máximo (IGUAL BATIMENTOS - FIRE) */}
                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <AntDesign name="fire" size={24} color="#f09b9bff" />
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#f09b9bff',
                                            lineHeight: 8 * scale
                                        }}>Máximo</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#f09b9bff',
                                        lineHeight: 9 * scale
                                    }}>{cards.maximo ? Math.round(cards.maximo) : 0}mg/dL</Text>
                                </View>

                                {/* CARD 4: Mínimo (IGUAL BATIMENTOS - SNOWFLAKE) */}
                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <FontAwesome6 name="snowflake" size={24} color="#d6f1abff" />
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#d6f1abff',
                                            lineHeight: 8 * scale
                                        }}>Mínimo</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#d6f1abff',
                                        lineHeight: 9 * scale
                                    }}>{cards.minimo ? Math.round(cards.minimo) : 0}mg/dL</Text>
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.history}>
                        <View style={styles.historyOptions}>
                            <Pressable style={[styles.historyOption, periodo === '24h' && { backgroundColor: '#6C83A1' }]} onPress={() => setPeriodo('24h')}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: periodo === '24h' ? '#fff' : '#6C83A1',
                                    lineHeight: 10 * scale
                                }}>24h</Text>
                            </Pressable>

                            <Pressable style={[styles.historyOption, periodo === '7d' && { backgroundColor: '#6C83A1' }]} onPress={() => setPeriodo('7d')}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: periodo === '7d' ? '#fff' : '#6C83A1',
                                    lineHeight: 10 * scale
                                }}>7d</Text>
                            </Pressable>

                            <Pressable style={[styles.historyOption, periodo === '30d' && { backgroundColor: '#6C83A1' }]} onPress={() => setPeriodo('30d')}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: periodo === '30d' ? '#fff' : '#6C83A1',
                                    lineHeight: 10 * scale
                                }}>30d</Text>
                            </Pressable>

                            <Pressable style={[styles.historyOption, periodo === '365d' && { backgroundColor: '#6C83A1' }]} onPress={() => setPeriodo('365d')}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: periodo === '365d' ? '#fff' : '#6C83A1',
                                    lineHeight: 10 * scale
                                }}>365d</Text>
                            </Pressable>
                        </View>

                        {
                            isLoadingHistory ? (
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <ActivityIndicator color='#6C83A1' size="large" />
                                </View>
                            ) : (
                                <SectionList
                                    sections={history}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={({item}) => (
                                        <View style={styles.historyItem}>
                                            <View style={styles.historyItemInfoContainer}>
                                                <Entypo name="drop" size={32} color={getGlicemiaColor(item.valor)} />

                                                <View style={styles.historyItemInfo}>
                                                    <Text style={{
                                                        fontFamily: 'Poppins-M',
                                                        fontSize: 7 * scale,
                                                        color: getGlicemiaColor(item.valor),
                                                        lineHeight: 10 * scale
                                                    }}>{item.valor} mg/dL</Text>

                                                    <Text style={{
                                                        fontFamily: 'Poppins-M',
                                                        fontSize: 6 * scale,
                                                        color: '#00000030',
                                                        lineHeight: 9 * scale
                                                    }}>{getTipoMedicaoLabel(item.tipo_medicao)} - {item.hora}</Text>
                                                </View>
                                            </View>

                                            <Pressable onPress={() => handleUpdateInfoModal(item.id, item.valor, item.tipo_medicao, item.hora, item.data, item.observacoes)}>
                                                <Entypo name="chevron-right" size={24} color="#00000030" />
                                            </Pressable>
                                        </View>
                                    )}
                                    ItemSeparatorComponent={() => (
                                        <View style={{
                                            width: '100%',
                                            height: 0.0444 * width,
                                        }}></View>
                                    )}
                                    renderSectionHeader={({ section }) => {
                                        const sectionIndex = history.indexOf(section);
                                        const isFirst = sectionIndex === 0;
                                        const isLast = sectionIndex === history.length - 1;

                                        let headerStyles = {
                                            fontFamily: 'Poppins-M',
                                            fontSize: 8 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 11 * scale,
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
                                                {section.title} (Média: {Math.round(section.media_valor || 0)} mg/dL)
                                            </Text>
                                        );
                                    }}
                                />
                            )
                        }
                    </View>

                    <Pressable style={styles.fab} onPress={handleOpenModal}>
                        <Entypo name="plus" size={24} color="#fff" />
                    </Pressable>
                </View>

                <BottomSheetModal ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose={true} backgroundStyle={{ backgroundColor: '#fff' }} style={{
                    padding: 0.0444 * width,
                    zIndex: 1000,
                    position: 'relative',
                }} handleIndicatorStyle={{
                    backgroundColor: '#6C83A1'
                }} onChange={handleSheetChanges}>
                    <BottomSheetScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', gap: 0.0444 * width }}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 9 * scale,
                            color: '#6C83A1',
                            lineHeight: 12 * scale
                        }}>Adicionar medição</Text>

                        <View style={styles.modalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>
                                Glicemia (mg/dL)
                            </Text>

                            <BottomSheetTextInput style={{
                                width: '100%',
                                height: 0.05 * height,
                                padding: 0.008 * height,
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                lineHeight: 7.7 * scale,
                                backgroundColor: '#fff',
                                borderColor: '#eee',
                                borderWidth: 0.002 * height,
                                borderRadius: 0.01 * height,
                                color: '#6C83A1',
                            }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false} onChangeText={setValor} value={valor}></BottomSheetTextInput>
                        </View>

                        <View style={styles.modalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Data</Text>

                            <View style={styles.modalDateInput}>
                                <BottomSheetTextInput style={{
                                    width: '15%',
                                    height: 0.05 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    lineHeight: 7.7 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                    textAlign: 'center'
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false} onChangeText={(text) => handleChangeData('dia', text)} value={data.dia.toString()}></BottomSheetTextInput>

                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>/</Text>

                                <BottomSheetTextInput style={{
                                    width: '15%',
                                    height: 0.05 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    lineHeight: 7.7 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                    textAlign: 'center'
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false} onChangeText={(text) => handleChangeData('mes', text)} value={data.mes.toString()}></BottomSheetTextInput>

                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>/</Text>

                                <BottomSheetTextInput style={{
                                    width: '20%',
                                    height: 0.05 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    lineHeight: 7.7 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                    textAlign: 'center'
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false} onChangeText={(text) => handleChangeData('ano', text)} value={data.ano.toString()}></BottomSheetTextInput>
                            </View>
                        </View>

                        <View style={styles.modalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Hora</Text>

                            <View style={styles.modalTimeInput}>
                                <BottomSheetTextInput style={{
                                    width: '15%',
                                    height: 0.05 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    lineHeight: 7.7 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                    textAlign: 'center'
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false} onChangeText={(text) => handleChangeHorario('hora', text)} value={horario.hora.toString()}></BottomSheetTextInput>

                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>:</Text>

                                <BottomSheetTextInput style={{
                                    width: '15%',
                                    height: 0.05 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    lineHeight: 7.7 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                    textAlign: 'center'
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false} onChangeText={(text) => handleChangeData('minuto', text)} value={horario.minuto.toString()}></BottomSheetTextInput>
                            </View>
                        </View>

                        <View style={styles.modalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Tipo de Medição</Text>

                            <View style={styles.modalChipInput}>
                                {/* Chip Jejum */}
                                <Pressable style={[styles.modalChipInputOption, tipoMedicao === 'jejum' && { backgroundColor: '#6C83A1' }]} onPress={() => setTipoMedicao('jejum')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao === 'jejum' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Jejum</Text>
                                </Pressable>

                                {/* Chip Pré-refeição */}
                                <Pressable style={[styles.modalChipInputOption, tipoMedicao === 'pre_refeicao' && { backgroundColor: '#6C83A1' }]} onPress={() => setTipoMedicao('pre_refeicao')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao === 'pre_refeicao' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Pré-refeição</Text>
                                </Pressable>

                                {/* Chip Pós-refeição */}
                                <Pressable style={[styles.modalChipInputOption, tipoMedicao === 'pos_refeicao' && { backgroundColor: '#6C83A1' }]} onPress={() => setTipoMedicao('pos_refeicao')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao === 'pos_refeicao' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Pós-refeição</Text>
                                </Pressable>

                                {/* Chip Aleatória */}
                                <Pressable style={[styles.modalChipInputOption, tipoMedicao === 'aleatoria' && { backgroundColor: '#6C83A1' }]} onPress={() => setTipoMedicao('aleatoria')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao === 'aleatoria' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Aleatória</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.modalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>
                                Observações
                            </Text>

                            <BottomSheetTextInput style={{
                                width: '100%',
                                height: 0.15 * height,
                                padding: 0.008 * height,
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                lineHeight: 7.7 * scale,
                                backgroundColor: '#fff',
                                borderColor: '#eee',
                                borderWidth: 0.002 * height,
                                borderRadius: 0.01 * height,
                                color: '#6C83A1',
                                textAlignVertical: 'top',
                            }} scrollEnabled={false} multiline={true} onChangeText={setObservacoes} value={observacoes}></BottomSheetTextInput>
                        </View>

                        <Pressable style={styles.saveBtn} onPress={() => helperSave()}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 8 * scale,
                                color: '#fff',
                                lineHeight: 9 * scale
                            }}>
                                Salvar
                            </Text>
                        </Pressable>

                        <View style={{
                            width: '100%',
                            height: 0.0444 * width,
                        }}></View>
                    </BottomSheetScrollView>
                </BottomSheetModal>

                <BatimentoModalGrafico visible={graficoModalVisible} setVisible={setGraficoModalVisible} width={width} height={height} scale={scale}></BatimentoModalGrafico>

                {/* Modal de Ajuda */}
                <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                    <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                        <Pressable style={styles.modalBackdrop} onPress={() => setMostrarModalAjuda(false)}>
                            <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1' }}>Ajuda</Text>
                                </View>

                                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 0.015 * height }} showsVerticalScrollIndicator={false}>
                                    <View style={styles.helpSection}>
                                        <Text style={{
                                            fontFamily: 'Poppins-SB',
                                            fontSize: 9 * scale,
                                            color: '#6C83A1',
                                        }}>Glicemia</Text>
                                    </View>

                                    <View style={styles.helpSection}>
                                        <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                            <Ionicons name="information-circle" size={0.05 * width} color="#6C83A1" />
                                            <Text style={{
                                                fontFamily: 'Poppins-SB',
                                                fontSize: 7 * scale,
                                                color: '#6C83A1',
                                            }}>Função:</Text>
                                        </View>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: '#8A9CB3',
                                        }}>Monitorar o nível de açúcar no sangue (Glicemia).</Text>
                                    </View>

                                    <View style={styles.helpSection}>
                                        <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                            <Ionicons name="list-circle" size={0.05 * width} color="#6C83A1" />
                                            <Text style={{
                                                fontFamily: 'Poppins-SB',
                                                fontSize: 7 * scale,
                                                color: '#6C83A1',
                                            }}>Campos:</Text>
                                        </View>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: '#8A9CB3',
                                        }}>Valor (mg/dL), data, hora, tipo (jejum, pós-refeição, etc).</Text>
                                    </View>
                                </ScrollView>
                            </Pressable>
                        </Pressable>
                    </BlurView>
                </Modal>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default Glicemia;