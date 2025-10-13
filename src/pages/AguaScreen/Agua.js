import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
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
import { AuthContext } from '../../../contexts/AuthContext';
import api from '../../../services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { dynamicStyles } from './styles';

function formatDateToYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Agua = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { usuario } = useContext(AuthContext);

    const SVG_SIZE = width * 0.75;
    const strokeWidth = 0.0325 * height;
    const R = SVG_SIZE / 2.5;
    const CIRCLE_LENGTH = 2 * Math.PI * R;

    const progress = useSharedValue(0);

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const animatedProps = useAnimatedProps(() => {
      const dashOffset = CIRCLE_LENGTH * (1 - progress.value);

      return {
        strokeDashoffset: Math.max(dashOffset, 0), 
      };
    });

    const progressText = useDerivedValue(() => {
      return `${Math.floor(progress.value * 100)}%`;
    });

    const [copos, setCopos] = useState([]);
    const BASE_URL_STORAGE = 'http://192.168.0.7:8000/';
    const [consumidos, setConsumidos] = useState([]);
    const [totalMl, setTotalMl] = useState(0);
    const META_ML = 4000;

    const fetchUserCups = useCallback(async () => {
      try {
        const res = await api.get(`/usuario/${usuario.id}/copos`);
        setCopos(res.data);
      } catch(e) {
        console.error("Erro ao buscar copos do usuário:", e);
      } finally {
        setIsLoadingCups(false);
      }
    }, [usuario.id]);

    const today = new Date();
    const formattedDate = formatDateToYYYYMMDD(today);

    const fetchConsumedCups = useCallback(async () => {
      try {
        const res = await api.get(`/usuario/${usuario.id}/consumos-por-data?data=${formattedDate}`);
        setConsumidos(res.data.registros);
        setTotalMl(res.data.total_volume_ml); 
      } catch (e) {
        console.error("Erro ao buscar consumos do usuário:", e);
      } finally {
        setIsLoadingConsumos(false);
      }
    }, [usuario.id, formattedDate]);

    const [isLoadingCups, setIsLoadingCups] = useState(true);
    const [isLoadingConsumos, setIsLoadingConsumos] = useState(true);

    useEffect(() => {
      const loadData = async () => {
        await Promise.all([
          fetchUserCups(),
          fetchConsumedCups()
        ]);
      };
      loadData();
    }, [fetchUserCups, fetchConsumedCups]);

    useEffect(() => {
      const newProgress = totalMl / META_ML; 
      const clampedProgress = Math.min(newProgress, 1); 
      progress.value = withTiming(clampedProgress, { duration: 800 }); 
    }, [totalMl, progress]);

    const handleNewConsumo = useCallback(async (volume, idCopo) => {
      const data = {
        'volume_ml': volume,
        'usuario_id': usuario.id,
        'copo_id': idCopo
      }

      try {
        await api.post('/consumo', data);
        setTotalMl(prev => prev + volume);
      } catch (e) {
        console.error("Erro ao salvar consumo:", e.response?.data || e.message);
        Alert.alert('Erro', 'Não foi possível salvar o consumo.');
      }
    }, [usuario.id, BASE_URL_STORAGE]);

    const ICONS = [
      {
        nome: 'Xicara',
        caminho: `${BASE_URL_STORAGE}assets/xicara.png`
      },
      {
        nome: 'Copo',
        caminho: `${BASE_URL_STORAGE}assets/copo.png`
      },
      {
        nome: 'Garrafa',
        caminho: `${BASE_URL_STORAGE}assets/garrafa.png`
      },
      {
        nome: 'Garrafa esportiva',
        caminho: `${BASE_URL_STORAGE}assets/garrafaesportiva.png`
      },
      {
        nome: 'Garrafão',
        caminho: `${BASE_URL_STORAGE}assets/garrafao.png`
      },
      {
        nome: 'Jarra',
        caminho: `${BASE_URL_STORAGE}assets/jarra.png`
      },
      {
        nome: 'Galão',
        caminho: `${BASE_URL_STORAGE}assets/galao.png`
      },
    ]

    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState('Create');
    const [nome, setNome] = useState("");
    const [capacidade, setCapacidade] = useState("");
    const [iconeEscolhido, setIconeEscolhido] = useState(-1);
    const [copo, setCopo] = useState(-1);

    const clearModal = () => {
      setModalVisible(false);
      setModalState('Create');
      setNome("");
      setCapacidade("");
      setIconeEscolhido(-1);
      setCopo(-1);
    }

    const handleSaveCup = async () => {
      const dados = {
        'nome': nome,
        'capacidade_ml': Number(capacidade),
        'icone_id': iconeEscolhido + 1,
        'usuario_id': usuario.id
      }

      try {
        const res = await api.post('/copo', dados);
        setCopos(prevCopos => [...prevCopos, res.data]);
      } catch(e) {
        console.error('Ocorreu um erro ao salvar o copo', e);
      } finally {
        clearModal();
      }
    }

    const handleOpenUpdateModal = (nome, capacidade, iconeId) => {
      setModalState('Update');
      setNome(nome);
      setCapacidade(String(capacidade));
      setIconeEscolhido(iconeId - 1);
      setModalVisible(true)
    }

    const handleUpdateCup = async () => {
      const dados = {
        'nome': nome,
        'capacidade_ml': Number(capacidade),
        'icone_id': iconeEscolhido + 1,
        'usuario_id': usuario.id
      }

      try {
        const res = await api.put(`/copos/${copo}`, dados);
        const copoAtualizado = res.data;
        setCopos(prevCopos =>
          prevCopos.map(c => 
            c.id === copoAtualizado.id
              ? copoAtualizado
              : c
          )
        );
      } catch(e) {
        console.error('Ocorreu um erro ao atualizar o copo', e);
      } finally {
        clearModal();
      }
    }

    const handleDeleteCup = async () => {
      try {
        await api.delete(`/copos/${copo}`);
        setCopos(prevCopos =>
          prevCopos.filter(c => c.id !== copo)
        );
      } catch(e) {
        console.error('Ocorreu um erro ao remover o copo', e);
      } finally {
        clearModal();
      }
    }

    if (isLoadingCups || isLoadingConsumos || !fontsLoaded) {
      return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
              <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                  <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
              </Pressable>

              <Pressable style={styles.headerBtn}>
                  <Ionicons name="settings-sharp" size={0.0444 * width} color="#97B9E5" />
              </Pressable>
          </View>

          <Text style={{
              fontFamily: 'Poppins-M',
              fontSize: 13 * scale,
              color: '#6C83A1',
              lineHeight: 17 * scale
          }}>Consumo de água</Text>

          <View style={styles.widgets}>
            <View style={[styles.widget, { backgroundColor: '#fff' }]}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 7 * scale,
                    color: '#607DA3'
                }}>Total</Text>

                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 9 * scale,
                    color: '#607DA3'
                }}>{totalMl}ml</Text>
            </View>

            <View style={[styles.widget, { backgroundColor: '#799BC8' }]}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 7 * scale,
                    color: '#fff'
                }}>Meta</Text>

                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 9 * scale,
                    color: '#fff'
                }}>4000ml</Text>
            </View>
          </View>

          <View style={styles.consumption}>
            <Svg
              fill="#fff"
              width={SVG_SIZE}
              height={SVG_SIZE}
              style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: [
                    { translateX: -SVG_SIZE / 2 },
                    { translateY: -SVG_SIZE / 2 },
                  ],
                  backgroundColor: '#fff',
                  borderRadius: SVG_SIZE / 2,
              }}
              >
              <Defs>
                <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#b9cadfff" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#6C83A1" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <AnimatedCircle
                  cx={SVG_SIZE / 2}
                  cy={SVG_SIZE / 2}
                  r={R}
                  stroke="url(#waterGradient)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={CIRCLE_LENGTH}
                  strokeLinecap="round"
                  animatedProps={animatedProps}
              />
              </Svg>

              <ReText style={{
                fontFamily: 'Poppins-M',
                fontSize: 25 * scale,
                color: '#6C83A1',
                lineHeight: 30.5 * scale,
              }} text={progressText} />
          </View>

          <View style={styles.addCup}>
            <Pressable style={styles.addCupBtn} onPress={()=> setModalVisible(true)}>
              <Entypo name="plus" size={24} color="#fff" />
            </Pressable>
          </View>

          <ScrollView style={styles.cups} contentContainerStyle={{
            gap: 0.0444 * width,
            justifyContent: 'center',
            alignItems: 'center',
          }} horizontal>
            {isLoadingCups ? (
              <ActivityIndicator color='#6C83A1' size="small" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
            ): (
              copos.map((c, i) => (
                <View style={styles.cup}>
                  <Pressable style={styles.cupBox} onPress={() => handleNewConsumo(c.capacidade_ml, c.id)} onLongPress={() => {
                    setCopo(c.id);
                    handleOpenUpdateModal(c.nome, c.capacidade_ml, c.icone.id);
                    }}>
                    <Image source={{uri: c.icone?.caminhoFoto 
                    ? BASE_URL_STORAGE + c.icone.caminhoFoto 
                    : null}} style={{
                      height: '66%',
                      width: '66%',
                      objectFit: 'contain',
                    }} />
                  </Pressable>

                  <View style={styles.cupCapacity}>
                    <Text style={{
                      fontFamily: 'Poppins-M',
                      fontSize: 6 * scale,
                      color: '#ffffffff',
                      lineHeight: 6.6 * scale,
                    }}>{c.capacidade_ml}</Text>
                  </View>
                </View>  
              ))
            )}
          </ScrollView>

          <Modal visible={modalVisible} transparent animationType='slide'>
            <View style={styles.modalContainer}>
              <View style={styles.modal}>
                <View style={styles.modalInput}>
                  <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 7 * scale,
                    color: '#6C83A1',
                    lineHeight: 7.7 * scale,
                  }}>Nome</Text>

                  <TextInput style={{
                    width: '100%',
                    height: 0.0444 * height,
                    padding: 3 * scale,
                    fontFamily: 'Poppins-M',
                    fontSize: 6 * scale,
                    lineHeight: 8 * scale,
                    backgroundColor: '#fff',
                    borderColor: '#eee',
                    borderWidth: 0.002 * height,
                    borderRadius: 0.01 * height,
                    color: '#6C83A1',
                  }} scrollEnabled={false} multiline={false} value={nome} onChangeText={(nome) => setNome(nome)} ></TextInput>
                </View>

                <View style={styles.modalSelect}>
                  <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 7 * scale,
                    color: '#6C83A1',
                    lineHeight: 7.7 * scale,
                  }}>Ícone</Text>

                  <Pressable style={styles.select} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                    <Text style={{
                      fontFamily: 'Poppins-M',
                      fontSize: 6 * scale,
                      color: '#6C83A1',
                      lineHeight: 9 * scale,
                    }}>{iconeEscolhido !== -1 ? ICONS[iconeEscolhido].nome : "Selecione um ícone"}</Text>
                  </Pressable>

                  {mostrarOpcoes && <View style={styles.optionsContainer}>
                    <ScrollView style={{
                      height: '100%',
                      width: '100%',
                    }}  contentContainerStyle={{
                    alignItems: 'center',
                    gap: 0.0111 * height
                    }} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                      {ICONS.map((i, index) => {
                        if (iconeEscolhido !== index) {
                          return (
                            <Pressable style={[styles.option]} key={index} onPress={() => {setIconeEscolhido(index)
                            setMostrarOpcoes(false);  
                            }}>
                              <View style={styles.optionIcon}>
                                <Image source={{uri: i.caminho}} style={{
                                  height: '66%',
                                  width: '66%',
                                  objectFit: 'contain',
                                }} />
                              </View>

                              <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#6C83A1',
                                lineHeight: 9 * scale,
                              }}>{i.nome}</Text>
                            </Pressable>
                          )
                        }
                      })}
                    </ScrollView>
                  </View>}
                </View>

                <View style={styles.modalInput} pointerEvents={mostrarOpcoes ? 'none' : 'auto'}>
                  <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 7 * scale,
                    color: '#6C83A1',
                    lineHeight: 7.7 * scale,
                  }}>Capacidade</Text>

                  <TextInput style={{
                    width: '100%',
                    height: 0.0444 * height,
                    padding: 3 * scale,
                    fontFamily: 'Poppins-M',
                    fontSize: 6 * scale,
                    lineHeight: 8 * scale,
                    backgroundColor: '#fff',
                    borderColor: '#eee',
                    borderWidth: 0.002 * height,
                    borderRadius: 0.01 * height,
                    color: '#6C83A1',
                  }} scrollEnabled={false} multiline={false} value={capacidade} onChangeText={(capacidade) => setCapacidade(capacidade)}></TextInput>
                </View>

                <View style={styles.actions}>
                  {modalState === 'Update' && <Pressable style={[styles.actionsBtn, { backgroundColor: '#cf5555d3' }]} onPress={() => handleDeleteCup(false)}>
                    <Text style={{
                      fontFamily: 'Poppins-M',
                      fontSize: 5 * scale,
                      lineHeight: 5.5 * scale,
                      color: '#fff',
                    }}>Remover</Text>
                  </Pressable>}

                  <Pressable style={[styles.actionsBtn, { backgroundColor: '#f0f0f0' }]} onPress={() => clearModal()}>
                    <Text style={{
                      fontFamily: 'Poppins-M',
                      fontSize: 5 * scale,
                      lineHeight: 5.5 * scale,
                      color: '#6C83A1',
                    }}>Cancelar</Text>
                  </Pressable>

                  <Pressable style={[styles.actionsBtn, { backgroundColor: '#6C83A1' }]} onPress={() => {
                    modalState === 'Create' ? handleSaveCup() : handleUpdateCup();
                  }}>
                    <Text style={{
                      fontFamily: 'Poppins-M',
                      fontSize: 5 * scale,
                      lineHeight: 5.5 * scale,
                      color: '#fff',
                    }}>Continuar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
    )
}

export default Agua;