import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../contexts/AuthContext';
import api from '../../../services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';

import { dynamicStyles } from './styles';

function formatDateToYYYYMMDD(dateObj) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const Alergias = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { usuario } = useContext(AuthContext);

    const CATEGORIAS = [
        {
            icon: {
                lib: MaterialCommunityIcons,
                nome: 'food-drumstick'
            },
            nome: 'Alimentar',
            cor: '#a8d8ff',
        },
        {
            icon: {
                lib: FontAwesome5,
                nome: 'lungs'
            },
            nome: 'Respiratória',
            cor: '#b0e3c7',
        },
        {
            icon: {
                lib: FontAwesome5,
                nome: 'briefcase-medical'
            },
            nome: 'Medicamentosa',
            cor: '#f4978e',
        },
        {
            icon: {
                lib: MaterialCommunityIcons,
                nome: 'hand-wash'
            },
            nome: 'Contato',
            cor: '#cea8ff',
        },
        {
            icon: {
                lib: FontAwesome6,
                nome: 'spider'
            },
            nome: 'Insetos',
            cor: '#000',
        },

        {
            icon: {
                lib: Entypo,
                nome: 'help'
            },
            nome: 'Outros',
            cor: '#dedede',
        },
    ]

    const [mostrarModal, setMostrarModal] = useState(false);
    
    const abrirModal = () => setMostrarModal(true);

    const fecharModal = () => {
        setMostrarModal(false);
        setNome();
        setCategoriaEscolhida(-1);
        setMostrarCategorias(false);
        setGravidade();
        setReacoes([]);
        setReacao();
        setDescricao();
    }

    const [nome, setNome] = useState();
    const [categoriaEscolhida, setCategoriaEscolhida] = useState(-1);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);
    const [gravidade, setGravidade] = useState();
    const [reacoes, setReacoes] = useState([]);
    const [reacao, setReacao] = useState();
    const [descricao, setDescricao] = useState();

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
            }}>Alergias</Text>

            <View style={styles.status}>
                <View style={styles.statusCard}>
                    <FontAwesome5 name="shield-alt" size={width * 0.125} color="#6C83A1" />

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 8 * scale,
                        color: '#6C83A1',
                        lineHeight: 10 * scale
                    }}>6 alergias ativas</Text>
                </View>
            </View>

            <View style={styles.myAllergies}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 10 * scale,
                    color: '#6C83A1',
                    lineHeight: 13 * scale
                }}>Minhas alergias</Text>

                <Pressable style={styles.addAllergy} onPress={abrirModal}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        color: '#fff',
                        lineHeight: 7.7 * scale
                    }}>Adicionar</Text>
                </Pressable>
            </View>

            <ScrollView style={{
                flex: 1,
                width: '100%',
            }} contentContainerStyle={{
                gap: 0.0222 * height,
            }}>
                <View style={styles.allergy}>
                    <View style={styles.allergyInfo}>
                        <MaterialCommunityIcons name="food-drumstick" size={width * 0.1} color="#a8d8ffff" />

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#a8d8ffff',
                            lineHeight: 11 * scale
                        }}>Carne de porco</Text>
                    </View>

                    <Ionicons name="alert-circle" size={width * 0.1} color="#f4978e" />
                </View>

                <View style={styles.allergy}>
                    <View style={styles.allergyInfo}>
                        <FontAwesome5 name="lungs" size={width * 0.1} color="#b0e3c7" />

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#b0e3c7',
                            lineHeight: 11 * scale
                        }}>Poeira</Text>
                    </View>

                    <Ionicons name="alert-circle" size={width * 0.1} color="#f4978e" />
                </View>

                <View style={styles.allergy}>
                    <View style={styles.allergyInfo}>
                        <FontAwesome5 name="briefcase-medical" size={width * 0.1} color="#f4978e" />

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#f4978e',
                            lineHeight: 11 * scale
                        }}>Dipirona</Text>
                    </View>

                    <Ionicons name="alert-circle" size={width * 0.1} color="#fff1a8" />
                </View>

                <View style={styles.allergy}>
                    <View style={styles.allergyInfo}>
                        <MaterialCommunityIcons name="hand-wash" size={width * 0.1} color="#cea8ffff" />

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#cea8ffff',
                            lineHeight: 11 * scale
                        }}>Parede</Text>
                    </View>

                    <Ionicons name="alert-circle" size={width * 0.1} color="#fff1a8" />
                </View>

                <View style={styles.allergy}>
                    <View style={styles.allergyInfo}>
                        <FontAwesome6 name="spider" size={width * 0.1} color="black" />

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: 'black',
                            lineHeight: 11 * scale
                        }}>Aranha</Text>
                    </View>

                    <Ionicons name="alert-circle" size={width * 0.1} color="#b0e3c7" />
                </View>

                <View style={styles.allergy}>
                    <View style={styles.allergyInfo}>
                        <Entypo name="help" size={width * 0.1} color="#dedede" />

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#dedede',
                            lineHeight: 11 * scale
                        }}>Donald Trump</Text>
                    </View>

                    <Ionicons name="alert-circle" size={width * 0.1} color="#b0e3c7" />
                </View>
            </ScrollView>

            <Modal visible={mostrarModal} transparent>
                <View style={styles.allergyModalContainer}>
                    <View style={styles.allergyModal}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#6C83A1',
                            lineHeight: 10 * scale 
                        }}>Registrar nova alergia</Text>

                        <View style={styles.allergyModalInput}>
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
                            }} scrollEnabled={false} multiline={false} value={nome} onChangeText={setNome}></TextInput>
                        </View>

                        <View style={styles.allergyModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Categoria</Text>

                            <Pressable style={styles.allergyModalSelect}onPress={() => setMostrarCategorias(!mostrarCategorias)}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 9 * scale,
                                }}>{categoriaEscolhida !== -1 ? CATEGORIAS[categoriaEscolhida].nome : 'Selecione uma categoria'}</Text>
                            </Pressable>

                            {mostrarCategorias && <View style={styles.allergyModalOptionsContainer}>
                                <ScrollView style={{
                                    width: '100%',
                                    height: '100%',
                                }} contentContainerStyle={{
                                    gap: 0.0222 * width,
                                }} showsVerticalScrollIndicator={false}>
                                    { CATEGORIAS.map((c, i) => (
                                        <Pressable style={styles.allergyModalOption} key={i} onPress={() => {
                                            setCategoriaEscolhida(i);
                                            setMostrarCategorias(false);
                                        }}>
                                            <c.icon.lib name={c.icon.nome} size={width * 0.05} color={c.cor} />

                                            <Text style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 5 * scale,
                                                color: c.cor,
                                            }}>{c.nome}</Text>
                                        </Pressable>
                                    ))}
                                </ScrollView>
                            </View>}
                        </View>

                        <View style={styles.allergyModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Gravidade</Text>

                            <View style={styles.allergyModalRadioBtns}>
                                <Pressable style={styles.allergyModalRadioBtn} onPress={() => setGravidade('Leve')}>
                                    {gravidade === 'Leve' ? <Octicons name="check-circle-fill" size={width * 0.05} color="#b0e3c7" />
                                    : 
                                        <View style={[styles.circle, { borderColor: '#b0e3c7' }]}></View>
                                    }

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#b0e3c7',
                                        lineHeight: 6.6 * scale 
                                    }}>Leve</Text>
                                </Pressable>

                                <Pressable style={styles.allergyModalRadioBtn} onPress={() => setGravidade('Moderada')}>
                                    {gravidade === 'Moderada' ? <Octicons name="check-circle-fill" size={width * 0.05} color="#fff1a8" />
                                    : 
                                        <View style={[styles.circle, { borderColor: '#fff1a8' }]}></View>
                                    }

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#fff1a8',
                                        lineHeight: 6.6 * scale 
                                    }}>Leve</Text>
                                </Pressable>

                                <Pressable style={styles.allergyModalRadioBtn} onPress={() => setGravidade('Severa')}>
                                    {gravidade === 'Severa' ? <Octicons name="check-circle-fill" size={width * 0.05} color="#f4978e" />
                                    : 
                                        <View style={[styles.circle, { borderColor: '#f4978e' }]}></View>
                                    }

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#f4978e',
                                        lineHeight: 6.6 * scale 
                                    }}>Severa</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.allergyModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Reações comuns</Text>

                            <View style={styles.allergyModalChipInput}>
                                <TextInput style={{
                                    flex: 1,
                                    padding: 0.008 * height,
                                    fontFamily: 'Poppins-M',
                                    backgroundColor: '#fff',
                                    borderColor: '#eee',
                                    borderWidth: 0.002 * height,
                                    borderRadius: 0.01 * height,
                                    color: '#6C83A1',
                                }} scrollEnabled={false} multiline={false} value={reacao} onChangeText={setReacao}></TextInput>

                                <Pressable style={styles.allergyModalAddReactionBtn} onPress={() => {
                                    setReacoes(prev => [...prev, reacao]);
                                    setReacao();
                                }}>
                                    <Entypo name="plus" size={24} color="#fff" />
                                </Pressable>
                            </View>

                            {reacoes.length > 0 && <View style={styles.allergyModalReactionsContainer}>
                                <ScrollView style={{
                                    width: '100%',
                                    maxHeight: '100%',
                                }} contentContainerStyle={{
                                    gap: 0.0222 * width
                                }}>
                                    {reacoes.map((r, i) => (
                                        <View style={styles.allergyModalReaction} key={i}>
                                            <Text style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 7 * scale,
                                                color: '#6C83A1',
                                                lineHeight: 7.7 * scale 
                                            }}>{r}</Text>

                                            <Pressable onPress={() => setReacoes(prev => prev.filter((v, index) => index !== i))}>
                                                <AntDesign name="close-circle" size={(0.15 * height - 0.0444 * width) / 3 - 0.0444 * width} color="#6C83A1" />
                                            </Pressable>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>}
                        </View>

                        <View style={styles.allergyModalActions}>
                            <Pressable style={styles.allergyModalBtn} onPress={fecharModal}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.7 * scale 
                                }}>Cancelar</Text>
                            </Pressable>

                            <Pressable style={[styles.allergyModalBtn, { backgroundColor: '#6C83A1' }]}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#fff',
                                    lineHeight: 7.7 * scale 
                                }}>Salvar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default Alergias;