import {
    View,
    Pressable,
    Image,
    Text,
    PixelRatio,
    useWindowDimensions,
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useAuth } from '../../hooks/useAuth';

import { BASE_URL_STORAGE } from '../../constants/api';
import { dynamicStyles } from './styles';

const Home = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);
    const scale = PixelRatio.get();

    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const { usuario, signOut } = useAuth();

    const navigation = useNavigation();

    const data = new Date();

    const imagemPerfilUrl = usuario?.fotoPerfil
        ? `${BASE_URL_STORAGE}/${usuario.fotoPerfil}`
        : null;

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.user}>
                    <Pressable
                        style={styles.userImg}
                        onPress={() => setMostrarOpcoes(!mostrarOpcoes)}
                    >
                        <Image
                            source={
                                imagemPerfilUrl
                                    ? { uri: imagemPerfilUrl }
                                    : require('../../../assets/imgs/user-icon.png')
                            }
                            style={{
                                height: '100%',
                                aspectRatio: 1 / 1,
                                objectFit: 'contain',
                                borderRadius: 9999,
                            }}
                        />
                    </Pressable>

                    <View style={styles.userInfo}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 8 * scale,
                                color: '#475C7C',
                            }}
                        >
                            Olá, {usuario?.name}!
                        </Text>

                        <Text
                            style={{
                                width: '100%',
                                fontFamily: 'Poppins-M',
                                fontSize: 4.5 * scale,
                                color: '#6A84AA',
                            }}
                        >
                            {data.getDate()} de{' '}
                            {
                                [
                                    'janeiro',
                                    'fevereiro',
                                    'março',
                                    'abril',
                                    'maio',
                                    'junho',
                                    'julho',
                                    'agosto',
                                    'setembro',
                                    'outubro',
                                    'novembro',
                                    'dezembro',
                                ][data.getMonth()]
                            }{' '}
                            de 2025
                        </Text>
                    </View>
                </View>

                <View style={styles.notifications} />
            </View>

            {mostrarOpcoes && (
                <View style={styles.userImgOptions}>
                    <Pressable
                        style={styles.userImgOption}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Text
                            style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 5 * scale,
                                color: '#dadada',
                            }}
                        >
                            Editar perfil
                        </Text>
                    </Pressable>

                    <Pressable style={styles.userImgOption} onPress={signOut}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 5 * scale,
                                color: '#dadada',
                            }}
                        >
                            Sair
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* APPS */}
            <View style={styles.apps}>
                <View style={styles.appsHeader}>
                    <Text
                        style={{
                            width: '60%',
                            fontFamily: 'Poppins-M',
                            fontSize: 13 * scale,
                            color: '#6C83A1',
                            flexShrink: 1,
                        }}
                    >
                        Aplicações
                    </Text>
                </View>

                <View style={styles.appsContainer}>
                    {/* Linha 1 */}
                    <Pressable
                        style={styles.appSquare}
                        onPress={() => navigation.navigate('Calorias')}
                    >
                        <Image
                            source={require('../../../assets/imgs/calorias.png')}
                            style={{
                                height: '60%',
                                aspectRatio: 1 / 1,
                                objectFit: 'contain',
                            }}
                        />
                    </Pressable>

                    <Pressable
                        style={styles.appSquare}
                        onPress={() => navigation.navigate('Agua')}
                    />

                    <Pressable
                        style={styles.appSquare}
                        onPress={() => navigation.navigate('Meditacao')}
                    />

                    {/* Linha 2 */}
                    <Pressable style={styles.appSquare} />
                    <Pressable style={styles.appSquare} />
                    <Pressable style={styles.appSquare} />

                    {/* Linha 3 */}
                    <Pressable style={styles.appSquare} />
                    <Pressable style={styles.appSquare} />
                    <Pressable style={styles.appSquare} />
                </View>
            </View>

            {/* METAS */}
            <View style={styles.targets}>
                <View style={styles.targetsHeader}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 13 * scale,
                            color: '#6C83A1',
                            flexShrink: 1,
                        }}
                    >
                        Metas do dia
                    </Text>
                </View>
            </View>

            {/* NAVBAR */}
            <View style={styles.navbar}>
                <View style={styles.navbarAppSelected} />

                <View style={styles.navbarApp} />

                <View style={styles.navbarApp} />

                <View style={styles.navbarApp} />
            </View>
        </View>
    );
};

export default Home;
