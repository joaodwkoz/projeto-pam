import { View, Pressable, Alert, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';

import { dynamicStyles } from './styles';

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
        { icon: { lib: MaterialCommunityIcons, nome: 'food-drumstick' }, nome: 'Alimentar', cor: '#a8d8ff' },
        { icon: { lib: FontAwesome5, nome: 'lungs' }, nome: 'Respiratória', cor: '#b0e3c7' },
        { icon: { lib: FontAwesome5, nome: 'briefcase-medical' }, nome: 'Medicamentosa', cor: '#f4978e' },
        { icon: { lib: MaterialCommunityIcons, nome: 'hand-wash' }, nome: 'Contato', cor: '#cea8ff' },
        { icon: { lib: FontAwesome6, nome: 'spider' }, nome: 'Insetos', cor: '#000' },
        { icon: { lib: Entypo, nome: 'help' }, nome: 'Outros', cor: '#dedede' },
    ]

    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);
    const [modalState, setModalState] = useState('Create');
    
    const abrirModal = () => setMostrarModal(true);

    const fecharModal = () => {
        setMostrarModal(false);
        setModalState('Create');
        setNome('');
        setCategoriaEscolhida(-1);
        setMostrarCategorias(false);
        setGravidade();
        setReacoes([]);
        setReacao('');
        setDescricao('');
        setAlergia({}); 
    }

    const [alergia, setAlergia] = useState({}); 
    const [nome, setNome] = useState('');
    const [categoriaEscolhida, setCategoriaEscolhida] = useState(-1);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);
    const [gravidade, setGravidade] = useState();
    const [reacoes, setReacoes] = useState([]);
    const [reacao, setReacao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [alergias, setAlergias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchAlergias = useCallback(async () => {
        try {
          const res = await api.get(`/usuario/${usuario.id}/alergias`);
          setAlergias(res.data); 
        } catch (e) {
          console.error("Erro ao buscar alergias:", e);
        } finally {
          setIsLoading(false);
        }
    }, [usuario.id]);

    const handleUpdateAlergia = useCallback(async () => {
        const dadosAlergia = {
            nome: nome,
            categoria: CATEGORIAS[categoriaEscolhida].nome,
            gravidade: gravidade,
            descricao: descricao,
            reacoes: reacoes
        };
        setIsSaving(true);
        try {
            const res = await api.put(`/alergias/${alergia}`, dadosAlergia); 
            const ale = res.data;
            setAlergias(prev => prev.map(a => a.id === ale.id ? ale : a));
        } catch(e) {
            Alert.alert("Erro", "Não foi possível atualizar a alergia.");
        } finally {
            setIsSaving(false);
            fecharModal();
        }
    }, [alergia, nome, categoriaEscolhida, gravidade, descricao, reacoes, fecharModal]);

    const handleDeleteAlergia = async () => {
        Alert.alert(
            "Excluir Alergia",
            "Tem certeza que deseja excluir este registro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        setIsSaving(true);
                        try {
                            await api.delete(`/alergias/${alergia}`);
                            setAlergias(prev => prev.filter(item => item.id !== alergia));
                            fecharModal();
                        } catch (e) {
                            Alert.alert("Erro", "Não foi possível excluir a alergia.");
                        } finally {
                            setIsSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleOpenUpdateModal = useCallback((alergiaClicada) => {
        const categoriaIndex = CATEGORIAS.findIndex(c => c.nome === alergiaClicada.categoria);
        const reacoesNomes = alergiaClicada.reacoes ? alergiaClicada.reacoes.map(r => r.nome) : [];
        setModalState('Edit');
        setAlergia(alergiaClicada.id)
        setNome(alergiaClicada.nome);
        setCategoriaEscolhida(categoriaIndex !== -1 ? categoriaIndex : -1);
        setGravidade(alergiaClicada.gravidade);
        setReacoes(reacoesNomes);
        setMostrarModal(true);
    }, []);

    useEffect(() => {
        fetchAlergias();
    }, []);

    const handleSaveAlergia = async () => {
        if (!nome || categoriaEscolhida === -1 || !gravidade) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha nome, categoria e gravidade.");
            return;
        }
        setIsSaving(true);
        const dadosNovaAlergia = {
            nome: nome,
            categoria: CATEGORIAS[categoriaEscolhida].nome,
            gravidade: gravidade,
            descricao: descricao,
            reacoes: reacoes,
            usuario_id: usuario.id 
        };
        try {
            await api.post('/alergias', dadosNovaAlergia);
            fecharModal();
            await fetchAlergias();
        } catch (e) {
            Alert.alert("Erro", "Não foi possível registrar a alergia.");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
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
                    }}>{alergias.length > 0 ? alergias.length : 0} alergias ativas</Text>
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

            <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={{ gap: 0.0222 * height }}>
                {alergias.length > 0 && alergias.map((a, i) => {
                    const categoriaInfo = CATEGORIAS.find(c => c.nome === a.categoria) || CATEGORIAS.find(c => c.nome === 'Outros');
                    const gravidadeCores = { 'Leve': '#b0e3c7', 'Moderada': '#fff1a8', 'Severa': '#f4978e' };
                    const gravidadeCor = gravidadeCores[a.gravidade] || '#dedede';
                    const IconLib = categoriaInfo.icon.lib;

                    return (
                        <Pressable style={styles.allergy} key={i} onPress={() => handleOpenUpdateModal(a)}>
                            <View style={styles.allergyInfo}>
                                <IconLib name={categoriaInfo.icon.nome} size={width * 0.1} color={categoriaInfo.cor} />
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: categoriaInfo.cor, lineHeight: 11 * scale }}>{a.nome}</Text>
                            </View>
                            <Ionicons name="alert-circle" size={width * 0.1} color={gravidadeCor} />
                        </Pressable>
                    )
                })}
            </ScrollView>

            <Modal visible={mostrarModal} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.allergyModalContainer}>
                    <Pressable style={styles.modalBackdrop} onPress={fecharModal}>
                        <Pressable style={styles.allergyModal} onPress={(e) => e.stopPropagation()}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 8 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 10 * scale 
                                }}>{modalState === 'Create' ? 'Registrar nova alergia' : 'Editar alergia'}</Text>

                                {modalState === 'Edit' && (
                                    <Pressable onPress={handleDeleteAlergia}>
                                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#f4978e" />
                                    </Pressable>
                                )}
                            </View>

                            <View style={styles.allergyModalInput}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Nome</Text>
                                <TextInput style={styles.textInputStyle} scrollEnabled={false} multiline={false} value={nome} onChangeText={setNome}></TextInput>
                            </View>

                            <View style={styles.allergyModalInput}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Categoria</Text>
                                <Pressable style={styles.allergyModalSelect} onPress={() => setMostrarCategorias(!mostrarCategorias)}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>{categoriaEscolhida !== -1 ? CATEGORIAS[categoriaEscolhida].nome : 'Selecione uma categoria'}</Text>
                                </Pressable>
                                {mostrarCategorias && <View style={styles.allergyModalOptionsContainer}>
                                    <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ gap: 0.0222 * width }} showsVerticalScrollIndicator={false}>
                                        {CATEGORIAS.map((c, i) => (
                                            <Pressable style={styles.allergyModalOption} key={i} onPress={() => { setCategoriaEscolhida(i); setMostrarCategorias(false); }}>
                                                <c.icon.lib name={c.icon.nome} size={width * 0.05} color={c.cor} />
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 5 * scale, color: c.cor }}>{c.nome}</Text>
                                            </Pressable>
                                        ))}
                                    </ScrollView>
                                </View>}
                            </View>

                            <View style={styles.allergyModalInput}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Gravidade</Text>
                                <View style={styles.allergyModalRadioBtns}>
                                    {['Leve', 'Moderada', 'Severa'].map((g, i) => {
                                        const colors = { 'Leve': '#b0e3c7', 'Moderada': '#fff1a8', 'Severa': '#f4978e' };
                                        return (
                                            <Pressable key={i} style={styles.allergyModalRadioBtn} onPress={() => setGravidade(g)}>
                                                {gravidade === g ? <Octicons name="check-circle-fill" size={width * 0.05} color={colors[g]} />
                                                : <View style={[styles.circle, { borderColor: colors[g] }]}></View> }
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: colors[g], lineHeight: 6.6 * scale }}>{g}</Text>
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.allergyModalInput}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Reações comuns</Text>
                                <View style={styles.allergyModalChipInput}>
                                    <TextInput style={[styles.textInputStyle, {flex: 1}]} scrollEnabled={false} multiline={false} value={reacao} onChangeText={setReacao}></TextInput>
                                    <Pressable style={styles.allergyModalAddReactionBtn} onPress={() => { setReacoes(prev => [...prev, reacao]); setReacao(''); }}>
                                        <Entypo name="plus" size={24} color="#fff" />
                                    </Pressable>
                                </View>
                                {reacoes.length > 0 && <View style={styles.allergyModalReactionsContainer}>
                                    <ScrollView style={{ width: '100%', maxHeight: '100%' }} contentContainerStyle={{ gap: 0.0222 * width }}>
                                        {reacoes.map((r, i) => (
                                            <View style={styles.allergyModalReaction} key={i}>
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 8 * scale }}>{r}</Text>
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
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 7.7 * scale }}>Cancelar</Text>
                                </Pressable>
                                <Pressable 
                                    style={[styles.allergyModalBtn, { backgroundColor: '#6C83A1' }, isSaving && { opacity: 0.7 }]} 
                                    onPress={() => { modalState === 'Create' ? handleSaveAlergia() : handleUpdateAlergia(); }}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <ActivityIndicator size="small" color="#fff" /> : 
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff', lineHeight: 7.7 * scale }}>Salvar</Text>}
                                </Pressable>
                            </View>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>

            {/* Modal de Ajuda */}
            <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.allergyModalContainer}>
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
                                    }}>Alergias</Text>
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
                                    }}>Registrar alergias para fácil acesso.</Text>
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
                                    }}>Tipo, reação, observações.</Text>
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
                                    }}>Insira suas alergias e sintomas.</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>O app salva para consulta rápida.</Text>
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
                                    }}>Lista rápida para mostrar em consultas e emergências.</Text>
                                </View>
                            </ScrollView>

                            <Pressable style={[styles.allergyModalBtn, { marginTop: 0.0222 * height }]} onPress={() => setMostrarModalAjuda(false)}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1' }}>Entendi</Text>
                            </Pressable>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </View>
    )
}

export default Alergias;