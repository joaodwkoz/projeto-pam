import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { useState, useEffect, useContext, useCallback, useMemo, memo } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BlurView } from 'expo-blur';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { dynamicStyles } from './styles';

import WheelPicker from '@quidone/react-native-wheel-picker';

import Velocimetro from '../../components/Velocimetro';
import ImcModalHistorico from '../../components/ImcModalHistorico';

const alturas = [...Array(161).keys()].map((i) => ({
    value: i + 40,
    label: (i + 40).toString()
}));

const pesosInteiro = [...Array(181).keys()].map((i) => ({
    value: i + 20,
    label: (i + 20).toString()
}));

const pesosDecimal = [...Array(10).keys()].map((i) => ({
    value: i,
    label: i.toString()
}));

const MemoizedWheelPicker = memo(WheelPicker);

const Imc = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { usuario } = useContext(AuthContext);

    const [altura, setAltura] = useState(40);
    const [pesoInteiro, setPesoInteiro] = useState(20);
    const [pesoDecimal, setPesoDecimal] = useState(0);
    const [peso, setPeso] = useState(20.0);
    const [imc, setImc] = useState(15);
    const [velocimetroSize, setVelocimetroSize] = useState({ width: 0, height: 0 });
    const [ultimoRegistro, setUltimoRegistro] = useState(null);

    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const fetchLatestRegistry = useCallback(async () => {
        try {
            const res = await api.get(`/usuario/${usuario.id}/imc/ultimo`);
        
            const ultimoRegistro = res.data; 

            setUltimoRegistro(ultimoRegistro);

            if (ultimoRegistro) { 
                const alturaCm = Math.round(ultimoRegistro.altura * 100); 
                setAltura(alturaCm);

                const pesoInt = Math.floor(ultimoRegistro.peso);
                const pesoDec = Math.round((ultimoRegistro.peso - pesoInt) * 10);

                setPesoInteiro(pesoInt);
                setPesoDecimal(pesoDec);
                setPeso(parseFloat((pesoInt + pesoDec / 10).toFixed(1)));
            }
        } catch(e) {
            console.error('Ocorreu um erro ao pegar o ultimo registro', e);
        } finally {
            setIsLoading(false);
        }
    }, [usuario.id]);

    const handleSaveImc = async () => {
        const dados = {
            peso: peso,
            altura: altura / 100.0,
        }

        try {
            await api.post('/imc', dados);
            fetchLatestRegistry();
        } catch(e) {
            console.error('Erro salvar o IMC', e);
        }
    }

    const [isLoading, setIsLoading] = useState(true);

    const [historicoModalVisible, setHistoricoModalVisible] = useState(false);

    useEffect(() => {
        fetchLatestRegistry();
    }, [fetchLatestRegistry]);

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F7' }}>
                <ActivityIndicator size="large" color="#6C83A1" />
            </View>
        );
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
                fontSize: 10.75 * scale,
                color: '#6C83A1',
                lineHeight: 11.075 * scale
            }}>Índice de Massa Corporal</Text>

            <View style={styles.result}>
                {
                    isLoading ? (
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ActivityIndicator color='#6C83A1' size="large" /> 
                        </View>
                    ) : (
                        <>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 8.5 * scale,
                                color: '#6C83A1',
                                lineHeight: 9.35 * scale
                            }}>Seu IMC é de: {ultimoRegistro?.imc ?? 15}!</Text>

                            <View style={styles.resultInfo}onLayout={(event) => {
                                const { width, height } = event.nativeEvent.layout;
                                setVelocimetroSize({ width, height });
                            }}>
                                <Velocimetro
                                    velocidade={ultimoRegistro?.imc ?? 15}
                                    width={velocimetroSize.width}
                                    height={velocimetroSize.height}
                                />
                            </View>
                        </>
                    )
                }
            </View>

            <View style={styles.wheelInput}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 10 * scale,
                    color: '#6C83A1',
                    lineHeight: 13 * scale,
                }}>Altura: {altura}cm</Text>

                <View style={styles.wheel}>
                    <MemoizedWheelPicker
                        data={alturas}
                        value={altura}
                        enableScrollByTapOnItem={true}
                        visibleItemCount={3}
                        itemTextStyle={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8.5 * scale,
                            color: '#a4b7cfff',
                        }}
                        width={0.5 * width}
                        overlayItemStyle={{
                            backgroundColor: '#b9cadfff',
                            opacity: 0.125,
                        }}
                        itemHeight={0.0666 * height}
                        onValueChanged={({item: {value}}) => setAltura(value)}
                    />
                </View>
            </View>

            <View style={styles.wheelInput}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 10 * scale,
                    color: '#6C83A1',
                    lineHeight: 13 * scale,
                }}>Peso: {peso}kg</Text>

                <View style={[styles.wheel, { gap: 0.0444 * width }]}>
                    <MemoizedWheelPicker
                        data={pesosInteiro}
                        value={pesoInteiro}
                        enableScrollByTapOnItem={true}
                        visibleItemCount={3}
                        itemTextStyle={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8.5 * scale,
                            color: '#a4b7cfff',
                        }}
                        width={0.33 * width}
                        overlayItemStyle={{
                            backgroundColor: '#b9cadfff',
                            opacity: 0.125,
                        }}
                        itemHeight={0.0666 * height}
                        onValueChanged={({item: {value}}) => {
                            setPesoInteiro(value);
                            setPeso(parseFloat((value + (pesoDecimal / 10)).toFixed(1)));
                        }}
                    />

                    <MemoizedWheelPicker
                        data={pesosDecimal}
                        value={pesoDecimal}
                        enableScrollByTapOnItem={true}
                        visibleItemCount={3}
                        itemTextStyle={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8.5 * scale,
                            color: '#a4b7cfff',
                        }}
                        width={0.33 * width}
                        overlayItemStyle={{
                            backgroundColor: '#b9cadfff',
                            opacity: 0.125,
                        }}
                        itemHeight={0.0666 * height}
                        onValueChanged={({item: {value}}) => {
                            setPesoDecimal(value);
                            setPeso(parseFloat((pesoInteiro + (value / 10)).toFixed(1)));
                        }}
                    />
                </View>
            </View>

            <View style={styles.actions}>
                <Pressable style={[styles.btn, { backgroundColor: '#fff' }]} onPress={() => setHistoricoModalVisible(true)}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7.5 * scale,
                        color: '#6C83A1',
                        lineHeight: 8.25 * scale,
                    }}>Histórico</Text>
                </Pressable>

                <Pressable style={[styles.btn, { backgroundColor: '#6C83A1' }]} onPress={() => handleSaveImc()}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7.5 * scale,
                        color: '#fff',
                        lineHeight: 8.25 * scale,
                    }}>Calcular</Text>
                </Pressable>
            </View>

            <ImcModalHistorico visible={historicoModalVisible} setVisible={setHistoricoModalVisible} height={height} width={width} scale={scale}></ImcModalHistorico>

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
                                    }}>IMC</Text>
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
                                    }}>Calcular e monitorar o Índice de Massa Corporal.</Text>
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
                                    }}>Peso, altura.</Text>
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
                                    }}>Insira seus dados nas roletas.</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Toque em "Calcular".</Text>
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
                                    }}>Cálculo automático do IMC + histórico de evolução.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </View>
    )
}

export default Imc;