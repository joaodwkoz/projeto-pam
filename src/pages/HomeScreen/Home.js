
import { View, Pressable, Image, Alert, Text, PixelRatio, useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { dynamicStyles } from './styles';

const Home = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const [imagem, setImagem] = useState(null);
    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [usuario, setUsuario] = useState({});

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
            setImagem(resultado.assets[0].uri);
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
            setImagem(resultado.assets[0].uri);
        }
    }

    const carregarUsuario = async () => {
        const id = await AsyncStorage.getItem('usuario');

        axios.get(`http://10.0.0.176:8000/api/usuario/${Number(id)}`)
        .then(res => {
            setUsuario(res.data);
            console.log(usuario);
        })
        .catch(e => {
            console.error('Erro: ', e);
        })
    }
    // pegar id que esta no objeto asyncstorage da chave usuario e fazer um select na rota get

    useEffect(() => {
        carregarUsuario();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.user}>
                    <Pressable style={styles.userImg} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                        <Image source={imagem ? { uri: imagem } : require('../../../assets/imgs/user-icon.png')} style={{
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
                        }}>Olá, {usuario.nome}</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#6A84AA'
                        }}>9 de setembro de 2025</Text>
                    </View>
                </View>

                <View style={styles.notifications}>

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