import { View, Pressable, Text, PixelRatio, useWindowDimensions, TextInput } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';
import { dynamicStyles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

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

    const cadastrar = async () => {
        console.log('cadastrando!');

        const usuario = new FormData();

        usuario.append('nome', nome);
        usuario.append('email', email);
        usuario.append('senha', senha);
        usuario.append('cep', cep);
        usuario.append('numero', numero);
        usuario.append('complemento', complemento);
        usuario.append('logradouro', logradouro);
        usuario.append('bairro', bairro);
        usuario.append('cidade', cidade);
        usuario.append('estado', estado);

        const configuracao = {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        }

        axios.post('http://10.0.0.176:8000/api/usuario', usuario, configuracao)
        .then(response => {
            console.log(response.data);
            AsyncStorage.setItem("usuario", String(response.data.usuario.id));
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.signupForm}>
                <View style={styles.input}>
                    <View style={styles.inputIcon}>
                        <FontAwesome name="user" color='#97B9E5' size={0.0444 * width} />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4 * scale,
                            lineHeight: 4.4 * scale,
                            color: '#9FBBE0'
                        }}>Nome de usuário</Text>

                        <TextInput style={{
                            width: '100%',
                            padding: 0,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                        }} scrollEnabled={false} multiline={false} onChangeText={(nm) => setNome(nm)}></TextInput>
                    </View>
                </View>

                <View style={styles.input}>
                    <View style={styles.inputIcon}>
                        <FontAwesome name="envelope" color='#97B9E5' size={0.0444 * width} />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4 * scale,
                            lineHeight: 4.4 * scale,
                            color: '#9FBBE0'
                        }}>Email</Text>

                        <TextInput style={{
                            width: '100%',
                            padding: 0,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                        }} scrollEnabled={false} multiline={false} onChangeText={(em) => setEmail(em)}></TextInput>
                    </View>
                </View>

                <View style={styles.input}>
                    <View style={styles.inputIcon}>
                        <FontAwesome name="lock" color='#97B9E5' size={0.0444 * width} />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4 * scale,
                            lineHeight: 4.4 * scale,
                            color: '#9FBBE0'
                        }}>Senha</Text>

                        <TextInput style={{
                            width: '100%',
                            padding: 0,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                        }} scrollEnabled={false} multiline={false} onChangeText={(sn) => setSenha(sn)}></TextInput>
                    </View>

                    <View style={styles.inputExtra}>
                        <FontAwesome name='eye' color='#97B9E5' size={0.0444 * width} />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <View style={[styles.input, { width: '50%'}]}>
                        <View style={styles.inputIcon}>
                            <FontAwesome name="map-marker" color='#97B9E5' size={0.0444 * width} />
                        </View>

                        <View style={styles.inputArea}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 4 * scale,
                                lineHeight: 4.4 * scale,
                                color: '#9FBBE0'
                            }}>Cep</Text>

                            <TextInput style={{
                                width: '100%',
                                padding: 0,
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                lineHeight: 8 * scale,
                            }} scrollEnabled={false} multiline={false} onChangeText={(cep) => setCep(cep)} onSubmitEditing={() => pegarCep()}></TextInput>
                        </View>
                    </View>

                    <View style={[styles.input, {width: '42%'}]}>
                        <View style={styles.inputIcon}>
                            <FontAwesome name="home" color='#97B9E5' size={0.0444 * width} />
                        </View>

                        <View style={styles.inputArea}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 4 * scale,
                                lineHeight: 4.4 * scale,
                                color: '#9FBBE0'
                            }}>Número</Text>

                            <TextInput style={{
                                width: '100%',
                                padding: 0,
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                lineHeight: 8 * scale,
                            }} scrollEnabled={false} multiline={false} onChangeText={(num) => setNumero(num)}></TextInput>
                        </View>
                    </View>
                </View>

                <View style={styles.input}>
                    <View style={styles.inputIcon}>
                        <FontAwesome name="plus" color='#97B9E5' size={0.0444 * width} />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4 * scale,
                            lineHeight: 4.4 * scale,
                            color: '#9FBBE0'
                        }}>Complemento</Text>

                        <TextInput style={{
                            width: '100%',
                            padding: 0,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                        }} scrollEnabled={false} multiline={false} editable={false} value={complemento}></TextInput>
                    </View>
                </View>

                <View style={styles.input}>
                    <View style={styles.inputIcon}>
                        <FontAwesome name="street-view" color='#97B9E5' size={0.0444 * width} />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4 * scale,
                            lineHeight: 4.4 * scale,
                            color: '#9FBBE0'
                        }}>Rua</Text>

                        <TextInput style={{
                            width: '100%',
                            padding: 0,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                        }} scrollEnabled={false} multiline={false} editable={false} value={logradouro}></TextInput>
                    </View>
                </View>

                <View style={styles.input}>
                    <View style={styles.inputIcon}>
                        <FontAwesome name="map-o" color='#97B9E5' size={0.0444 * width} />
                    </View>

                    <View style={styles.inputArea}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4 * scale,
                            lineHeight: 4.4 * scale,
                            color: '#9FBBE0'
                        }}>Bairro</Text>

                        <TextInput style={{
                            width: '100%',
                            padding: 0,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                        }} scrollEnabled={false} multiline={false} editable={false} value={bairro}></TextInput>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <View style={[styles.input, { width: '50%'}]}>
                        <View style={styles.inputIcon}>
                            <FontAwesome name="map-marker" color='#97B9E5' size={0.0444 * width} />
                        </View>

                        <View style={styles.inputArea}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 4 * scale,
                                lineHeight: 4.4 * scale,
                                color: '#9FBBE0'
                            }}>Cidade</Text>

                            <TextInput style={{
                                width: '100%',
                                padding: 0,
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                lineHeight: 8 * scale,
                            }} scrollEnabled={false} multiline={false} editable={false} value={cidade}></TextInput>
                        </View>
                    </View>

                    <View style={[styles.input, {width: '42%'}]}>
                        <View style={styles.inputIcon}>
                            <FontAwesome name="map-signs" color='#97B9E5' size={0.0444 * width} />
                        </View>

                        <View style={styles.inputArea}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 4 * scale,
                                lineHeight: 4.4 * scale,
                                color: '#9FBBE0'
                            }}>Estado</Text>

                            <TextInput style={{
                                width: '100%',
                                padding: 0,
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                lineHeight: 8 * scale,
                            }} scrollEnabled={false} multiline={false} editable={false} value={estado}></TextInput>
                        </View>
                    </View>
                </View>

                <Pressable style={styles.signupBtn} onPress={() => cadastrar()}>
                    <Text style={{
                        fontFamily: 'Poppins-SB',
                        fontSize: 8 * scale,
                        color: '#fff',
                    }}>
                        Cadastrar
                    </Text>
                </Pressable>

                <View style={styles.accountOptions}>
                    <Pressable>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 6 * scale,
                            color: '#567091ff',
                        }}>Fazer login</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default Signup;