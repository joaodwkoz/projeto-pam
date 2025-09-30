
import { View, Pressable, Image, Alert, Text, PixelRatio, useWindowDimensions } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { dynamicStyles } from './styles';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const { usuario, signOut } = useContext(AuthContext);

    const navigation = useNavigation();

    const imagemPerfilUrl = usuario?.fotoPerfil 
        ? `http://192.168.0.5:8000/storage/${usuario.fotoPerfil}` 
        : null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.user}>
                    <Pressable style={styles.userImg} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                        <Image source={imagemPerfilUrl ? { uri: imagemPerfilUrl } : require('../../../assets/imgs/user-icon.png')} style={{
                            height: '100%',
                            aspectRatio: 1 / 1,
                            objectFit: 'contain',
                            borderRadius: 9999
                        }} />
                    </Pressable>

                    <View style={styles.userInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#475C7C'
                        }}>Olá, {usuario?.name}</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#6A84AA'
                        }}>{data.getDate()} de {['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][data.getMonth()]} de 2025</Text>
                    </View>
                </View>

                <View style={styles.notifications}>

                </View>
            </View>

            {mostrarOpcoes && (
                <View style={styles.userImgOptions}>
                    <Pressable style={styles.userImgOption} onPress={() => navigation.navigate('Profile')}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#dadada'
                        }}>Editar perfil</Text>
                    </Pressable>

                    <Pressable style={styles.userImgOption} onPress={signOut}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#dadada'
                        }}>Sair</Text>
                    </Pressable>
                </View>
            )}

            <View style={styles.apps}>
                <View style={styles.appsHeader}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1'
                    }}>Aplicações</Text>

                    <Pressable>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 7 * scale,
                            color: '#546A87',
                        }}>Ver todas</Text>
                    </Pressable>
                </View>

                <View style={styles.appsContainer}>
                    <View style={styles.mainApp}>

                    </View>

                    <View style={styles.otherApps}>
                        <View style={styles.app}></View>

                        <View style={styles.app}></View>
                    </View>
                </View>
            </View>

            <View style={styles.targets}>
                <View style={styles.targetsHeader}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1'
                    }}>Metas do dia</Text>
                </View>
            </View>
        </View>
    )
}

export default Home;