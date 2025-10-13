import { View, Image, Text, TextInput, Pressable, useWindowDimensions, PixelRatio, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { dynamicStyles } from './styles';
import { useNavigation } from '@react-navigation/native';
import api from '../../../services/api';
import { AuthContext } from '../../../contexts/AuthContext';

const Profile = () => {
    const { width, height } = useWindowDimensions();
        
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });
    
    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { signOut, usuario, updateUser } = useContext(AuthContext);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [dadosUsuario, setDadosUsuario] = useState({
        name: '',
        email: '',
        cep: '',
        numero: '',
        complemento: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
    });

    const [novaFoto, setNovaFoto] = useState(null);

    const inputChange = (campo, valor) => {
        setDadosUsuario(prevState => ({
            ...prevState,
            [campo]: valor,
        }))
    }

    const pegarCep = () => {
        axios.get(`https://viacep.com.br/ws/${dadosUsuario.cep}/json/`)
        .then(res => {
            const data = res.data;

            setDadosUsuario(prevState => ({
                ...prevState,
                logradouro: data.logradouro,
                bairro: data.bairro,
                cidade: data.localidade,
                estado: data.uf,
                complemento: data.complemento,
            }));
        })
        .catch(e => {
            console.error('Erro: ', e);
        })
    }

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const res = await api.get('/usuario');
                setDadosUsuario(res.data);
            } catch(e) {
                console.error("Erro ao buscar dados do usuário:", e);
                signOut();
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsuario();
    }, []);

    const updateUsuario = async () => {
        const dados = new FormData();

        Object.keys(dadosUsuario).forEach(key => {
            if(key !== 'fotoPerfil'){
                dados.append(key, dadosUsuario[key]);
            }
        })

        if(novaFoto){
            const urlParts = novaFoto.uri.split('.');
            const ext = urlParts[urlParts.length - 1];

            dados.append('fotoPerfil', {
                uri: novaFoto.uri,
                name: `foto.${ext}`,
                type: `image/${ext}`
            })
        }

        dados.append('_method', 'PUT');

        try {
            setIsLoading(true);

            const res = await api.post(`/usuario/${usuario.id}`, dados, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            updateUser(res.data.usuario);

            Alert.alert("Sucesso!", "Perfil atualizado.");
            setMostrarOpcoes(false);
        } catch(e) {
            console.error("Erro ao atualizar usuário:", e.response?.data || e.message);
            Alert.alert("Erro", "Não foi possível atualizar o perfil.");
        } finally {
            setIsLoading(false);
        }
    }

    const solicitarPermissoes = async () =>{
        const camera = await ImagePicker.requestCameraPermissionsAsync();
        const galeria = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(camera.status !== 'granted' || galeria.status !== 'granted'){
            Alert.alert('Permissão negada', 'É necessário permitir acesso à câmera e galeria.');
            return false; 
        }

        return true;
    }

    const tirarFoto = async () => {
        console.log(1);

        const permissoes = await solicitarPermissoes();

        if(!permissoes) return;

        const resultado = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            cameraType: ImagePicker.CameraType.front,
            aspect: [1, 1],
        });

        if(!resultado.canceled){
            setNovaFoto({uri: resultado.assets[0].uri});
            setMostrarOpcoes(false);
        }
    }

    const escolherDaGaleria = async () => {
        console.log(2);

        const permissoes = await solicitarPermissoes();
        
        if(!permissoes) return;

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            aspect: [1, 1],
            base64: true,
            exif: true,
        });
            
        if(!resultado.canceled){
            setNovaFoto({uri: resultado.assets[0].uri});
            setMostrarOpcoes(false);
        }
    }

    if(isLoading){
        return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    const imagemAntigaUrl = dadosUsuario.fotoPerfil 
        ? `http://10.67.5.27:8000/storage/${dadosUsuario.fotoPerfil}` 
        : null;

    return (
        <ScrollView style={{
            width: '100%',
            height: '100%',
        }} contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                </Pressable>

                <View style={styles.headerTitle}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 10 * scale,
                        color: '#6C83A1',
                        lineHeight: 12 * scale
                    }}>Editar perfil</Text>
                </View>

                <View style={styles.headerTextBtn}>
                    <Pressable onPress={updateUsuario}>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 8 * scale,
                            color: '#576c88',
                            lineHeight: 10 * scale
                        }}>Salvar</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.editProfile}>
                <View style={styles.editUserImg}>
                    <View style={styles.userImg}>
                        <Image source={novaFoto ? { uri: novaFoto.uri } : (imagemAntigaUrl ? { uri: imagemAntigaUrl } : require('../../../assets/imgs/user-icon.png'))} style={{
                            height: '100%',
                            aspectRatio: 1 / 1,
                            borderRadius: 9999
                        }} />
                    </View>

                    <Pressable style={styles.editImgBtn} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            lineHeight: 7.7 * scale,
                            color: '#8a9cb5ff',
                        }}>Alterar foto</Text>
                    </Pressable>
                </View>

                <View style={styles.editProfileBody}>
                    <View style={styles.editInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7.5 * scale,
                            color: '#8a9cb5ff'
                        }}>Dados pessoais</Text>

                        <View style={styles.editInputs}>
                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Nome</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.name} onChangeText={(text) => inputChange('name', text)}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Email</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.email} onChangeText={(text) => inputChange('email', text)}></TextInput>
                            </View>
                        </View>
                    </View>

                    <View style={styles.editInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7.5 * scale,
                            color: '#8a9cb5ff'
                        }}>Segurança</Text>

                        <View>
                            <Pressable>
                                <Text style={{
                                    fontFamily: 'Poppins-SB',
                                    fontSize: 7.5 * scale,
                                    color: '#576c88'
                                }}>Alterar senha</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={styles.editInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7.5 * scale,
                            color: '#8a9cb5ff'
                        }}>Endereço</Text>

                        <View style={styles.editInputs}>
                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Cep</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.cep} onChangeText={(text) => inputChange('cep', text)} onSubmitEditing={pegarCep}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Número</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.numero} onChangeText={(text) => inputChange('cep', text)}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Complemento</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.complemento} onChangeText={(text) => inputChange('complemento', text)}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Logradouro</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.logradouro} onChangeText={(text) => inputChange('logradouro', text)}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Bairro</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.bairro} onChangeText={(text) => inputChange('bairro', text)}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Cidade</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.cidade} onChangeText={(text) => inputChange('cidade', text)}></TextInput>
                            </View>

                            <View style={styles.editInput}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#aab8ccff'
                                }}>Estado</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.055 * height,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.0125 * height,
                                    padding: 6 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    color: '#8a9cb5ff',
                                }} value={dadosUsuario.estado} onChangeText={(text) => inputChange('estado', text)}></TextInput>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.editBtn}>
                    <Pressable onPress={updateUsuario}>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 8 * scale,
                            color: '#fff',
                        }}>
                            Salvar
                        </Text>
                    </Pressable>
                </View>
            </View>

            {mostrarOpcoes && (
                <View style={styles.userImgOptions}>
                    <Pressable style={styles.userImgOption} onPress={tirarFoto}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#dadada'
                        }}>Tirar foto</Text>
                    </Pressable>

                    <Pressable style={styles.userImgOption} onPress={escolherDaGaleria}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#dadada'
                        }}>Escolher foto</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    )
}

export default Profile;