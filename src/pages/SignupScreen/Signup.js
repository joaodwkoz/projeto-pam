import { View, Pressable, Image, StyleSheet, Text, PixelRatio, useWindowDimensions, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';

import { dynamicStyles } from './styles';

const Signup = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

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
                        }} scrollEnabled={false} multiline={false}></TextInput>
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
                        }} scrollEnabled={false} multiline={false}></TextInput>
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
                        }} scrollEnabled={false}></TextInput>
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
                            }} scrollEnabled={false}></TextInput>
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
                            }} scrollEnabled={false}></TextInput>
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
                        }} scrollEnabled={false} multiline={false}></TextInput>
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
                        }} scrollEnabled={false} multiline={false}></TextInput>
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
                        }} scrollEnabled={false} multiline={false}></TextInput>
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
                            }} scrollEnabled={false}></TextInput>
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
                            }} scrollEnabled={false}></TextInput>
                        </View>
                    </View>
                </View>

                <Pressable style={styles.signupBtn}>
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