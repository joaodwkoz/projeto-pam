import { 
    View, 
    Pressable, 
    Text, 
    PixelRatio, 
    useWindowDimensions, 
    ActivityIndicator, 
    SectionList, 
    ScrollView, 
    Modal, 
    Alert 
} from 'react-native';
import { 
    useState, 
    useEffect, 
    useContext, 
    useCallback, 
    useRef, 
    useMemo 
} from 'react';
import BottomSheet, { 
    BottomSheetModal, 
    BottomSheetTextInput, 
    BottomSheetScrollView, 
    BottomSheetModalProvider, 
    BottomSheetView 
} from '@gorhom/bottom-sheet';
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

import { dynamicStyles } from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BatimentoModalGrafico from '../../components/BatimentoModalGrafico';

let atual = new Date();

const Batimentos = () => {
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

    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const getHeartColor = (bpm) => {
        if (bpm > 100) {
            return '#f09b9b';
        } else if (bpm < 60) {
            return '#abc4f1';
        } else {
            return '#d6f1ab';
        }
    }

    const getCondicao = (condicao) => {
        const mp = {
            'repouso': 'Repouso',
            'pos_exercicio': 'Pós-exercício',
            'monitoramento': 'Monitoramento',
            'aleatorio': 'Aleatório'
        }
        return mp[condicao] || condicao;
    }

    const bottomSheetRef = useRef(null);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const snapPoints = useMemo(() => ['65%'], []); 

    const [modalState, setModalState] = useState(null); 
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [periodo, setPeriodo] = useState('7d');

    const [bpm, setBpm] = useState('');
    const [condicao, setCondicao] = useState(''); 
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

    const handleSheetChanges = useCallback((index) => {
        setSheetIndex(index);
        if (index === -1) {
            clearModal();
        }
    }, []);

    const clearModal = () => {
        setModalState(null);
        setSelectedItem(null);
        resetForm();
        setIsSaving(false);
        setIsDeleting(false);
    }

    const resetForm = () => {
        atual = new Date();
        setBpm('');
        setCondicao('');
        setObservacoes('');
        
        setHorario({ 
            hora: atual.getHours(), 
            minuto: atual.getMinutes() 
        });
        
        setData({ 
            dia: atual.getDate(), 
            mes: atual.getMonth() + 1, 
            ano: atual.getFullYear() 
        });
    }

    const openCreate = () => {
        resetForm();
        setModalState('create');
        bottomSheetRef.current?.present();
    }

    const openView = (item) => {
        setSelectedItem(item);
        setModalState('view');
        
        setBpm(item.bpm.toString());
        setCondicao(item.condicao);
        setObservacoes(item.observacoes || '');
        
        try {
            if (item.data) {
                const parts = item.data.split(/[-/]/); 
                if (parts.length === 3) {
                    setData({
                        dia: parts[0],
                        mes: parts[1],
                        ano: parts[2]
                    });
                }
            }

            if (item.hora) {
                const timeParts = item.hora.split(':');
                if (timeParts.length >= 2) {
                    setHorario({
                        hora: timeParts[0],
                        minuto: timeParts[1]
                    });
                }
            }
        } catch (e) {
            console.error("Erro ao parsear data:", e);
        }

        bottomSheetRef.current?.present();
    }

    const openEdit = () => setModalState('edit');
    const openDelete = () => setModalState('delete');

    const handleCloseModal = () => {
        bottomSheetRef.current?.dismiss();
        clearModal();
    }

    const handleChangeData = (key, value) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleChangeHorario = (key, value) => {
        setHorario(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!bpm || !condicao) return; 

        setIsSaving(true);
        
        const bpmInt = Number(bpm);
        const pad = (num) => String(num).padStart(2, '0');
        
        const dataFormatada = `${data.ano}-${pad(data.mes)}-${pad(data.dia)}`;
        const horaFormatada = `${pad(horario.hora)}:${pad(horario.minuto)}:00`;
        const dataHoraMedicao = `${dataFormatada} ${horaFormatada}`;

        const payload = {
            bpm: bpmInt,
            condicao: condicao,
            data_hora_medicao: dataHoraMedicao,
            observacoes: observacoes.trim() ? observacoes.trim() : null,
        };

        try {
            if (modalState === 'create') {
                await api.post('/batimentos', payload);
            } else if (modalState === 'edit' && selectedItem) {
                await api.put(`/batimentos/${selectedItem.id}`, payload);
            }
            
            bottomSheetRef.current?.dismiss(); 
            fetchUserHistory();
            fetchUserCards();
        } catch (e) {
            console.error('Erro ao salvar batimento:', e);
            Alert.alert("Erro", "Não foi possível salvar.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleDelete = async () => {
        if (!selectedItem) return;
        
        setIsDeleting(true);
        
        try {
            await api.delete(`/batimentos/${selectedItem.id}`);
            bottomSheetRef.current?.dismiss();
            fetchUserHistory();
            fetchUserCards();
        } catch (e) {
            console.error('Erro ao deletar:', e);
            Alert.alert("Erro", "Não foi possível remover.");
        } finally {
            setIsDeleting(false);
        }
    }

    const renderModalContent = () => {
        if (modalState === 'view' && selectedItem) {
            return (
                <View style={{ width: '100%', gap: 0.0222 * height }}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <FontAwesome name="heart" size={48} color={getHeartColor(selectedItem.bpm)} />
                        
                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 10 * scale, color: getHeartColor(selectedItem.bpm), marginTop: 5 }}>
                            {selectedItem.bpm} BPM
                        </Text>
                        
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1' }}>
                            {getCondicao(selectedItem.condicao)}
                        </Text>
                        
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#999' }}>
                            {selectedItem.data} às {selectedItem.hora}
                        </Text>
                    </View>

                    {selectedItem.observacoes && (
                        <View style={{ backgroundColor: '#F5F7FB', padding: 15, borderRadius: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-SB', fontSize: 6 * scale, color: '#6C83A1' }}>Observações:</Text>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#666' }}>{selectedItem.observacoes}</Text>
                        </View>
                    )}

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
                        <Pressable 
                            style={[styles.saveBtn, { flex: 1, backgroundColor: '#6C83A1', flexDirection: 'row', gap: 8 }]} 
                            onPress={openEdit}
                        >
                            <AntDesign name="edit" size={18} color="#fff" />
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Editar</Text>
                        </Pressable>

                        <Pressable 
                            style={[styles.saveBtn, { flex: 1, backgroundColor: '#e11d48', flexDirection: 'row', gap: 8 }]} 
                            onPress={openDelete}
                        >
                            <AntDesign name="delete" size={18} color="#fff" />
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Excluir</Text>
                        </Pressable>
                    </View>
                </View>
            );
        }

        if (modalState === 'delete' && selectedItem) {
            return (
                <View style={{ width: '100%', gap: 20, alignItems: 'center' }}>
                    <AntDesign name="warning" size={40} color="#e11d48" />
                    
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', textAlign: 'center' }}>
                        Confirmar exclusão?
                    </Text>
                    
                    <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                        <Pressable 
                            style={[styles.saveBtn, { flex: 1, backgroundColor: '#ccc' }]} 
                            onPress={() => setModalState('view')} 
                            disabled={isDeleting}
                        >
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Cancelar</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={[styles.saveBtn, { flex: 1, backgroundColor: '#e11d48' }]} 
                            onPress={handleDelete} 
                            disabled={isDeleting}
                        >
                            {isDeleting ? <ActivityIndicator color="#fff" /> : 
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Confirmar</Text>}
                        </Pressable>
                    </View>
                </View>
            );
        }

        if (modalState === 'create' || modalState === 'edit') {
            return (
                <View style={{ width: '100%', gap: 0.0444 * width }}>
                    
                    <View style={styles.modalInput}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>
                            Batimentos (BPM)
                        </Text>
                        <BottomSheetTextInput 
                            style={{
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
                            }} 
                            keyboardType='numeric' 
                            maxLength={4} 
                            onChangeText={setBpm} 
                            value={bpm}
                            placeholder="000"
                        />
                    </View>

                    <View style={styles.modalInput}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Data</Text>
                        <View style={styles.modalDateInput}>
                            <BottomSheetTextInput 
                                style={{
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
                                }} 
                                keyboardType='numeric' 
                                maxLength={2} 
                                onChangeText={(t) => handleChangeData('dia', t)} 
                                value={data.dia.toString()} 
                            />
                            
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>/</Text>
                            
                            <BottomSheetTextInput 
                                style={{
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
                                }} 
                                keyboardType='numeric' 
                                maxLength={2} 
                                onChangeText={(t) => handleChangeData('mes', t)} 
                                value={data.mes.toString()} 
                            />
                            
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>/</Text>
                            
                            <BottomSheetTextInput 
                                style={{
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
                                }} 
                                keyboardType='numeric' 
                                maxLength={4} 
                                onChangeText={(t) => handleChangeData('ano', t)} 
                                value={data.ano.toString()} 
                            />
                        </View>
                    </View>

                    <View style={styles.modalInput}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Hora</Text>
                        <View style={styles.modalTimeInput}>
                            <BottomSheetTextInput 
                                style={{
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
                                }} 
                                keyboardType='numeric' 
                                maxLength={2} 
                                onChangeText={(t) => handleChangeHorario('hora', t)} 
                                value={horario.hora.toString()} 
                            />
                            
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>:</Text>
                            
                            <BottomSheetTextInput 
                                style={{
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
                                }} 
                                keyboardType='numeric' 
                                maxLength={2} 
                                onChangeText={(t) => handleChangeHorario('minuto', t)} 
                                value={horario.minuto.toString()} 
                            />
                        </View>
                    </View>

                    <View style={styles.modalInput}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Condição</Text>
                        <View style={styles.modalChipInput}>
                            {['repouso', 'pos_exercicio', 'monitoramento', 'aleatorio'].map((tipo) => (
                                <Pressable 
                                    key={tipo}
                                    style={[styles.modalChipInputOption, condicao === tipo && { backgroundColor: '#6C83A1' }]} 
                                    onPress={() => setCondicao(tipo)}
                                >
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: condicao === tipo ? '#fff' : '#6C83A1', lineHeight: 8 * scale }}>
                                        {getCondicao(tipo)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.modalInput}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Observações</Text>
                        <BottomSheetTextInput 
                            style={{
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
                            }} 
                            multiline={true} 
                            onChangeText={setObservacoes} 
                            value={observacoes}
                        />
                    </View>

                    <Pressable style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
                        {isSaving ? <ActivityIndicator color="#fff" /> : 
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#fff', lineHeight: 9 * scale }}>
                            {modalState === 'create' ? 'Salvar' : 'Atualizar'}
                        </Text>}
                    </Pressable>
                    <View style={{ height: 20 }} />
                </View>
            );
        }
        return null;
    }

    const renderModalTitle = () => {
        if (modalState === 'create') return 'Adicionar medição';
        if (modalState === 'edit') return 'Editar medição';
        if (modalState === 'view') return 'Detalhes';
        if (modalState === 'delete') return 'Excluir medição';
        return '';
    };

    const [cards, setCards] = useState({});
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const fetchUserCards = useCallback(async () => {
        try {
            const res = await api.get(`/usuario/${usuario.id}/batimentos`);
            setCards(res.data);
        } catch(e) {
            console.error("Erro ao buscar batimentos do usuário:", e);
        } finally {
            setIsLoadingCards(false);
        }
    }, [usuario.id]);

    const fetchUserHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const res = await api.get(`/usuario/${usuario.id}/batimentos-por-periodo?periodo=${periodo}`); 
            setHistory(res.data.historico);
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

                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 13 * scale, color: '#6C83A1', lineHeight: 17 * scale }}>Batimentos</Text>

                    <View style={styles.headerSection}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 9 * scale, color: '#6C83A1', lineHeight: 9.9 * scale }}>
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
                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <AntDesign name="moon" size={0.025 * height} color="#baabf1ff" />
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#baabf1ff',
                                            lineHeight: 8 * scale
                                        }}>Repouso</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#baabf1ff',
                                        lineHeight: 9 * scale
                                    }}>{cards.media_repouso ? Math.round(cards.media_repouso) : 0}BPM</Text>
                                </View>

                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <FontAwesome6 name="heart-pulse" size={24} color="#abc4f1ff" />
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
                                    }}>{cards.media ? Math.round(cards.media) : 0}BPM</Text>
                                </View>

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
                                    }}>{cards.maximo ? Math.round(cards.maximo) : 0}BPM</Text>
                                </View>

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
                                    }}>{cards.minimo ? Math.round(cards.minimo) : 0}BPM</Text>
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.history}>
                        <View style={styles.historyOptions}>
                            {['24h', '7d', '30d', '365d'].map(p => (
                                <Pressable key={p} style={[styles.historyOption, periodo === p && { backgroundColor: '#6C83A1' }]} onPress={() => setPeriodo(p)}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 7 * scale,
                                        color: periodo === p ? '#fff' : '#6C83A1',
                                        lineHeight: 10 * scale
                                    }}>{p}</Text>
                                </Pressable>
                            ))}
                        </View>

                        {isLoadingHistory ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator color='#6C83A1' size="large" />
                            </View>
                        ) : (
                            <SectionList
                                sections={history}
                                keyExtractor={(item, index) => item + index}
                                renderItem={({item}) => (
                                    <View style={styles.historyItem}>
                                        <View style={styles.historyItemInfoContainer}>
                                            <FontAwesome name="heart" size={32} color={getHeartColor(item.bpm)} />

                                            <View style={styles.historyItemInfo}>
                                                <Text style={{
                                                    fontFamily: 'Poppins-M',
                                                    fontSize: 7 * scale,
                                                    color: getHeartColor(item.bpm),
                                                    lineHeight: 10 * scale
                                                }}>{item.bpm}BPM</Text>

                                                <Text style={{
                                                    fontFamily: 'Poppins-M',
                                                    fontSize: 6 * scale,
                                                    color: '#00000030',
                                                    lineHeight: 9 * scale
                                                }}>{getCondicao(item.condicao)} - {item.hora}</Text>
                                            </View>
                                        </View>

                                        <Pressable onPress={() => openView(item)}>
                                            <Entypo name="chevron-right" size={24} color="#00000030" />
                                        </Pressable>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => (
                                    <View style={{ width: '100%', height: 0.0444 * width }}></View>
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

                                    if (isFirst) { headerStyles.paddingBottom = PADDING_BOTTOM; headerStyles.paddingTop = 0; }
                                    else if (isLast) { headerStyles.paddingTop = PADDING_VERTICAL; headerStyles.paddingBottom = 0; }
                                    else { headerStyles.paddingTop = PADDING_VERTICAL; headerStyles.paddingBottom = PADDING_BOTTOM; }

                                    return (
                                        <Text style={headerStyles}>
                                            {section.title} (Média: {Math.round(section.media_bpm)}BPM)
                                        </Text>
                                    );
                                }}
                            />
                        )}
                    </View>

                    <Pressable style={styles.fab} onPress={openCreate}>
                        <Entypo name="plus" size={24} color="#fff" />
                    </Pressable>
                </View>

                <BottomSheetModal 
                    ref={bottomSheetRef} 
                    snapPoints={snapPoints} 
                    enablePanDownToClose={true} 
                    backgroundStyle={{ backgroundColor: '#fff' }} 
                    style={{ padding: 0.0444 * width, zIndex: 1000, position: 'relative' }} 
                    handleIndicatorStyle={{ backgroundColor: '#6C83A1' }} 
                    onChange={handleSheetChanges}
                >
                    <BottomSheetScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', gap: 0.0444 * width }}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 9 * scale, color: '#6C83A1', lineHeight: 12 * scale }}>
                            {renderModalTitle()}
                        </Text>
                        {renderModalContent()}
                    </BottomSheetScrollView>
                </BottomSheetModal>

                <BatimentoModalGrafico visible={graficoModalVisible} setVisible={setGraficoModalVisible} width={width} height={height} scale={scale}></BatimentoModalGrafico>

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
                                        }}>Batimentos</Text>
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
                                        }}>Monitorar a frequência cardíaca (BPM).</Text>
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
                                        }}>BPM, data, hora, condição (repouso, exercício).</Text>
                                    </View>

                                    <View style={styles.helpSection}>
                                        <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                            <Ionicons name="play-circle" size={0.05 * width} color="#6C83A1" />
                                            <Text style={{
                                                fontFamily: 'Poppins-SB',
                                                fontSize: 7 * scale,
                                                color: '#6C83A1',
                                            }}>Como usar:</Text>
                                        </View>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: '#8A9CB3',
                                        }}>Meça seus batimentos (manual ou smartwatch).</Text>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: '#8A9CB3',
                                        }}>Registre no app para acompanhar a evolução.</Text>
                                    </View>

                                    <View style={styles.helpSection}>
                                        <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                            <Ionicons name="checkmark-circle" size={0.05 * width} color="#6C83A1" />
                                            <Text style={{
                                                fontFamily: 'Poppins-SB',
                                                fontSize: 7 * scale,
                                                color: '#6C83A1',
                                            }}>Resultado esperado:</Text>
                                        </View>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: '#8A9CB3',
                                        }}>Gráficos de tendência e controle da saúde cardíaca.</Text>
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

export default Batimentos;