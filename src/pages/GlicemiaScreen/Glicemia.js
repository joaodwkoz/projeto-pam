import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import WheelPicker from '@quidone/react-native-wheel-picker';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';

import { dynamicStyles } from './styles';

function formatDateToYYYYMMDD(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const data = new Date();
const dataAtual = {
    dia: data.getDate(),
    mes: data.getMonth() + 1,
    ano: data.getFullYear(),
    hora: data.getHours(),
    minuto: data.getMinutes()  
};

const dias = [...Array(30).keys()].map((i) => ({
    value: i + 1,
    label: (i + 1).toString()
}));

const meses = [...Array(12).keys()].map((i) => ({
    value: i + 1,
    label: (i + 1).toString()
}));

const anos = [...Array(121).keys()].map((i) => ({
    value: i + 1905,
    label: (i + 1905).toString()
}));

const horas = [...Array(24).keys()].map((i) => ({
    value: i,
    label: i.toString()
}));

const minutos = [...Array(60).keys()].map((i) => ({
    value: i,
    label: i.toString()
}));

const Glicemia = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = useMemo(() => dynamicStyles(width, height), [width, height]);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { usuario } = useContext(AuthContext);

    const [mostrarModal, setMostrarModal] = useState(false);

    const abrirModal = () => setMostrarModal(true);

    const [valor, setValor] = useState(0);
    const [tipoMedicao, setTipoMedicao] = useState("");
    const [horario, setHorario] = useState({
        dia: dataAtual.dia,
        mes: dataAtual.mes,
        ano: dataAtual.ano,
        hora: dataAtual.hora,
        minuto: dataAtual.minuto,
    });
    const [observacoes, setObservacoes] = useState("");

    const fecharModal = () => {
        setMostrarModal(false);
        setValor(0);
        setTipoMedicao("");
        setHorario({
            dia: dataAtual.dia,
            mes: dataAtual.mes,
            ano: dataAtual.ano,
            hora: dataAtual.hora,
            minuto: dataAtual.minuto,
        });
        setObservacoes("");
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
            }}>Glicemia</Text>

            <View style={styles.status}>
                <View style={styles.statusCard}>
                    <View style={styles.statusCardInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 11 * scale,
                            color: '#6C83A1',
                            lineHeight: 14 * scale
                        }}>120mg/dL</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#8b9eb6',
                            lineHeight: 10 * scale
                        }}>Em jejum - 10/10 às 15:30</Text>
                    </View>

                    <View style={[styles.statusCardIndicator, { backgroundColor: '#d4665cff' }]}></View>
                </View>
            </View>

            <View style={styles.history}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 12 * scale,
                    color: '#6C83A1',
                    lineHeight: 13.2 * scale
                }}>Histórico</Text>

                <View style={styles.historyBtns}>
                    <Pressable style={styles.historyBtn} onPress={abrirModal}>
                        <Feather name="filter" size={24} color="#fff" />
                    </Pressable>

                    <Pressable style={styles.historyBtn}>
                        <Entypo name="plus" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>

            <ScrollView style={{
                flex: 1,
                width: '100%',
            }} contentContainerStyle={{
                gap: 0.0222 * height,
            }} showsVerticalScrollIndicator={false}>
                <View style={styles.historyDate}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 9 * scale,
                        color: '#6C83A1',
                        lineHeight: 12 * scale
                    }}>10 de Outubro</Text>

                    <View style={styles.historyDateMeditions}>
                        <View style={styles.historyDateMedition}>
                            <View style={styles.meditionInfo}>
                                <View style={styles.meditionInfoValue}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 8 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 11 * scale
                                    }}>120 mg/dL</Text>

                                    <FontAwesome6 name="notes-medical" size={20} color="#6C83A1" />
                                </View>

                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#8b9eb6',
                                    lineHeight: 9 * scale
                                }}>Em jejum - 10/10 às 15:30</Text>
                            </View>

                            <View style={[styles.meditionIndicator, { backgroundColor: '#fff1a8' }]}>
                                
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal visible={mostrarModal} transparent>
                <BlurView tint='dark' intensity={8} experimentalBlurMethod='dimezisBlurView' style={styles.meditionModalContainer}>
                    <View style={styles.meditionModalWrapper}>
                        <ScrollView style={{
                            flex: 1,
                        }} contentContainerStyle={{
                            gap: 0.0222 * width,
                        }}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 8 * scale,
                                color: '#6C83A1',
                                lineHeight: 10 * scale 
                            }}>Registrar nova medição</Text>

                            <View style={styles.meditionModalInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Nome</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.0444 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                }} scrollEnabled={false} multiline={false} value={valor} onChangeText={setValor}></TextInput>
                            </View>

                            <View style={styles.meditionModalInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Tipo de medição</Text>

                                <View style={styles.meditionModalChipInput}>
                                    <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Em jejum' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Em jejum')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: tipoMedicao == 'Em jejum' ? '#fff' : '#6C83A1',
                                            lineHeight: 8 * scale 
                                        }}>Em jejum</Text>
                                    </Pressable>

                                    <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Pré-refeição' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Pré-refeição')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: tipoMedicao == 'Pré-refeição' ? '#fff' : '#6C83A1',
                                            lineHeight: 8 * scale 
                                        }}>Pré-refeição</Text>
                                    </Pressable>

                                    <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Pós-refeição' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Pós-refeição')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: tipoMedicao == 'Pós-refeição' ? '#fff' : '#6C83A1',
                                            lineHeight: 8 * scale 
                                        }}>Pós-refeição</Text>
                                    </Pressable>

                                    <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Aleatória' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Aleatória')}>
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: tipoMedicao == 'Aleatória' ? '#fff' : '#6C83A1',
                                            lineHeight: 8 * scale 
                                        }}>Aleatória</Text>
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.meditionModalInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Data</Text>

                                <View style={styles.meditionModalDatePicker}>
                                    <WheelPicker
                                        data={dias}
                                        value={horario.dia}
                                        enableScrollByTapOnItem={true}
                                        visibleItemCount={3}
                                        itemTextStyle={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7.25 * scale,
                                            color: '#a4b7cfff',
                                        }}
                                        width={0.1875 * width}
                                        overlayItemStyle={{
                                            backgroundColor: '#b9cadfff',
                                            opacity: 0.125,
                                        }}
                                        itemHeight={0.0425 * height}
                                        onValueChanged={({item: {value}}) => {
                                            setHorario(prevHorario => ({
                                                ...prevHorario,
                                                dia: value, 
                                            }));
                                        }}
                                    />

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 7 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 7.7 * scale 
                                    }}>/</Text>

                                    <WheelPicker
                                        data={meses}
                                        value={horario.mes}
                                        enableScrollByTapOnItem={true}
                                        visibleItemCount={3}
                                        itemTextStyle={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7.25 * scale,
                                            color: '#a4b7cfff',
                                        }}
                                        width={0.1875 * width}
                                        overlayItemStyle={{
                                            backgroundColor: '#b9cadfff',
                                            opacity: 0.125,
                                        }}
                                        itemHeight={0.0425 * height}
                                        onValueChanged={({item: {value}}) => {
                                            setHorario(prevHorario => ({
                                                ...prevHorario,
                                                mes: value, 
                                            }));
                                        }}
                                    />

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 7 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 7.7 * scale 
                                    }}>/</Text>

                                    <WheelPicker
                                        data={anos}
                                        value={horario.ano}
                                        enableScrollByTapOnItem={true}
                                        visibleItemCount={3}
                                        itemTextStyle={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7.25 * scale,
                                            color: '#a4b7cfff',
                                        }}
                                        width={0.225 * width}
                                        overlayItemStyle={{
                                            backgroundColor: '#b9cadfff',
                                            opacity: 0.125,
                                        }}
                                        itemHeight={0.0425 * height}
                                        onValueChanged={({item: {value}}) => {
                                            setHorario(prevHorario => ({
                                                ...prevHorario,
                                                ano: value, 
                                            }));
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.meditionModalInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Hora</Text>

                                <View style={styles.meditionModalTimePicker}>
                                    <WheelPicker
                                        data={horas}
                                        value={horario.hora}
                                        enableScrollByTapOnItem={true}
                                        visibleItemCount={3}
                                        itemTextStyle={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7.25 * scale,
                                            color: '#a4b7cfff',
                                        }}
                                        width={0.1875 * width}
                                        overlayItemStyle={{
                                            backgroundColor: '#b9cadfff',
                                            opacity: 0.125,
                                        }}
                                        itemHeight={0.0425 * height}
                                        onValueChanged={({item: {value}}) => {
                                            setHorario(prevHorario => ({
                                                ...prevHorario,
                                                hora: value, 
                                            }));
                                        }}
                                    />

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 7 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 7.7 * scale 
                                    }}>:</Text>

                                    <WheelPicker
                                        data={minutos}
                                        value={horario.minuto}
                                        enableScrollByTapOnItem={true}
                                        visibleItemCount={3}
                                        itemTextStyle={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7.25 * scale,
                                            color: '#a4b7cfff',
                                        }}
                                        width={0.1875 * width}
                                        overlayItemStyle={{
                                            backgroundColor: '#b9cadfff',
                                            opacity: 0.125,
                                        }}
                                        itemHeight={0.0425 * height}
                                        onValueChanged={({item: {value}}) => {
                                            setHorario(prevHorario => ({
                                                ...prevHorario,
                                                minuto: value, 
                                            }));
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={styles.meditionModalInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Observações</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.1 * height,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                }} scrollEnabled={false} multiline={true} value={observacoes} onChangeText={setObservacoes}></TextInput>
                            </View>
                        </ScrollView>

                        <View style={styles.meditionModalActions}>
                            <Pressable style={styles.meditionModalBtn} onPress={fecharModal}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Cancelar</Text>
                            </Pressable>

                            <Pressable style={[styles.meditionModalBtn, { backgroundColor: '#6C83A1' }]}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#fff',
                                    lineHeight: 7.7 * scale 
                                }}>Salvar</Text>
                            </Pressable>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </View>
    )
}

export default Glicemia;