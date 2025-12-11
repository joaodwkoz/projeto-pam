import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView, Alert, Vibration } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { BlurView } from 'expo-blur';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { dynamicStyles } from './styles';
import { BASE_URL_STORAGE } from '../../constants/api';
import AguaModalHistorico from '../../components/AguaModalHistorico';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEY_SETTINGS = 'water_settings';

function formatDateToYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Agua = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);
    const scale = PixelRatio.get();
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const SVG_SIZE = width * 0.75;
    const strokeWidth = 0.0325 * height;
    const R = SVG_SIZE / 2.5;
    const CIRCLE_LENGTH = 2 * Math.PI * R;
    const progress = useSharedValue(0);

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const animatedProps = useAnimatedProps(() => {
      const dashOffset = CIRCLE_LENGTH * (1 - progress.value);
      return { strokeDashoffset: Math.max(dashOffset, 0) };
    });

    const progressText = useDerivedValue(() => {
      return `${Math.floor(progress.value * 100)}%`;
    });

    const [copos, setCopos] = useState([]);
    const [totalMl, setTotalMl] = useState(0);
    const [metaMl, setMetaMl] = useState(2000);
    
    const [isLoadingCups, setIsLoadingCups] = useState(true);
    const [mostrarMenuOpcoes, setMostrarMenuOpcoes] = useState(false);
    const [modalConfigVisible, setModalConfigVisible] = useState(false);
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);
    
    const [modalCopoVisible, setModalCopoVisible] = useState(false);
    const [modalCopoState, setModalCopoState] = useState('Create');
    const [nomeCopo, setNomeCopo] = useState("");
    const [capacidadeCopo, setCapacidadeCopo] = useState("");
    const [iconeCopoEscolhido, setIconeCopoEscolhido] = useState(-1);
    const [copoId, setCopoId] = useState(-1);
    const [mostrarOpcoesIcone, setMostrarOpcoesIcone] = useState(false);

    const [notifFreqIndex, setNotifFreqIndex] = useState(0);
    const [mostrarOpcoesNotif, setMostrarOpcoesNotif] = useState(false);
    const [notifId, setNotifId] = useState(null);

    const NOTIF_OPTIONS = [
        { label: 'A cada 1 hora', valor: 1 },
        { label: 'A cada 2 horas', valor: 2 },
        { label: 'A cada 3 horas', valor: 3 },
        { label: 'A cada 4 horas', valor: 4 },
        { label: 'Desativado', valor: null }
    ];

    const ICONS = [
      { nome: 'Xicara', caminho: `${BASE_URL_STORAGE}assets/xicara.png` },
      { nome: 'Copo', caminho: `${BASE_URL_STORAGE}assets/copo.png` },
      { nome: 'Garrafa', caminho: `${BASE_URL_STORAGE}assets/garrafa.png` },
      { nome: 'Garrafa esportiva', caminho: `${BASE_URL_STORAGE}assets/garrafaesportiva.png` },
      { nome: 'Garrafão', caminho: `${BASE_URL_STORAGE}assets/garrafao.png` },
      { nome: 'Jarra', caminho: `${BASE_URL_STORAGE}assets/jarra.png` },
      { nome: 'Galão', caminho: `${BASE_URL_STORAGE}assets/galao.png` },
    ];

    const pedirPermissao = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Atenção', 'Você precisa permitir notificações para receber lembretes de água.');
        }
    };

    const cancelNotification = async (id) => {
        if (id) {
            await Notifications.cancelScheduledNotificationAsync(id);
        }
    };

    const scheduleNotification = async (hours) => {
        if (!hours) return null;

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hora de beber água! 💧",
                body: "Mantenha-se hidratado para ter mais saúde e energia.",
                sound: true,
            },
            trigger: {
                seconds: hours * 3600,
                repeats: true,
            },
        });
        return id;
    };

    useEffect(() => {
        pedirPermissao();
        loadSettings();
        fetchUserCups();
        fetchConsumedCups();
    }, []);

    const loadSettings = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
            if (stored) {
                const settings = JSON.parse(stored);
                if (settings.meta) setMetaMl(Number(settings.meta));
                if (settings.notification) {
                    setNotifFreqIndex(settings.notification.index);
                    setNotifId(settings.notification.id);
                }
            }
        } catch (e) {
            console.error("Erro ao carregar configurações:", e);
        }
    };

    const saveSettings = async () => {
        try {
            let newNotifId = notifId;
            const selectedOption = NOTIF_OPTIONS[notifFreqIndex];

            if (notifId) {
                await cancelNotification(notifId);
            }

            if (selectedOption.valor !== null) {
                newNotifId = await scheduleNotification(selectedOption.valor);
            } else {
                newNotifId = null;
            }
            
            setNotifId(newNotifId);

            const settingsToSave = {
                meta: Number(metaMl),
                notification: {
                    index: notifFreqIndex,
                    id: newNotifId
                }
            };
            
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settingsToSave));
            
            setModalConfigVisible(false);
            setMostrarMenuOpcoes(false);
        } catch (e) {
            console.error("Erro ao salvar configurações:", e);
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    };

    const fetchUserCups = useCallback(async () => {
      try {
        const res = await api.get(`/usuario/${usuario.id}/copos`);
        setCopos(res.data);
      } catch(e) {
        console.error("Erro ao buscar copos:", e);
      } finally {
        setIsLoadingCups(false);
      }
    }, [usuario.id]);

    const fetchConsumedCups = useCallback(async () => {
      try {
        const today = new Date();
        const formattedDate = formatDateToYYYYMMDD(today);
        const res = await api.get(`/usuario/${usuario.id}/consumos-por-data?data=${formattedDate}`);
        if (res.data) {
            setTotalMl(Number(res.data.total_volume_ml) || 0);
        }
      } catch (e) {
        console.error("Erro ao buscar consumos:", e);
      }
    }, [usuario.id]);

    useEffect(() => {
      const newProgress = totalMl / metaMl; 
      const clampedProgress = Math.min(newProgress, 1); 
      progress.value = withTiming(clampedProgress, { duration: 800 }); 
    }, [totalMl, metaMl, progress]);

    const handleNewConsumo = useCallback(async (volume, idCopo) => {
      const data = { 'volume_ml': volume, 'usuario_id': usuario.id, 'copo_id': idCopo }
      try {
        setTotalMl(prev => {
            const novoTotal = prev + Number(volume);
            const meta = Number(metaMl);

            if (novoTotal >= meta) {
                Vibration.vibrate(500);
            }

            return novoTotal;
        });
        
        await api.post('/consumo', data);
        fetchConsumedCups(); 
      } catch (e) {
        console.error("Erro ao salvar consumo:", e);
        setTotalMl(prev => prev - Number(volume)); 
      }
    }, [usuario.id, metaMl]);

    const clearCopoModal = () => {
      setModalCopoVisible(false);
      setModalCopoState('Create');
      setNomeCopo("");
      setCapacidadeCopo("");
      setIconeCopoEscolhido(-1);
      setCopoId(-1);
    }

    const handleSaveCup = async () => {
      const dados = {
        'nome': nomeCopo,
        'capacidade_ml': Number(capacidadeCopo),
        'icone_id': iconeCopoEscolhido + 1,
        'usuario_id': usuario.id
      }
      try {
        const res = await api.post('/copo', dados);
        setCopos(prev => [...prev, res.data]);
        clearCopoModal();
      } catch(e) {
        console.error('Erro ao salvar copo', e);
      }
    }

    const handleUpdateCup = async () => {
      const dados = {
        'nome': nomeCopo,
        'capacidade_ml': Number(capacidadeCopo),
        'icone_id': iconeCopoEscolhido + 1,
        'usuario_id': usuario.id
      }
      try {
        const res = await api.put(`/copos/${copoId}`, dados);
        setCopos(prev => prev.map(c => c.id === res.data.id ? res.data : c));
        clearCopoModal();
      } catch(e) {
        console.error('Erro ao atualizar copo', e);
      }
    }

    const handleDeleteCup = async () => {
      try {
        await api.delete(`/copos/${copoId}`);
        setCopos(prev => prev.filter(c => c.id !== copoId));
        clearCopoModal();
      } catch(e) {
        console.error('Erro ao deletar copo', e);
      }
    }

    const openEditCopo = (c_nome, c_cap, c_iconId, c_id) => {
        setModalCopoState('Update');
        setNomeCopo(c_nome);
        setCapacidadeCopo(String(c_cap));
        setIconeCopoEscolhido(c_iconId - 1);
        setCopoId(c_id);
        setModalCopoVisible(true);
    }

    const [historicoModalVisible, setHistoricoModalVisible] = useState(false);

    if (isLoadingCups || !fontsLoaded) {
      return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
              <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                  <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
              </Pressable>

              <Pressable style={styles.headerBtn} onPress={() => setMostrarMenuOpcoes(!mostrarMenuOpcoes)}>
                  <Ionicons name="menu" size={0.06 * width} color="#97B9E5" />
              </Pressable>
          </View>

          {mostrarMenuOpcoes && (
            <View style={styles.menuOptions}>
                <Pressable style={styles.menuOption} onPress={() => {
                    setModalConfigVisible(true);
                    setMostrarMenuOpcoes(false);
                }}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>Configurações</Text>
                </Pressable>
                <Pressable style={styles.menuOption} onPress={() => {
                    setMostrarModalAjuda(true);
                    setMostrarMenuOpcoes(false);
                }}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>Ajuda</Text>
                </Pressable>
            </View>
          )}

          <Text style={{ fontFamily: 'Poppins-M', fontSize: 13 * scale, color: '#6C83A1', lineHeight: 17 * scale }}>
              Consumo de água
          </Text>

          <View style={styles.widgets}>
            <View style={[styles.widget, { backgroundColor: '#fff' }]}>
                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Total</Text>
                <Text style={{ fontFamily: 'Poppins-M', fontSize: 9 * scale, color: '#607DA3' }}>{totalMl}ml</Text>
            </View>

            <View style={[styles.widget, { backgroundColor: '#799BC8' }]}>
                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff' }}>Meta</Text>
                <Text style={{ fontFamily: 'Poppins-M', fontSize: 9 * scale, color: '#fff' }}>{metaMl}ml</Text>
            </View>
          </View>

          <View style={styles.consumption}>
            <Svg fill="#fff" width={SVG_SIZE} height={SVG_SIZE} style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -SVG_SIZE / 2 }, { translateY: -SVG_SIZE / 2 }], backgroundColor: '#fff', borderRadius: SVG_SIZE / 2 }}>
              <Defs>
                <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#b9cadfff" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#6C83A1" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <AnimatedCircle cx={SVG_SIZE / 2} cy={SVG_SIZE / 2} r={R} stroke="url(#waterGradient)" strokeWidth={strokeWidth} strokeDasharray={CIRCLE_LENGTH} strokeLinecap="round" animatedProps={animatedProps} />
            </Svg>
            <ReText style={{ fontFamily: 'Poppins-M', fontSize: 25 * scale, color: '#6C83A1', lineHeight: 30.5 * scale }} text={progressText} />
          </View>

          <View style={styles.cupBtns}>
            <Pressable style={styles.cupBtn} onPress={() => setHistoricoModalVisible(true)}>
              <Octicons name="graph" size={24} color="#fff" />
            </Pressable>
            <Pressable style={styles.cupBtn} onPress={()=> setModalCopoVisible(true)}>
              <Entypo name="plus" size={24} color="#fff" />
            </Pressable>
          </View>

          <ScrollView style={styles.cups} contentContainerStyle={{ gap: 0.0444 * width, justifyContent: 'center', alignItems: 'center' }} horizontal>
             {copos.map((c, i) => (
                <View style={styles.cup} key={i}>
                  <Pressable style={styles.cupBox} onPress={() => handleNewConsumo(c.capacidade_ml, c.id)} onLongPress={() => openEditCopo(c.nome, c.capacidade_ml, c.icone.id, c.id)}>
                    <Image source={{uri: c.icone?.caminhoFoto ? BASE_URL_STORAGE + c.icone.caminhoFoto : null}} style={{ height: '66%', width: '66%', objectFit: 'contain' }} />
                  </Pressable>
                  <View style={styles.cupCapacity}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#ffffffff', lineHeight: 6.6 * scale }}>{c.capacidade_ml}</Text>
                  </View>
                </View>  
             ))}
          </ScrollView>

          <Modal visible={modalCopoVisible} transparent animationType='slide'>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.modalInput}>
                  <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Nome</Text>
                  <TextInput style={styles.textInput} scrollEnabled={false} multiline={false} value={nomeCopo} onChangeText={setNomeCopo} />
                </View>

                <View style={styles.modalSelect}>
                  <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Ícone</Text>
                  <Pressable style={styles.select} onPress={() => setMostrarOpcoesIcone(!mostrarOpcoesIcone)}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>
                        {iconeCopoEscolhido !== -1 ? ICONS[iconeCopoEscolhido].nome : "Selecione um ícone"}
                    </Text>
                  </Pressable>
                  {mostrarOpcoesIcone && <View style={styles.optionsContainer}>
                    <ScrollView style={{ height: '100%', width: '100%' }} contentContainerStyle={{ alignItems: 'center', gap: 0.0111 * height }} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                      {ICONS.map((i, index) => (
                        <Pressable style={styles.option} key={index} onPress={() => { setIconeCopoEscolhido(index); setMostrarOpcoesIcone(false); }}>
                            <View style={styles.optionIcon}>
                                <Image source={{uri: i.caminho}} style={{ height: '66%', width: '66%', objectFit: 'contain' }} />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>{i.nome}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>}
                </View>

                <View style={styles.modalInput} pointerEvents={mostrarOpcoesIcone ? 'none' : 'auto'}>
                  <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Capacidade (ml)</Text>
                  <TextInput style={styles.textInput} keyboardType='numeric' scrollEnabled={false} multiline={false} value={capacidadeCopo} onChangeText={setCapacidadeCopo} />
                </View>

                <View style={styles.actions}>
                  {modalCopoState === 'Update' && <Pressable style={[styles.actionsBtn, { backgroundColor: '#cf5555d3' }]} onPress={handleDeleteCup}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, lineHeight: 5.5 * scale, color: '#fff' }}>Remover</Text>
                  </Pressable>}
                  <Pressable style={[styles.actionsBtn, { backgroundColor: '#f0f0f0' }]} onPress={clearCopoModal}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, lineHeight: 5.5 * scale, color: '#6C83A1' }}>Cancelar</Text>
                  </Pressable>
                  <Pressable style={[styles.actionsBtn, { backgroundColor: '#6C83A1' }]} onPress={() => modalCopoState === 'Create' ? handleSaveCup() : handleUpdateCup()}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, lineHeight: 5.5 * scale, color: '#fff' }}>Salvar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={modalConfigVisible} transparent animationType='slide'>
            <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                <View style={styles.helpModal}>        
                    <View style={styles.modalInput}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1' }}>Meta Diária (ml)</Text>
                        <TextInput 
                            style={styles.textInput} 
                            keyboardType='numeric' 
                            value={String(metaMl)} 
                            onChangeText={(val) => setMetaMl(Number(val))} 
                        />
                    </View>

                    <View style={[styles.modalInput, { zIndex: 200 }]}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1' }}>Notificações</Text>
                        <Pressable style={styles.select} onPress={() => setMostrarOpcoesNotif(!mostrarOpcoesNotif)}>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>
                                {NOTIF_OPTIONS[notifFreqIndex]?.label || "Selecione"}
                            </Text>
                            <Entypo name={mostrarOpcoesNotif ? "chevron-up" : "chevron-down"} size={16} color="#6C83A1" />
                        </Pressable>
                        
                        {mostrarOpcoesNotif && (
                            <View style={styles.optionsContainerUp}>
                                <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ gap: 0.01 * height }}>
                                    {NOTIF_OPTIONS.map((opt, i) => (
                                        <Pressable key={i} style={styles.option} onPress={() => { setNotifFreqIndex(i); setMostrarOpcoesNotif(false); }}>
                                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>{opt.label}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View style={styles.actions}>
                          <Pressable style={[styles.actionsBtn, { backgroundColor: '#f0f0f0' }]} onPress={() => setModalConfigVisible(false)}>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>Cancelar</Text>
                        </Pressable>
                        <Pressable style={[styles.actionsBtn, { backgroundColor: '#6C83A1' }]} onPress={saveSettings}>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff' }}>Salvar</Text>
                        </Pressable>
                    </View>
                </View>
            </BlurView>
          </Modal>

          <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
            <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                <Pressable style={styles.modalBackdrop} onPress={() => setMostrarModalAjuda(false)}>
                    <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1' }}>Ajuda</Text>
                        </View>

                        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 0.015 * height }} showsVerticalScrollIndicator={false}>
                            <View style={styles.helpSection}>
                                <Text style={{ fontFamily: 'Poppins-SB', fontSize: 9 * scale, color: '#6C83A1' }}>Água</Text>
                            </View>

                            <View style={styles.helpSection}>
                                <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                    <Ionicons name="information-circle" size={0.05 * width} color="#6C83A1" />
                                    <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Função:</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Registrar e monitorar consumo de água.</Text>
                            </View>

                            <View style={styles.helpSection}>
                                <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                    <Ionicons name="list-circle" size={0.05 * width} color="#6C83A1" />
                                    <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Campos:</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Copos personalizados, meta diária.</Text>
                            </View>

                            <View style={styles.helpSection}>
                                <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                    <Ionicons name="play-circle" size={0.05 * width} color="#6C83A1" />
                                    <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Como usar:</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Toque no copo para registrar consumo.</Text>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Crie copos personalizados no botão "+".</Text>
                            </View>

                            <View style={styles.helpSection}>
                                <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                    <Ionicons name="checkmark-circle" size={0.05 * width} color="#6C83A1" />
                                    <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Resultado esperado:</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Gráfico de hidratação e atingimento da meta.</Text>
                            </View>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </BlurView>
          </Modal>

          <AguaModalHistorico visible={historicoModalVisible} setVisible={setHistoricoModalVisible} width={width} height={height} scale={scale}></AguaModalHistorico>
        </View>
    )
}

export default Agua;