import { View, Image, Text, TextInput, Pressable, useWindowDimensions, PixelRatio, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useFonts } from 'expo-font';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { dynamicStyles } from './styles';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const { width, height } = useWindowDimensions();
        
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });
    
    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);

    const [nome, setNome] = useState();
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [cep, setCep] = useState();
    const [numero, setNumero] = useState();
    const [complemento, setComplemento] = useState();
    const [logradouro, setLogradouro] = useState();
    const [bairro, setBairro] = useState();
    const [cidade, setCidade] = useState();
    const [estado, setEstado] = useState();

    const pegarCep = () => {
        axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => {
            const data = res.data;
            setLogradouro(data.logradouro);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);
            setComplemento(data.complemento);
        })
        .catch(e => {
            console.error('Erro: ', e);
        })
    }

    const [imagemExibida, setImagemExibida] = useState(null);
    const [novaImagemUri, setNovaImagemUri] = useState(null);
    const [usuario, setUsuario] = useState({});

    const solicitarPermissoes = async () =>{
        const camera = await ImagePicker.requestCameraPermissionsAsync();
        const galeria = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(camera.status !== 'granted' || galeria.status !== 'granted'){
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
            setNovaImagemUri(uriLocal);
            setImagemExibida(uriLocal);
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
            setNovaImagemUri(uriLocal);
            setImagemExibida(uriLocal);
        }
    }

    const carregarUsuario = async () => {
        try {
            const id = await AsyncStorage.getItem('usuario');

            const response = await axios.get(`http://10.0.0.153:8000/api/usuario/${Number(id)}`);

            const userData = response.data;

            setUsuario(userData);

            setNome(userData.nome);
            setEmail(userData.email);
            setCep(userData.cep);
            setNumero(userData.numero);
            setLogradouro(userData.logradouro);
            setBairro(userData.bairro);
            setCidade(userData.cidade);
            setEstado(userData.estado);
            setComplemento(userData.complemento);

            if (userData && userData.fotoPerfil) {
                const urlImagem = `http://10.0.0.153:8000/storage/${userData.fotoPerfil}`;
                setImagemExibida(urlImagem);
            } else {
                console.log("Usuário não possui foto de perfil.");
                setImagemExibida(null); 
            }
        } catch (e) {
            console.error('Erro ao carregar usuário:', e);
        }
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    const atualizar = async () => {
        console.log('atualizando!');

        const us = new FormData();

        us.append('_method', 'PUT')
        us.append('nome', nome);
        us.append('email', email);

        if(novaImagemUri){
            us.append('fotoPerfil', {
                uri: novaImagemUri, 
                type: 'image/jpeg',
                name: 'profile_pic.jpg'
            });
        }

        us.append('cep', cep);
        us.append('numero', numero);
        us.append('complemento', complemento);
        us.append('logradouro', logradouro);
        us.append('bairro', bairro);
        us.append('cidade', cidade);
        us.append('estado', estado);

        const configuracao = {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        }

        axios.post(`http://10.0.0.153:8000/api/usuario/1/`, us, configuracao)
        .then(response => {
            console.log('foi');
            navigation.navigate('Home');
        })
        .catch(error => {
            console.error('--- FALHA NA ATUALIZAÇÃO ---', error);
        });
    }

    return (
        <ScrollView style={{
            width: '100%',
            height: '100%',
        }} contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerBtn}>
                    <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                </View>

                <View style={styles.headerTitle}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 10 * scale,
                        color: '#6C83A1',
                        lineHeight: 12 * scale
                    }}>Editar perfil</Text>
                </View>

                <View style={styles.headerTextBtn}>
                    <Pressable onPress={() => atualizar()}>
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
                        <Image source={imagemExibida ? { uri: imagemExibida } : require('../../../assets/imgs/user-icon.png')} style={{
                            height: '100%',
                            aspectRatio: 1 / 1,
                            backgroundColor: '#fff',
                            borderRadius: 9999
                        }}></Image>
                    </View>

                    <Pressable style={styles.editImgBtn} onPress={() => setMostrarOpcoes(true)}>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} onChangeText={(nm) => setNome(nm)} value={nome}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} onChangeText={(em) => setEmail(em)} value={email}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} onChangeText={(cp) => setCep(cp)} onSubmitEditing={() => pegarCep()} value={cep}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} onChangeText={(nm) => setNumero(nm)} value={numero}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} editable={false} value={complemento}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} editable={false} value={logradouro}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} editable={false} value={bairro}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} editable={false} value={cidade}></TextInput>
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
                                    padding: '3.5%',
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6.5 * scale,
                                    color: '#8a9cb5ff'
                                }} multiline={false} scrollEnabled={false} editable={false} value={estado}></TextInput>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.editBtn}>
                    <Pressable onPress={() => atualizar()}>
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
                    <Pressable style={styles.userImgOption} onPress={() => escolherDaGaleria()}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#dadada'
                        }}>Escolher foto</Text>
                    </Pressable>

                    <Pressable style={styles.userImgOption} onPress={() => tirarFoto()}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#dadada'
                        }}>Tirar foto</Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    )
}

export default Profile;