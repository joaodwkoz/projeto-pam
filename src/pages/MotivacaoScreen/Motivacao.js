import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView, Share } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { dynamicStyles } from './styles';

import { QUOTES, QUICK_TIPS } from '../../constants/app';

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

    useEffect(() => {
        getRandomQuote(categoria);
    }, [categoria]);

    useEffect(() => {
        getRandomQuickTip();

        async function getFrutas() {
            const res = await fetch("https://www.fruityvice.com/api/fruit/all");
            const data = await res.json();
            console.log(data);
        }

        getFrutas();
    }, []);

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
            }}>Bom dia, {usuario.name}!</Text>

            <Text style={{
                fontFamily: 'Poppins-M',
                fontSize: 7 * scale,
                color: '#899fbbff',
                lineHeight: 10 * scale
            }}>Precisando de uma motivação para o dia de hoje?</Text>

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
        </View>
    )
}

export default Motivacao;