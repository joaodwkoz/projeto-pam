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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { dynamicStyles } from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BatimentoModalGrafico from '../../components/BatimentoModalGrafico';
import GlicemiaModalGrafico from '../../components/GlicemiaModalGrafico';

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

    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const getGlicemiaColor = (valor) => {
        if (valor > 140) {
            return '#f09b9b';
        } else if (valor < 70) {
            return '#abc4f1'; 
        } else {
            return '#d6f1ab';
        }
    }

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
    const snapPoints = useMemo(() => ['65%'], []); 

    const [modalState, setModalState] = useState(null); 
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
        setValor('');
        setTipoMedicao('');
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
        
        setValor(item.valor.toString());
        setTipoMedicao(item.tipo_medicao);
        setObservacoes(item.observacoes || '');
        
        if (item.data) {
            const parts = item.data.split('-');
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
        if (!valor || !tipoMedicao) return;

        setIsSaving(true);
        
        const valorInt = Number(valor);
        const pad = (num) => String(num).padStart(2, '0');
        
        const dataFormatada = `${data.ano}-${pad(data.mes)}-${pad(data.dia)}`;
        const horaFormatada = `${pad(horario.hora)}:${pad(horario.minuto)}:00`;
        const dataHoraMedicao = `${dataFormatada} ${horaFormatada}`;

        const payload = {
            valor: valorInt,
            tipo_medicao: tipoMedicao,
            data_hora_medicao: dataHoraMedicao,
            observacoes: observacoes.trim() ? observacoes.trim() : null,
        };

        try {
            if (modalState === 'create') {
                await api.post('/glicemias', payload);
            } else if (modalState === 'edit' && selectedItem) {
                await api.put(`/glicemias/${selectedItem.id}`, payload);
            }
            
            bottomSheetRef.current?.dismiss(); 
            fetchUserHistory();
            fetchUserCards();
        } catch (e) {
            console.error('Erro ao salvar:', e);
            Alert.alert("Erro", "Verifique os dados inseridos.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleDelete = async () => {
        if (!selectedItem) return;
        
        setIsDeleting(true);
        
        try {
            await api.delete(`/glicemias/${selectedItem.id}`);
            bottomSheetRef.current?.dismiss();
            fetchUserHistory();
            fetchUserCards();
        } catch (e) {
            console.error('Erro ao deletar:', e);
        } finally {
            setIsDeleting(false);
        }
    }

    const renderModalContent = () => {
        if (modalState === 'view' && selectedItem) {
            return (
                <View style={{ width: '100%', gap: 0.0222 * height }}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <FontAwesome6 name="droplet" size={48} color={getGlicemiaColor(selectedItem.valor)} />
                        
                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 10 * scale, color: getGlicemiaColor(selectedItem.valor), marginTop: 5 }}>
                            {selectedItem.valor} mg/dL
                        </Text>
                        
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1' }}>
                            {getTipoMedicaoLabel(selectedItem.tipo_medicao)}
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
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Glicemia (mg/dL)</Text>
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
                            onChangeText={setValor} 
                            value={valor}
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
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Tipo de Medição</Text>
                        <View style={styles.modalChipInput}>
                            {['jejum', 'pre_refeicao', 'pos_refeicao', 'aleatoria'].map((tipo) => (
                                <Pressable 
                                    key={tipo}
                                    style={[styles.modalChipInputOption, tipoMedicao === tipo && { backgroundColor: '#6C83A1' }]} 
                                    onPress={() => setTipoMedicao(tipo)}
                                >
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: tipoMedicao === tipo ? '#fff' : '#6C83A1', lineHeight: 8 * scale }}>
                                        {getTipoMedicaoLabel(tipo)}
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

    const [periodo, setPeriodo] = useState('7d');
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

                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 13 * scale, color: '#6C83A1', lineHeight: 17 * scale }}>Glicemia</Text>

                    <View style={styles.headerSection}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 9 * scale, color: '#6C83A1', lineHeight: 9.9 * scale }}>Histórico</Text>
                        <Pressable style={styles.graphViewBtn} onPress={() => setGraficoModalVisible(true)}>
                            <Octicons name="graph" size={20} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.resumeSection}>
                        {isLoadingCards ? (
                            <View style={{ width: '100%', height: height * 0.17, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator color='#6C83A1' size="large" /> 
                            </View>
                        ): (
                            <>
                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <MaterialCommunityIcons name="food-off" size={0.025 * height} color="#baabf1ff" />
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: '#baabf1ff', lineHeight: 8 * scale }}>Jejum</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#baabf1ff', lineHeight: 9 * scale }}>{cards.media_jejum ? Math.round(cards.media_jejum) : 0}mg/dL</Text>
                                </View>

                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <FontAwesome5 name="clipboard-list" size={24} color="#abc4f1ff" />
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: '#abc4f1ff', lineHeight: 8 * scale }}>Média</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#abc4f1ff', lineHeight: 9 * scale }}>{cards.media ? Math.round(cards.media) : 0}mg/dL</Text>
                                </View>

                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <AntDesign name="fire" size={24} color="#f09b9bff" />
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: '#f09b9bff', lineHeight: 8 * scale }}>Máximo</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#f09b9bff', lineHeight: 9 * scale }}>{cards.maximo ? Math.round(cards.maximo) : 0}mg/dL</Text>
                                </View>

                                <View style={styles.resumeCard}>
                                    <View style={styles.resumeCardInfo}>
                                        <FontAwesome6 name="snowflake" size={24} color="#d6f1abff" />
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: '#d6f1abff', lineHeight: 8 * scale }}>Mínimo</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#d6f1abff', lineHeight: 9 * scale }}>{cards.minimo ? Math.round(cards.minimo) : 0}mg/dL</Text>
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.history}>
                        <View style={styles.historyOptions}>
                            {['24h', '7d', '30d', '365d'].map(p => (
                                <Pressable key={p} style={[styles.historyOption, periodo === p && { backgroundColor: '#6C83A1' }]} onPress={() => setPeriodo(p)}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: periodo === p ? '#fff' : '#6C83A1', lineHeight: 10 * scale }}>{p}</Text>
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
                                            <FontAwesome6 name="droplet" size={32} color={getGlicemiaColor(item.valor)} />
                                            
                                            <View style={styles.historyItemInfo}>
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: getGlicemiaColor(item.valor), lineHeight: 10 * scale }}>{item.valor} mg/dL</Text>
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#00000030', lineHeight: 9 * scale }}>{getTipoMedicaoLabel(item.tipo_medicao)} - {item.hora}</Text>
                                            </View>
                                        </View>
                                        <Pressable onPress={() => openView(item)}>
                                            <Entypo name="chevron-right" size={24} color="#00000030" />
                                        </Pressable>
                                    </View>
                                )}
                                ItemSeparatorComponent={() => (<View style={{ width: '100%', height: 0.0444 * width }}></View>)}
                                renderSectionHeader={({ section }) => {
                                    const sectionIndex = history.indexOf(section);
                                    const isFirst = sectionIndex === 0;
                                    const isLast = sectionIndex === history.length - 1;
                                    
                                    let headerStyles = { fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 11 * scale, paddingBottom: 0, paddingTop: 0 };
                                    
                                    if (isFirst) { headerStyles.paddingBottom = PADDING_BOTTOM; headerStyles.paddingTop = 0; }
                                    else if (isLast) { headerStyles.paddingTop = PADDING_VERTICAL; headerStyles.paddingBottom = 0; }
                                    else { headerStyles.paddingTop = PADDING_VERTICAL; headerStyles.paddingBottom = PADDING_BOTTOM; }
                                    
                                    return <Text style={headerStyles}>{section.title} (Média: {Math.round(section.media_dia || 0)} mg/dL)</Text>;
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

                <GlicemiaModalGrafico visible={graficoModalVisible} setVisible={setGraficoModalVisible} width={width} height={height} scale={scale}></GlicemiaModalGrafico>

                <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                    <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                        <Pressable style={styles.modalBackdrop} onPress={() => setMostrarModalAjuda(false)}>
                            <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1' }}>Ajuda</Text>
                                </View>
                                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 0.015 * height }} showsVerticalScrollIndicator={false}>
                                    <View style={styles.helpSection}>
                                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 9 * scale, color: '#6C83A1' }}>Glicemia</Text>
                                    </View>
                                    <View style={styles.helpSection}>
                                        <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                            <Ionicons name="information-circle" size={0.05 * width} color="#6C83A1" />
                                            <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Função:</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Monitorar o nível de açúcar no sangue (Glicemia).</Text>
                                    </View>
                                    <View style={styles.helpSection}>
                                        <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                            <Ionicons name="list-circle" size={0.05 * width} color="#6C83A1" />
                                            <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Campos:</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Valor (mg/dL), data, hora, tipo (jejum, pós-refeição, etc).</Text>
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