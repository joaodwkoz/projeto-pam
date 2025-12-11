import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    Image, 
    Modal, 
    useWindowDimensions, 
    PixelRatio,
    ActivityIndicator
} from 'react-native';

import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useFonts } from 'expo-font';
import { FontAwesome5, Entypo } from '@expo/vector-icons'; 

import { dynamicStyles } from './styles';

const UbsProximas = () => {
    const { width, height } = useWindowDimensions();
    const scale = PixelRatio.get();
    const navigation = useNavigation();
    
    const styles = useMemo(() => dynamicStyles(width, height, scale), [width, height, scale]);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState(null);

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(""); // seguro
    const [searchedLocation, setSearchedLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    
    const mapRef = useRef(null);
    
    const [points, setPoints] = useState([
        { id: 1, latitude: -23.552483, longitude: -46.405154, title: "Hospital Geral de Guainases", description: 'Av. Miguel Achiole da Fonseca, 135 - Jardim Sao Paulo', image: require('../../../assets/imgs/hospital-geral-guaianazes.png') },
        { id: 2, latitude: -23.553621, longitude: -46.398648, title: 'UBS Jardim Soares', description: 'R. Feliciano de Mendonça, 496 - Guaianases', image: require('../../../assets/imgs/ubs-e-nir-soares.png') },
        { id: 3, latitude: -23.557712, longitude: -46.412434, title: 'UBS Jardim São Carlos', description: 'R. Macabu, 35 - Jardim Sao Carlos', image: require('../../../assets/imgs/ubs-sao-carlos.png') },
        { id: 4, latitude: -23.563157, longitude: -46.396666, title: 'UBS Prefeito Celso Augusto Daniel', description: 'Rua Jorge Maraccini Pomfilio, 210 - Juscelino Kubitschek', image: require('../../../assets/imgs/ubs-prefeito-cesar-augusto.png') },
        { id: 5, latitude: -23.543884, longitude: -46.414682, title: 'UBS Guaianases II', description: 'R. Cmte. Carlos Ruhl, 189 - Guaianases', image: require('../../../assets/imgs/ubs-guaianases-ii.png') },
        { id: 6, latitude: -23.570946, longitude: -46.402787, title: 'UPA Cidade Tiradentes', description: 'R. Cachoeira Camaleão, s/n - Inácio Monteiro', image: require('../../../assets/imgs/upa-cidade-tiradentes.png') },
        { id: 7, latitude: -23.585200, longitude: -46.398500, title: 'Hospital Municipal Cidade Tiradentes', description: 'Av. dos Metalúrgicos, 1797 - Cidade Tiradentes', image: require('../../../assets/imgs/upa-cidade-tiradentes.png') },
        { id: 8, latitude: -23.548100, longitude: -46.402500, title: 'UBS Primeiro de Outubro', description: 'R. Açucena-do-Brejo, 23 - Jardim Guaianases', image: require('../../../assets/imgs/ubs-primeiro-outubro.png') },
        { id: 9, latitude: -23.557884, longitude: -46.399467, title: 'Farmais Jardim São Paulo', description: 'Av. Miguel Achiole da Fonseca, 985 (Farmácia)', image: require('../../../assets/imgs/farmais-jardim-sao-paulo-ii.png') },
        { id: 10, latitude: -23.529072, longitude: -46.421282, title: 'UBS Jardim Etelvina', description: 'R. Manoel Teodoro Xavier, 138 - Jardim Etelvina', image: require('../../../assets/imgs/ubs-jardim-etelvina.png') },
    ]);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permissão para acessar a localização foi negada');
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    useEffect(() => {
        if (searchedLocation && mapRef.current) {
            mapRef.current.animateToRegion({
                ...searchedLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 600);
        }
    }, [searchedLocation]);

    const handleSearchLocation = async () => {
        if (!address.trim()) {
            alert("Digite algo para pesquisar.");
            return;
        }

        const foundPoint = points.find(p =>
            p.title.toLowerCase().includes(address.toLowerCase())
        );

        if (foundPoint) {
            setSearchedLocation({
                latitude: foundPoint.latitude,
                longitude: foundPoint.longitude
            });
            setSelectedPoint(foundPoint);
            setModalVisible(true);
            return;
        }

        try {
            const result = await Location.geocodeAsync(address);
            if(result.length > 0) {
                const { latitude, longitude } = result[0];
                setSearchedLocation({ latitude, longitude });
            } else {
                alert("Endereço não encontrado.");
            }
        } catch (error) {
            alert("Erro ao buscar o endereço.");
        }
    };

    // ===========================
    //  ⭐ AQUI ESTÁ A CORREÇÃO FINAL ⭐
    // ===========================
    if (!fontsLoaded || !location?.coords?.latitude || !location?.coords?.longitude) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6C83A1" />
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 5 * scale,
                    color: '#666',
                    marginTop: 10
                }}>
                    {errorMsg ? errorMsg : "Carregando localização..."}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modal}>
                        {selectedPoint ? (
                            <>
                                <Text style={{ 
                                    fontFamily: 'Poppins-SB', 
                                    fontSize: 6 * scale, 
                                    color: '#333', 
                                    textAlign: 'center',
                                    lineHeight: 7 * scale
                                }}>
                                    {selectedPoint.title}
                                </Text>
                                
                                <Text style={{ 
                                    fontFamily: 'Poppins-M', 
                                    fontSize: 4.5 * scale, 
                                    color: '#666', 
                                    textAlign: 'center',
                                    lineHeight: 5.5 * scale
                                }}>
                                    {selectedPoint.description}
                                </Text>
                                
                                <Image
                                    source={selectedPoint.image}
                                    style={styles.modalImage}
                                    resizeMode="cover"
                                />
                                
                                <View style={styles.actions}>
                                    <Pressable style={[styles.actionsBtn, { backgroundColor: '#6C83A1' }]} onPress={() => setModalVisible(false)}>
                                        <Text style={{ 
                                            fontFamily: 'Poppins-M', 
                                            fontSize: 5 * scale, 
                                            color: '#fff' 
                                        }}>Voltar</Text>
                                    </Pressable>
                                </View>
                            </>
                        ) : (
                            <ActivityIndicator size="large" color="#6C83A1" />
                        )}
                    </View>
                </View>
            </Modal>

            <View style={styles.mapContainer}>
                
                {/* Barra de busca */}
                <View style={styles.searchContainer}>
                    <Pressable style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                        <Entypo name="chevron-left" size={0.05 * width} color="#6C83A1" /> 
                    </Pressable>
                    
                    <View style={styles.searchBar}>
                        <TextInput 
                            style={{ 
                                fontFamily: 'Poppins-M', 
                                fontSize: 7 * scale,
                                color: '#6C83A1', 
                                height: '100%',
                                width: '100%'
                            }}
                            placeholder="Pesquisar Local..."
                            placeholderTextColor="#999"
                            value={address}
                            onChangeText={setAddress}
                            onSubmitEditing={handleSearchLocation}
                        />
                    </View>
                </View>

                {/* MAPA */}
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={null}               // Desativa Google de verdade
                    mapType="none"
                    tileOverlayEnabled={true}
                    liteMode={false}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <UrlTile
                        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                        shouldReplaceMapContent={true}
                    />

                    {/* Você está aqui */}
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Você está aqui!"
                        pinColor="blue"
                    />

                    {/* Pontos fixos */}
                    {points.map((point) => (
                        <Marker
                            key={point.id}
                            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                            title={point.title}
                            description={point.description}
                            onPress={() => {
                                setSelectedPoint(point);
                                setModalVisible(true);
                            }}
                        />
                    ))}

                    {/* Resultado da busca */}
                    {searchedLocation && !selectedPoint && (
                        <Marker
                            coordinate={searchedLocation}
                            title="Local encontrado"
                            pinColor="indigo"
                        />
                    )}
                </MapView>
            </View>
        </View>
    );
}

export default UbsProximas;
