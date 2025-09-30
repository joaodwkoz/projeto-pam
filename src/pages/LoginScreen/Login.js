import { View, Pressable, Image, Alert, Text, PixelRatio, useWindowDimensions, TextInput } from 'react-native';
import { useState, useContext } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { dynamicStyles } from './styles';
import { AuthContext } from '../../../contexts/AuthContext';

const Login = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const navigation = useNavigation();

    const { signIn } = useContext(AuthContext);

    const handleLogin = async () => {
        if(!email || !senha){
            Alert.alert('Erro de Login', 'Por favor, insira as infos necessárias.');
            return;
        }

        try {
            await signIn(email, senha);
        } catch(e) {
            Alert.alert('Erro de Login', e.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.loginForm}>
                <View style={styles.loginText}>
                    <Text style={{
                        fontFamily: 'Poppins-SB',
                        fontSize: 10 * scale,
                        lineHeight: 11 * scale,
                        color: '#607DA3'
                    }}>A sua saúde em um clique!</Text>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        lineHeight: 11 * scale,
                        color: '#97B9E5'
                    }}>Entre em sua conta para usar</Text>
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
                        }} scrollEnabled={false} multiline={false} onChangeText={(em) => setEmail(em)} value={email}></TextInput>
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
                        }} scrollEnabled={false} multiline={false} onChangeText={(sn) => setSenha(sn)} value={senha}></TextInput>
                    </View>

                    <View style={styles.inputExtra}>
                        <FontAwesome name='eye' color='#97B9E5' size={0.0444 * width} />
                    </View>
                </View>

                <Pressable style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={{
                        fontFamily: 'Poppins-SB',
                        fontSize: 8 * scale,
                        color: '#fff',
                    }}>
                        Login
                    </Text>
                </Pressable>

                <View style={styles.accountOptions}>
                    <Pressable onPress={() => navigation.navigate('Signup')}>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 6 * scale,
                            color: '#567091ff',
                        }}>Cadastrar-se</Text>
                    </Pressable>

                    <Pressable>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 6 * scale,
                            color: '#7690b2ff',
                        }}>Esqueceu a senha?</Text>
                    </Pressable>
                </View>

                <View style={styles.orLoginWith}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 6 * scale,
                        color: '#607DA3',
                    }}>Ou entrar com</Text>

                    <View style={styles.orLoginWithBtns}>
                        <Pressable style={styles.orLoginWithBtn}>
                            <FontAwesome name='google' color='#6C83A1' size={0.0444 * width} />
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                lineHeight: 9 * scale,
                                color: '#6C83A1',
                            }}>Google</Text>
                        </Pressable>

                        <Pressable style={styles.orLoginWithBtn}>
                            <FontAwesome name='facebook-f' color='#6C83A1' size={0.0444 * width} />
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                lineHeight: 7.7 * scale,
                                color: '#6C83A1',
                            }}>Facebook</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Login;