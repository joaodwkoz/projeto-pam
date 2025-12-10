import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ScrollView } from 'react-native';
import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';

import { MaterialCommunityIcons, FontAwesome5, Ionicons, FontAwesome6, Entypo } from '@expo/vector-icons';

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

    const APPS = [
        { nome: 'Meus Remédios', icon: 'pill', lib: MaterialCommunityIcons, route: 'Remedios' },
        { nome: 'Batimentos', icon: 'heartbeat', lib: FontAwesome5, route: 'Batimentos' },
        { nome: 'Hidratação', icon: 'water', lib: Ionicons, route: 'Agua' },
        { nome: 'Controle de Calorias', icon: 'fire', lib: MaterialCommunityIcons, route: 'Calorias' },
        { nome: 'Cálculo de IMC', icon: 'weight', lib: FontAwesome5, route: 'Imc' },
        { nome: 'Minhas Alergias', icon: 'hand-holding-medical', lib: FontAwesome5, route: 'Alergias' },
        { nome: 'Glicemia', icon: 'water-percent', lib: MaterialCommunityIcons, route: 'Glicemia' },
        { nome: 'Meditação', icon: 'spa', lib: MaterialCommunityIcons, route: 'Meditacao' },
        { nome: 'Motivação Diária', icon: 'star', lib: Entypo, route: 'Motivacao' },
        { nome: 'Guia de Frutas', icon: 'fruit-watermelon', lib: MaterialCommunityIcons, route: 'Frutas' },
        { nome: 'Emergência', icon: 'ambulance', lib: FontAwesome5, route: 'Emergencia' },
        { nome: 'Pressão Arterial', icon: 'heart-plus', lib: MaterialCommunityIcons, route: 'Pressao' },
        { nome: 'Lista de Vacinas', icon: 'syringe', lib: FontAwesome6, route: 'Vacinas' },
    ];

    const shuffledApps = useMemo(() => {
        const list = [...APPS];
        return list.sort(() => Math.random() - 0.5);
    }, []);

    const DESTAQUES = [shuffledApps[0], shuffledApps[1], shuffledApps[2]];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.user}>
                    <Pressable style={styles.userImg} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                        <Image source={imagemPerfilUrl ? { uri: imagemPerfilUrl } : require('../../../assets/imgs/user-icon.png')} style={{
                            height: '100%',
                            aspectRatio: 1 / 1,
                            objectFit: 'cover',
                            borderRadius: 9999
                        }} />
                    </Pressable>

                    <View style={styles.userInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#475C7C'
                        }}>Olá, {usuario?.name || 'Usuário'}!</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 4.5 * scale,
                            color: '#6A84AA'
                        }}>{data.getDate()} de {['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][data.getMonth()]} de 2025</Text>
                    </View>
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

            <View style={styles.sectionContainer}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 11.5 * scale,
                    color: '#6C83A1',
                    marginBottom: 0.0222 * width
                }}>Acesso Rápido</Text>

                <View style={styles.featuredGrid}>
                    {DESTAQUES.map((app, index) => (
                        <Pressable key={index} style={styles.featuredCard} onPress={() => navigation.navigate(app.route)}>
                            <View style={styles.featuredIcon}>
                                <View style={styles.featuredIconCircle}>
                                    <app.lib name={app.icon} size={width * 0.0625} color="#6C83A1" />
                                </View>
                            </View>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 5.5 * scale,
                                color: '#6C83A1',
                                textAlign: 'center'
                            }} numberOfLines={2} ellipsizeMode='tail'>{app.nome}</Text> 
                        </Pressable>
                    ))}
                </View>
            </View>

            <View style={styles.listContainer}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 11.5 * scale,
                    color: '#6C83A1',
                    marginBottom: 0.0222 * width
                }}>Todas as aplicações</Text>

                <ScrollView 
                    style={styles.scrollView} 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {APPS.map((app, index) => (
                        <Pressable key={index} style={styles.appCard} onPress={() => navigation.navigate(app.route)}>
                            <View style={styles.listIconCircle}>
                                <app.lib name={app.icon} size={width * 0.06} color="#6C83A1" />
                            </View>
                            
                            <View style={styles.textContainer}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 8 * scale,
                                    color: '#6C83A1',
                                    textAlign: 'left'
                                }}>{app.nome}</Text>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default Home;