import { View, Pressable, Text, PixelRatio, useWindowDimensions, ScrollView, Share, Alert, Modal } from 'react-native';
import { useState, useEffect, useContext, useMemo } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { BlurView } from 'expo-blur';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { dynamicStyles } from './styles';
import { QUOTES, QUICK_TIPS } from '../../constants/app';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const STORAGE_KEY = 'notifications';

const Motivacao = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);
    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);

    const [categoria, setCategoria] = useState('Ansiedade');
    const [texto, setTexto] = useState('');
    const [autor, setAutor] = useState('');
    const [dicaRapida, setDicaRapida] = useState('');

    const [frequenciaIndex, setFrequenciaIndex] = useState(0); 
    const [mostrarOpcoesFrequencia, setMostrarOpcoesFrequencia] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const FREQUENCIAS = [
        { label: 'Ao acordar (08:00)', valor: 'morning', hour: 8, cor: '#f4978e', icon: 'weather-sunny' },
        { label: 'Meio-dia (12:00)', valor: 'noon', hour: 12, cor: '#ffcb77', icon: 'clock-time-four-outline' },
        { label: 'Fim de tarde (18:00)', valor: 'evening', hour: 18, cor: '#fff1a8', icon: 'weather-sunset' },
        { label: 'Antes de dormir (22:00)', valor: 'night', hour: 22, cor: '#b0e3c7', icon: 'weather-night' },
        { label: 'Aleatoriamente', valor: 'random', hour: -1, cor: '#a8d8ff', icon: 'shuffle-variant' },
        { label: 'Desativado', valor: 'off', hour: null, cor: '#dedede', icon: 'bell-off-outline' }
    ];

    useEffect(() => {
        const pedirPermissao = async () => {
            const { status } = await Notifications.requestPermissionsAsync(); 
            if (status !== 'granted') {
                Alert.alert('Atenção', '⚠️ Você negou a permissão de notificações.');
            }
        };

        const loadPreferences = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.motivation) {
                        setFrequenciaIndex(parsed.motivation.index);
                        setNotificationId(parsed.motivation.id);
                    }
                }
            } catch (e) {
                console.error("Erro ao carregar preferências:", e);
            }
        };

        pedirPermissao();
        loadPreferences();
        getRandomQuote(categoria);
        getRandomQuickTip();
    }, []);

    useEffect(() => {
        getRandomQuote(categoria);
    }, [categoria]);

    const cancelNotification = async (id) => {
        if (id) {
            await Notifications.cancelScheduledNotificationAsync(id);
        }
    };

    const scheduleNotification = async (hour) => {
        let trigger = {};

        if (hour === -1) {
            const randomHour = Math.floor(Math.random() * (20 - 9 + 1) + 9);
            trigger = { hour: randomHour, minute: 0, repeats: true };
        } else {
            trigger = { hour: hour, minute: 0, repeats: true };
        }

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Momento de Motivação ✨",
                body: "Toque para ver sua mensagem do dia e recarregar as energias!",
                sound: true,
            },
            trigger,
        });

        return id;
    };

    const handleConfigNotification = async (index) => {
        const selectedFreq = FREQUENCIAS[index];
        setFrequenciaIndex(index);
        setMostrarOpcoesFrequencia(false);

        try {
            if (notificationId) {
                await cancelNotification(notificationId);
            }

            let newNotifId = null;

            if (selectedFreq.valor !== 'off') {
                newNotifId = await scheduleNotification(selectedFreq.hour);
            }

            setNotificationId(newNotifId);

            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : {};
            
            const newData = {
                ...parsed,
                motivation: {
                    index: index,
                    id: newNotifId
                }
            };

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

        } catch (e) {
            console.error("Erro ao configurar notificação:", e);
            Alert.alert("Erro", "Não foi possível salvar a configuração.");
        }
    };

    const getRandomQuote = (category) => {
        const rand = Math.floor(Math.random() * QUOTES[category.toLowerCase()].length);
        setTexto(QUOTES[category.toLowerCase()][rand].texto);
        setAutor(QUOTES[category.toLowerCase()][rand].autor);
    }

    const getNewQuote = () => {
        const rand = Math.floor(Math.random() * QUOTES[categoria.toLowerCase()].length);
        setTexto(QUOTES[categoria.toLowerCase()][rand].texto);
        setAutor(QUOTES[categoria.toLowerCase()][rand].autor);
    }

    const getRandomQuickTip = () => {
        const rand = Math.floor(Math.random() * QUICK_TIPS.length);
        setDicaRapida(QUICK_TIPS[rand]);
    }

    const shareQuote = async () => {
        try {
            await Share.share({
                message: `Olha o conselho que eu acabei de receber: "${texto}" — ${autor}!`
            });
        } catch (error) {
            alert(error.message);
        }
    }

    const opcoesDisponíveis = FREQUENCIAS.map((item, index) => ({...item, originalIndex: index}))
                                         .filter(item => item.originalIndex !== frequenciaIndex);

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

            <ScrollView 
                style={{ flex: 1, width: '100%' }} 
                contentContainerStyle={{ gap: 0.0444 * width, paddingBottom: 0.0889 * width }} 
                showsVerticalScrollIndicator={false}
            >
                <View style={{ gap: 0.0111 * width }}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 10.75 * scale,
                        color: '#6C83A1',
                        lineHeight: 13.075 * scale
                    }}>Bom dia, {usuario.name}!</Text>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        color: '#899fbbff',
                        lineHeight: 10 * scale
                    }}>Precisando de uma motivação para o dia de hoje?</Text>
                </View>

                <View style={styles.advice}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 8 * scale,
                        color: '#6C83A1',
                        lineHeight: 11 * scale
                    }}>
                        { texto }
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 6 * scale,
                        color: '#acbed4ff',
                        lineHeight: 9 * scale
                    }}>
                        — {autor}
                    </Text>

                    <View style={styles.actions}>
                        <Pressable style={styles.action} onPress={() => shareQuote()}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#6C83A1',
                                lineHeight: 9 * scale
                            }}>
                                Compartilhar
                            </Text>
                        </Pressable>

                        <Pressable style={[styles.action, { backgroundColor: '#6C83A1'}]} onPress={() => getNewQuote()}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#fff',
                                lineHeight: 9 * scale
                            }}>
                                Novo
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.categories}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 8 * scale,
                        color: '#6C83A1',
                        lineHeight: 11 * scale
                    }}>Categorias:</Text>

                    <View style={styles.categoriesList}>
                        <Pressable style={[styles.category, { backgroundColor: categoria === 'Ansiedade' ? '#6C83A1' : '#fafafa' }]} onPress={() => setCategoria('Ansiedade')}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: categoria === 'Ansiedade' ? '#fff' : '#6C83A1',
                                lineHeight: 9 * scale
                            }}>
                                Ansiedade
                            </Text>
                        </Pressable>

                        <Pressable style={[styles.category, { backgroundColor: categoria === 'Foco' ? '#6C83A1' : '#fafafa' }]} onPress={() => setCategoria('Foco')}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: categoria === 'Foco' ? '#fff' : '#6C83A1',
                                lineHeight: 9 * scale
                            }}>
                                Foco
                            </Text>
                        </Pressable>

                        <Pressable style={[styles.category, { backgroundColor: categoria === 'Sono' ? '#6C83A1' : '#fafafa' }]} onPress={() => setCategoria('Sono')}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: categoria === 'Sono' ? '#fff' : '#6C83A1',
                                lineHeight: 9 * scale
                            }}>
                                Sono
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.quickTip}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 8 * scale,
                        color: '#6C83A1',
                        lineHeight: 11 * scale
                    }}>
                        Dica rápida:
                    </Text>

                    <View style={styles.quickTipContainer}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            color: '#6C83A1',
                            lineHeight: 9 * scale
                        }}>
                            { dicaRapida }
                        </Text>
                    </View>
                </View>

                <View style={styles.configSection}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 8 * scale,
                        color: '#6C83A1',
                        lineHeight: 11 * scale
                    }}>Notificações Diárias:</Text>

                    <View style={{ position: 'relative', zIndex: 100 }}>
                        <Pressable style={styles.configSelect} onPress={() => setMostrarOpcoesFrequencia(!mostrarOpcoesFrequencia)}>
                            <View style={{ flexDirection: 'row', gap: 0.0222 * width, alignItems: 'center' }}>
                                <MaterialCommunityIcons 
                                    name={FREQUENCIAS[frequenciaIndex].icon} 
                                    size={width * 0.05} 
                                    color={FREQUENCIAS[frequenciaIndex].cor} 
                                />
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 9 * scale,
                                }}>
                                    {FREQUENCIAS[frequenciaIndex].label}
                                </Text>
                            </View>
                            
                            <Entypo name={mostrarOpcoesFrequencia ? "chevron-up" : "chevron-down"} size={16} color="#6C83A1" />
                        </Pressable>

                        {mostrarOpcoesFrequencia && (
                            <View style={styles.configOptionsContainer}>
                                {opcoesDisponíveis.map((item, i) => (
                                    <Pressable key={i} style={styles.configOption} onPress={() => handleConfigNotification(item.originalIndex)}>
                                        <MaterialCommunityIcons name={item.icon} size={width * 0.05} color={item.cor} />
                                        
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5.5 * scale,
                                            color: '#6C83A1'
                                        }}>{item.label}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

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
                                    }}>Motivação</Text>
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
                                    }}>Receber doses diárias de sabedoria e conselhos.</Text>
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
                                    }}>Categorias, Citações, Dicas.</Text>
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
                                    }}>Escolha a categoria do dia.</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Configure o horário da notificação.</Text>
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
                                    }}>Inspiração diária e redução do estresse.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </View>
    )
}

export default Motivacao;