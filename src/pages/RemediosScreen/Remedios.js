import { View, Pressable, Alert, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView, Keyboard } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';

import { dynamicStyles } from './styles';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const STORAGE_KEY = 'my_medications';

const Remedios = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();
    const navigation = useNavigation();

    const FREQUENCIAS = [
        { label: 'A cada 4 horas', valor: 4, notificacao: 'Urgente', cor: '#f4978e', icon: 'clock-alert-outline' },
        { label: 'A cada 6 horas', valor: 6, notificacao: 'Alta', cor: '#ffcb77', icon: 'clock-time-four-outline' },
        { label: 'A cada 8 horas', valor: 8, notificacao: 'Padrão', cor: '#fff1a8', icon: 'clock-time-eight-outline' },
        { label: 'A cada 12 horas', valor: 12, notificacao: 'Moderada', cor: '#b0e3c7', icon: 'clock-time-twelve-outline' },
        { label: 'Uma vez ao dia', valor: 24, notificacao: 'Baixa', cor: '#a8d8ff', icon: 'calendar-clock' },
    ];

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);
    const [modalState, setModalState] = useState('Create');

    const [idEditando, setIdEditando] = useState(null);
    const [notifIdEditando, setNotifIdEditando] = useState(null); 
    const [nome, setNome] = useState('');
    const [dosagem, setDosagem] = useState('');
    const [frequenciaIndex, setFrequenciaIndex] = useState(-1);
    const [mostrarOpcoesFrequencia, setMostrarOpcoesFrequencia] = useState(false);
    const [observacoes, setObservacoes] = useState('');

    const [remedios, setRemedios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const pedirPermissao = async () => {
            const { status } = await Notifications.requestPermissionsAsync(); 
            if (status !== 'granted') {
                Alert.alert('Atenção', '⚠️ Você negou a permissão de notificações.');
            }
        };
        pedirPermissao();
    }, []);

    const abrirModal = () => setMostrarModal(true);

    const fecharModal = () => {
        setMostrarModal(false);
        setModalState('Create');
        setIdEditando(null);
        setNotifIdEditando(null);
        setNome('');
        setDosagem('');
        setFrequenciaIndex(-1);
        setMostrarOpcoesFrequencia(false);
        setObservacoes('');
    }

    const scheduleNotification = async (nomeRemedio, horas) => {
        if (!horas) return null;

        const trigger = {
            seconds: horas * 60 * 60,
            repeats: true,
        };

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hora do Medicamento",
                body: `Está na hora de tomar: ${nomeRemedio}`,
                sound: true,
            },
            trigger,
        });

        return id;
    };

    const cancelNotification = async (notifId) => {
        if (notifId) {
            await Notifications.cancelScheduledNotificationAsync(notifId);
        }
    };

    const fetchRemedios = useCallback(async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            const dadosSalvos = jsonValue != null ? JSON.parse(jsonValue) : [];
            setRemedios(dadosSalvos);
        } catch (e) {
            console.error("Erro ao ler AsyncStorage:", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRemedios();
    }, []);

    const getNextId = (lista) => {
        if (!lista || lista.length === 0) return 1;
        const ids = lista.map(item => parseInt(item.id, 10));
        const maxId = Math.max(...ids);
        return maxId + 1;
    };

    const handleSaveRemedio = async () => {
        if (!nome || !dosagem || frequenciaIndex === -1) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha nome, dosagem e frequência.");
            return;
        }

        setIsSaving(true);
        Keyboard.dismiss();

        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            const listaAtual = jsonValue != null ? JSON.parse(jsonValue) : [];
            
            const novoId = getNextId(listaAtual);
            const freqInfo = FREQUENCIAS[frequenciaIndex];

            const notifId = await scheduleNotification(nome, freqInfo.valor);

            const novoRemedio = {
                id: novoId.toString(),
                notificationId: notifId,
                nome: nome,
                dosagem: dosagem,
                frequenciaIndex: frequenciaIndex,
                frequenciaLabel: freqInfo.label,
                frequenciaValor: freqInfo.valor,
                observacoes: observacoes,
                dataCriacao: new Date().toISOString()
            };

            const novaLista = [...listaAtual, novoRemedio];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
            
            setRemedios(novaLista);
            fecharModal();
        } catch (e) {
            console.error("Erro ao salvar:", e);
            Alert.alert("Erro", "Falha ao salvar localmente.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleUpdateRemedio = async () => {
        if (!nome || !dosagem || frequenciaIndex === -1) {
            Alert.alert("Campos obrigatórios", "Preencha os dados corretamente.");
            return;
        }

        setIsSaving(true);
        Keyboard.dismiss();

        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            let listaAtual = jsonValue != null ? JSON.parse(jsonValue) : [];

            const freqInfo = FREQUENCIAS[frequenciaIndex];

            if (notifIdEditando) {
                await cancelNotification(notifIdEditando);
            }
            const novoNotifId = await scheduleNotification(nome, freqInfo.valor);

            const novaLista = listaAtual.map(item => {
                if (item.id === idEditando) {
                    return {
                        ...item,
                        notificationId: novoNotifId, 
                        nome: nome,
                        dosagem: dosagem,
                        frequenciaIndex: frequenciaIndex,
                        frequenciaLabel: freqInfo.label,
                        frequenciaValor: freqInfo.valor,
                        observacoes: observacoes,
                        dataAtualizacao: new Date().toISOString()
                    };
                }
                return item;
            });

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
            setRemedios(novaLista);
            fecharModal();

        } catch(e) {
            console.error('Erro ao atualizar:', e);
            Alert.alert("Erro", "Falha ao atualizar.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleDeleteRemedio = async () => {
        Alert.alert(
            "Excluir Medicamento",
            "Tem certeza que deseja excluir este medicamento?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            if (notifIdEditando) {
                                await cancelNotification(notifIdEditando);
                            }

                            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
                            let listaAtual = jsonValue != null ? JSON.parse(jsonValue) : [];
                            
                            const novaLista = listaAtual.filter(item => item.id !== idEditando);
                            
                            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
                            setRemedios(novaLista);
                            fecharModal();
                        } catch (e) {
                            Alert.alert("Erro", "Não foi possível excluir.");
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleOpenUpdateModal = (remedioClicado) => {
        setModalState('Edit');
        setIdEditando(remedioClicado.id);
        setNotifIdEditando(remedioClicado.notificationId);
        setNome(remedioClicado.nome);
        setDosagem(remedioClicado.dosagem);
        
        let fIndex = remedioClicado.frequenciaIndex;
        if (fIndex === undefined || fIndex === -1) {
            fIndex = FREQUENCIAS.findIndex(f => f.label === remedioClicado.frequenciaLabel);
        }
        setFrequenciaIndex(fIndex !== -1 ? fIndex : -1);

        setObservacoes(remedioClicado.observacoes || '');
        setMostrarModal(true);
    };

    if (isLoading) {
        return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
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
            }}>Meus Remédios</Text>

            <View style={styles.status}>
                <View style={styles.statusCard}>
                    <MaterialCommunityIcons name="pill" size={width * 0.125} color="#6C83A1" />
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 8 * scale,
                        color: '#6C83A1',
                        lineHeight: 10 * scale
                    }}>{remedios.length > 0 ? remedios.length : 0} tratamentos ativos</Text>
                </View>
            </View>

            <View style={styles.myRemedies}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 10 * scale,
                    color: '#6C83A1',
                    lineHeight: 13 * scale
                }}>Medicamentos</Text>

                <Pressable style={styles.addRemedy} onPress={abrirModal}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        color: '#fff',
                        lineHeight: 7.7 * scale
                    }}>Adicionar</Text>
                </Pressable>
            </View>

            <ScrollView style={{
                flex: 1,
                width: '100%',
            }} contentContainerStyle={{
                gap: 0.0222 * height,
            }}>
                {
                    remedios.length > 0 && remedios.map((r, i) => {
                        const infoFreq = r.frequenciaIndex !== undefined && FREQUENCIAS[r.frequenciaIndex] 
                            ? FREQUENCIAS[r.frequenciaIndex] 
                            : { cor: '#dedede', icon: 'pill', valor: '?' };

                        const displayValor = infoFreq.valor === null ? 'SOS' : `${infoFreq.valor}h`;

                        return (
                            <Pressable style={styles.remedy} key={i} onPress={() => handleOpenUpdateModal(r)}>
                                <View style={styles.remedyInfo}>
                                    <View style={[styles.iconContainer, { backgroundColor: infoFreq.cor + '30' }]}>
                                        <MaterialCommunityIcons 
                                            name={infoFreq.icon} 
                                            size={width * 0.08} 
                                            color={infoFreq.cor} 
                                        />
                                    </View>

                                    <View style={{ justifyContent: 'center', maxWidth: '65%' }}>
                                        <Text style={{
                                            fontFamily: 'Poppins-SB',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 9 * scale
                                        }} numberOfLines={1}>{r.nome}</Text>
                                        
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5.5 * scale,
                                            color: '#97B9E5',
                                            lineHeight: 7 * scale
                                        }}>{r.dosagem}</Text>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 5 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 6 * scale
                                    }}>Intervalo</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: infoFreq.cor,
                                        lineHeight: 8 * scale
                                    }}>{displayValor}</Text>
                                </View>
                            </Pressable>
                        )
                    })
                }
            </ScrollView>

            <Modal visible={mostrarModal} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.remedyModalContainer}>
                    <View style={styles.remedyModal}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 8 * scale,
                                color: '#6C83A1',
                                lineHeight: 10 * scale 
                            }}>{modalState === 'Create' ? 'Novo medicamento' : 'Editar medicamento'}</Text>
                            
                            {modalState === 'Edit' && (
                                <Pressable onPress={handleDeleteRemedio}>
                                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="#f4978e" />
                                </Pressable>
                            )}
                        </View>

                        <View style={styles.remedyModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Nome</Text>

                            <TextInput style={styles.textInputStyle} 
                                scrollEnabled={false} 
                                multiline={false} 
                                value={nome} 
                                onChangeText={setNome}
                                placeholderTextColor="#ccc"
                            />
                        </View>

                        <View style={styles.remedyModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Dosagem (mg, ml, cp)</Text>

                            <TextInput style={styles.textInputStyle} 
                                scrollEnabled={false} 
                                multiline={false} 
                                value={dosagem} 
                                onChangeText={setDosagem}
                                placeholderTextColor="#ccc"
                            />
                        </View>

                        <View style={[styles.remedyModalInput, { zIndex: 100 }]}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Frequência & Notificação</Text>

                            <Pressable style={styles.remedyModalSelect} onPress={() => setMostrarOpcoesFrequencia(!mostrarOpcoesFrequencia)}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: frequenciaIndex !== -1 ? '#6C83A1' : '#ccc',
                                    lineHeight: 9 * scale,
                                }}>
                                    {frequenciaIndex !== -1 
                                        ? `${FREQUENCIAS[frequenciaIndex].label}` 
                                        : 'Selecione a frequência'}
                                </Text>
                                
                                <Entypo name={mostrarOpcoesFrequencia ? "chevron-up" : "chevron-down"} size={16} color="#6C83A1" style={{ position: 'absolute', right: 10 }}/>
                            </Pressable>

                            {mostrarOpcoesFrequencia && (
                                <View style={styles.remedyModalOptionsContainer}>
                                    <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ gap: 0.01 * height }} showsVerticalScrollIndicator={false}>
                                        {FREQUENCIAS.map((item, index) => (
                                            <Pressable key={index} style={styles.remedyModalOption} onPress={() => {
                                                setFrequenciaIndex(index);
                                                setMostrarOpcoesFrequencia(false);
                                            }}>
                                                <MaterialCommunityIcons name={item.icon} size={width * 0.05} color={item.cor} />
                                                
                                                <View style={{flex: 1}}>
                                                    <Text style={{
                                                        fontFamily: 'Poppins-M',
                                                        fontSize: 5.5 * scale,
                                                        color: '#6C83A1'
                                                    }}>{item.label}</Text>
                                                    
                                                    <Text style={{
                                                        fontFamily: 'Poppins-M',
                                                        fontSize: 4 * scale,
                                                        color: '#b0b0b0'
                                                    }}>Notificação: {item.notificacao}</Text>
                                                </View>

                                                {frequenciaIndex === index && <Ionicons name="checkmark" size={16} color={item.cor} />}
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <View style={[styles.remedyModalInput, { zIndex: 1 }]}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Observações</Text>

                            <TextInput style={styles.textInputStyle} 
                                scrollEnabled={false} 
                                multiline={true} 
                                value={observacoes} 
                                onChangeText={setObservacoes}
                                placeholderTextColor="#ccc"
                                editable={!mostrarOpcoesFrequencia} 
                            />
                        </View>

                        <View style={styles.remedyModalActions}>
                            <Pressable style={styles.remedyModalBtn} onPress={fecharModal}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Cancelar</Text>
                            </Pressable>

                            <Pressable 
                                style={[styles.remedyModalBtn, { backgroundColor: '#6C83A1' }, isSaving && { opacity: 0.7 }]} 
                                onPress={() => {
                                    if (modalState === 'Create') handleSaveRemedio();
                                    else handleUpdateRemedio();
                                }}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 7 * scale,
                                        color: '#fff',
                                        lineHeight: 7.7 * scale 
                                    }}>Salvar</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </BlurView>
            </Modal>

            <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.remedyModalContainer}>
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
                                    }}>Remédios</Text>
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
                                    }}>Organizar seus remédios e horários com lembretes.</Text>
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
                                    }}>Nome, dosagem, horário, frequência, observações.</Text>
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
                                    }}>Cadastre o medicamento e o horário.</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>O app envia notificações lembrando de tomar.</Text>
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
                                    }}>Controle das doses + histórico de uso.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </View>
    )
}

export default Remedios;