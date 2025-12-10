import React, { useState } from 'react';
import { View, Text, SectionList, Pressable, PixelRatio, useWindowDimensions, Modal, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { dynamicStyles } from './styles';

const VACINAS = [
    { title: 'Ao nascer (0 meses)', data: [
        'BCG - Protege contra formas graves de tuberculose',
        'Hepatite B - 1ª dose'
    ]},
    { title: '2 meses', data: [
        'Pentavalente - 1ª dose',
        'VIP - Poliomielite inativada - 1ª dose',
        'Pneumocócica 10 - 1ª dose',
        'Rotavírus - 1ª dose'
    ]},
    { title: '4 meses', data: [
        'Pentavalente - 2ª dose',
        'VIP - 2ª dose',
        'Pneumocócica 10 - 2ª dose',
        'Rotavírus - 2ª dose'
    ]},
    { title: '6 meses', data: [
        'Pentavalente - 3ª dose',
        'VIP - 3ª dose',
        'Meningocócica C - 1ª dose'
    ]},
    { title: '9 meses', data: [
        'Febre Amarela - 1ª dose'
    ]},
    { title: '1 ano', data: [
        'Tríplice Viral - 1ª dose',
        'Hepatite A - dose única',
        'Pneumocócica 10 - Reforço',
        'Meningocócica C - Reforço'
    ]},
    { title: '1 ano e 3 meses', data: [
        'Tetra Viral - Reforço',
        'DTP - Reforço'
    ]},
    { title: '4 anos', data: [
        'DTP - 2º reforço',
        'VOP - Poliomielite - reforço',
        'Tríplice Viral - 2ª dose'
    ]},
    { title: '5 anos', data: [
        'Varicela - dose adicional',
        'Febre Amarela - reforço se necessário'
    ]},
    { title: '9 a 14 anos', data: [
        'HPV - 2 doses para meninas',
        'HPV - 2 doses para meninos'
    ]},
    { title: '11 a 14 anos', data: [
        'Meningocócica ACWY - dose única'
    ]},
    { title: 'Aos 15 anos', data: [
        'dT - Reforço a cada 10 anos',
        'Hepatite B - caso não tenha tomado todas as doses'
    ]},
    { title: 'Gestantes', data: [
        'dTpa - 1 dose a cada gestação',
        'Hepatite B - esquema completo se não vacinada',
        'Influenza - anual'
    ]}
];

const Vacinas = () => {
    const { width, height } = useWindowDimensions();
    const scale = PixelRatio.get();
    const styles = dynamicStyles(width, height);
    const navigation = useNavigation();

    // Estado do Modal de Ajuda
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    if (!fontsLoaded) return null;

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
                fontSize: 12 * scale,
                color: '#6C83A1',
                lineHeight: 15 * scale,
            }}>
                Calendário de Vacinas
            </Text>

            <Text style={{
                fontFamily: 'Poppins-M',
                fontSize: 7 * scale,
                color: '#899fbbff',
                lineHeight: 10 * scale,
            }}>
                Vacinas recomendadas agrupadas por idade
            </Text>

            <SectionList
                sections={VACINAS}
                keyExtractor={(item, index) => item + index}
                style={{ flex: 1, width: '100%' }}
                contentContainerStyle={{ paddingBottom: 0.0444 * width }}
                renderSectionHeader={({ section }) => (
                    <View style={{
                        width: '100%',
                        backgroundColor: '#6C83A1',
                        borderRadius: 0.025 * width,
                        padding: 0.0444 * width,
                        gap: 0.0222 * width
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 9 * scale,
                            color: '#fff',
                            lineHeight: 11 * scale
                        }}>
                            {section.title}
                        </Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={{
                        width: '100%',
                        backgroundColor: '#fafafa',
                        borderRadius: 0.02 * width,
                        padding: 0.0222 * width,
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6.2 * scale,
                            color: '#6C83A1',
                            lineHeight: 9 * scale
                        }}>
                            • {item}
                        </Text>
                    </View>
                )}
                ItemSeparatorComponent={() => (
                    <View style={{ height: 0.0222 * width }} />
                )}
                SectionSeparatorComponent={() => (
                    <View style={{ height: 0.0222 * width }} />
                )}
            />

            {/* Modal de Ajuda */}
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
                                    }}>Vacinas</Text>
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
                                    }}>Informar o calendário de vacinação (SUS).</Text>
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
                                    }}>Idade, nome da vacina, dose.</Text>
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
                                    }}>Apenas consulte a lista para ver quais vacinas são recomendadas para cada idade.</Text>
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
                                    }}>Consulta rápida e fácil do calendário vacinal.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </View>
    );
};

export default Vacinas;