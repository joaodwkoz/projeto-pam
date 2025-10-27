
import { View, Pressable, Image, Alert, Text, PixelRatio, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { dynamicStyles } from './styles';

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

    const data = new Date();

    const imagemPerfilUrl = usuario?.fotoPerfil 
        ? `http://192.168.0.8:8000/storage/${usuario.fotoPerfil}` 
        : null;

    if (!fontsLoaded) {
        return (
            <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />
        )
    }

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
                        }}>Olá, {usuario?.name}!</Text>

                        <Text style={{
                            width: '100%',
                            fontFamily: 'Poppins-M',
                            fontSize: 4.5 * scale,
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
                        width: '60%',
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1',
                        flexShrink: 1,
                    }}>Aplicações</Text>
                </View>

                <View style={styles.appsContainer}>
                    <Pressable style={styles.mainApp} onPress={() => navigation.navigate('Calorias')}>
                        <Image source={require('../../../assets/imgs/calorias.png')} style={{
                            height: '50%',
                            aspectRatio: 1 / 1,
                            objectFit: 'contain'
                        }}></Image>
                    </Pressable>

                    <View style={styles.otherApps}>
                        <Pressable style={styles.app} onPress={() => navigation.navigate('Agua')}></Pressable>

                        <Pressable style={styles.app} onPress={() => navigation.navigate('Batimentos')}></Pressable>
                    </View>
                </View>
            </View>

            <View style={styles.targets}>
                <View style={styles.targetsHeader}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1',
                        flexShrink: 1,
                    }}>Metas do dia</Text>
                </View>
            </View>

            <View style={styles.navbar}>
                <View style={styles.navbarAppSelected}></View>

                <View style={styles.navbarApp}></View>

                <View style={styles.navbarApp}></View>

                <View style={styles.navbarApp}></View>
            </View>
        </View>
    )
}

export default Home;