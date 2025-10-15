import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../contexts/AuthContext';
import api from '../../../services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { dynamicStyles } from './styles';

import WheelPicker from '@quidone/react-native-wheel-picker';

import Velocimetro from '../../components/Velocimetro';

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
}))

function formatDateToYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
    const [imc, setImc] = useState(20);
    const [velocimetroSize, setVelocimetroSize] = useState({ width: 0, height: 0 });

    const calcularImc = () => {
        let imcCalculado = parseFloat(peso) / (altura * altura / 10000);
        setImc(imcCalculado.toFixed(2));
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
                fontSize: 10.75 * scale,
                color: '#6C83A1',
                lineHeight: 11.075 * scale
            }}>Índice de Massa Corporal</Text>

            <View style={styles.result}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 8.5 * scale,
                    color: '#6C83A1',
                    lineHeight: 9.35 * scale
                }}>Seu IMC é de: {imc}!</Text>

                <View style={styles.resultInfo}onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setVelocimetroSize({ width, height });
                }}>
                    {velocimetroSize.width > 0 && (
                        <Velocimetro
                        velocidade={imc}
                        width={velocimetroSize.width}
                        height={velocimetroSize.height}
                        />
                    )}
                </View>
            </View>

            <View style={styles.wheelInput}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 10 * scale,
                    color: '#6C83A1',
                    lineHeight: 13 * scale,
                }}>Altura: {altura}cm</Text>

                <View style={styles.wheel}>
                    <WheelPicker
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
                    <WheelPicker
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

                    <WheelPicker
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
                <Pressable style={[styles.btn, { backgroundColor: '#fff' }]}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7.5 * scale,
                        color: '#6C83A1',
                        lineHeight: 8.25 * scale,
                    }}>Histórico</Text>
                </Pressable>

                <Pressable style={[styles.btn, { backgroundColor: '#6C83A1' }]} onPress={() => calcularImc()}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7.5 * scale,
                        color: '#fff',
                        lineHeight: 8.25 * scale,
                    }}>Calcular</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default Imc;