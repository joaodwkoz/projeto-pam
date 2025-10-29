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

import GlicemiaModal from '../../components/GlicemiaModal';

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

    const handleOpenModal = () => setMostrarModal(true);

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

    const handleCloseModal = () => {
        setMostrarModal(false);
        clearModal()
    }

    const clearModal = () => {
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
                        }}>120 mg/dL</Text>

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
                    <Pressable style={styles.historyBtn}>
                        <Feather name="filter" size={24} color="#fff" />
                    </Pressable>

                    <Pressable style={styles.historyBtn} onPress={handleOpenModal}>
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

            <GlicemiaModal 
                visible={mostrarModal}
                fecharModal={handleCloseModal}
                horario={horario}
                setHorario={setHorario}
                tipoMedicao={tipoMedicao}
                setTipoMedicao={setTipoMedicao}
                valor={valor}
                setValor={setValor}
                observacoes={observacoes}
                setObservacoes={setObservacoes}
                dias={dias}
                meses={meses}
                anos={anos}
                horas={horas}
                minutos={minutos}
            />
        </View>
    )
}

export default Glicemia;