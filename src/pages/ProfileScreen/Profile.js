import { View, Image, Text, TextInput, Pressable, useWindowDimensions, PixelRatio, ScrollView } from 'react-native';
import { useState } from 'react-native';
import { useFonts } from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { dynamicStyles } from './styles';

const Profile = () => {
    const { width, height } = useWindowDimensions();
        
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });
    
    const scale = PixelRatio.get();

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
                    <Pressable>
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
                        <View style={{
                            height: '100%',
                            aspectRatio: 1 / 1,
                            backgroundColor: '#fff',
                            borderRadius: 9999
                        }}></View>
                    </View>

                    <Pressable style={styles.editImgBtn}>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
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
                                }}></TextInput>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.editBtn}>
                    <Pressable>
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
        </ScrollView>
    )
}

export default Profile;