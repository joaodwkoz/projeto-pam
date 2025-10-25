import { View, Pressable, Text, PixelRatio, useWindowDimensions, ActivityIndicator, SectionList, ScrollView } from 'react-native';
import { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import BottomSheet, { BottomSheetModal, BottomSheetTextInput, BottomSheetScrollView, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import WheelPicker from '@quidone/react-native-wheel-picker';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { dynamicStyles } from './styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Batimentos = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { usuario } = useContext(AuthContext);

    const DATA = [
        {
            title: 'Hoje, 25 de Outubro',
            data: [
                {
                    bpm: 82,
                    tipo: 'Após caminhada',
                    horario: '09:31'
                },
            
                {
                    bpm: 64,
                    tipo: 'Em repouso',
                    horario: '08:15'
                },
            ],
        },
        
        {
            title: 'Ontem, 24 de Outubro',
            data: [
                {
                    bpm: 112,
                    tipo: 'Pós-exercício',
                    horario: '19:30'
                },

                {
                    bpm: 112,
                    tipo: 'Pós-exercício',
                    horario: '19:30'
                },

                {
                    bpm: 112,
                    tipo: 'Pós-exercício',
                    horario: '19:30'
                },
            ],
        },
    ];

    const secoesParaLista = DATA.map((secao, index) => ({
        ...secao,
        sectionIndex: index,
    }));

    const getHeartColor = (bpm) => {
        if (bpm > 100) {
            return '#f09b9b';
        } else if (bpm < 60) {
            return '#abc4f1';
        } else {
            return '#d6f1ab';
        }
    }

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => [height * 0.6], []);

    const handleOpenModal = () => {
        console.log(1);
        console.log('Ref do BottomSheet:', bottomSheetRef.current);
        bottomSheetRef.current?.present();
    }

    const handleCloseModal = () => {
        bottomSheetRef.current?.close();
    }

    const [bpm, setBpm] = useState('');
    const [condicao, setCondicao] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [horario, setHorario] = useState();

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F0F4F7' }}>
            <BottomSheetModalProvider>
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
                    }}>Batimentos</Text>

                    <View style={styles.headerSection}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 9 * scale,
                            color: '#6C83A1',
                            lineHeight: 9.9 * scale
                        }}>
                            Histórico
                        </Text>

                        <Pressable style={styles.graphViewBtn}>
                            <Octicons name="graph" size={20} color="#fff" />
                        </Pressable>
                    </View>

                    <View style={styles.resumeSection}>
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
                                fontSize: 6.5 * scale,
                                color: '#baabf1ff',
                                lineHeight: 9 * scale
                            }}>65BPM</Text>
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
                                fontSize: 6.5 * scale,
                                color: '#abc4f1ff',
                                lineHeight: 9 * scale
                            }}>78BPM</Text>
                        </View>

                        <View style={styles.resumeCard}>
                            <View style={styles.resumeCardInfo}>
                                <AntDesign name="fire" size={24} color="#f09b9bff" />

                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 5 * scale,
                                    color: '#f09b9bff',
                                    lineHeight: 8 * scale
                                }}>Máxima</Text>
                            </View>
                            

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#f09b9bff',
                                lineHeight: 9 * scale
                            }}>65BPM</Text>
                        </View>

                        <View style={styles.resumeCard}>
                            <View style={styles.resumeCardInfo}>
                                <FontAwesome6 name="snowflake" size={24} color="#d6f1abff" />

                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 5 * scale,
                                    color: '#d6f1abff',
                                    lineHeight: 8 * scale
                                }}>Mínima</Text>
                            </View>
                            

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#d6f1abff',
                                lineHeight: 9 * scale
                            }}>53BPM</Text>
                        </View>
                    </View>

                    <View style={styles.history}>
                        <View style={styles.historyOptions}>
                            <Pressable style={styles.historyOption}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 10 * scale
                                }}>Semana</Text>
                            </Pressable>

                            <Pressable style={[styles.historyOption, { backgroundColor: '#6C83A1' }]}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#fff',
                                    lineHeight: 10 * scale
                                }}>Mês</Text>
                            </Pressable>

                            <Pressable style={styles.historyOption}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 10 * scale
                                }}>Ano</Text>
                            </Pressable>
                        </View>

                        <SectionList
                            sections={secoesParaLista}
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
                                            }}>{item.tipo} - {item.horario}</Text>
                                        </View>
                                    </View>

                                    <Entypo name="chevron-right" size={24} color="#00000030" />
                                </View>
                            )}
                            ItemSeparatorComponent={() => (
                                <View style={{
                                    width: '100%',
                                    height: 0.0444 * width,
                                }}></View>
                            )}
                            renderSectionHeader={({ section }) => {
                                const index = section.sectionIndex; 
                                const title = section.title;

                                return (
                                    <Text style={[{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 8 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 11 * scale,
                                        paddingBottom: 0.0444 * width,
                                    }, index > 0 ? {                                        paddingVertical: 0.0444 * width
                                    } : {}]}>{title}</Text>
                                )
                            }}
                        />
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
                }}>
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
                                Batimentos (BPM)
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
                            }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false}></BottomSheetTextInput>
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
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false}></BottomSheetTextInput>

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
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false}></BottomSheetTextInput>

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
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false}></BottomSheetTextInput>
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
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false}></BottomSheetTextInput>

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
                                }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={false}></BottomSheetTextInput>
                            </View>
                        </View>

                        <View style={styles.modalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Condição</Text>

                            <View style={styles.modalChipInput}>
                                <Pressable style={styles.modalChipInputOption}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#fff',
                                        lineHeight: 8 * scale 
                                    }}>Em repouso</Text>
                                </Pressable>

                                <Pressable style={styles.modalChipInputOption}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#fff',
                                        lineHeight: 8 * scale 
                                    }}>Pós-exercício</Text>
                                </Pressable>

                                <Pressable style={styles.modalChipInputOption}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#fff',
                                        lineHeight: 8 * scale 
                                    }}>Monitoramento</Text>
                                </Pressable>

                                <Pressable style={styles.modalChipInputOption}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#fff',
                                        lineHeight: 8 * scale 
                                    }}>Aleatório</Text>
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
                            }} keyboardType='numeric' maxLength={4} scrollEnabled={false} multiline={true}></BottomSheetTextInput>
                        </View>

                        <Pressable style={styles.saveBtn}>
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
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default Batimentos;