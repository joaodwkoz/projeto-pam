import React, {
    useState,
    useEffect,
    useContext,
    useMemo,
    useRef,
    useCallback,
} from 'react';
import {
    View,
    Pressable,
    Text,
    PixelRatio,
    useWindowDimensions,
    ActivityIndicator,
    ScrollView,
    Modal
} from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import { BlurView } from 'expo-blur';
import axios from 'axios';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { dynamicStyles } from './styles';
import {
    BottomSheetModalProvider,
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';

const translateFruitName = (name) => {
    const map = {
        Apple: 'Maçã',
        Apricot: 'Damasco',
        Avocado: 'Abacate',
        Banana: 'Banana',
        Blackberry: 'Amora-preta',
        Blueberry: 'Mirtilo',
        Cherry: 'Cereja',
        Coconut: 'Coco',
        Cranberry: 'Oxicoco',
        Date: 'Tâmara',
        Dragonfruit: 'Pitaya',
        Fig: 'Figo',
        Grape: 'Uva',
        Grapefruit: 'Toranja',
        Guava: 'Goiaba',
        Kiwi: 'Kiwi',
        Lemon: 'Limão-siciliano',
        Lime: 'Limão-taiti',
        Lychee: 'Lichia',        
        Mango: 'Manga',
        Melon: 'Melão',
        Nectarine: 'Nectarina',
        Orange: 'Laranja',
        Papaya: 'Mamão',
        Passionfruit: 'Maracujá',
        Peach: 'Pêssego',
        Pear: 'Pera',
        Persimmon: 'Caqui',
        Pineapple: 'Abacaxi',
        Plum: 'Ameixa',
        Pomegranate: 'Romã',
        Raspberry: 'Framboesa',
        Strawberry: 'Morango',
        Tangerine: 'Tangerina',
        Watermelon: 'Melancia',
        Pomelo: 'Pomelo',
        Tomato: 'Tomate',
        Durian: 'Durian',
        Lingonberry: 'Mirtilo-vermelho',
        Gooseberry: 'Groselha-espinhosa',
        GreenApple: 'Maçã verde',
        'Green Apple': 'Maçã verde',
        Pitahaya: 'Pitaya',
        Morus: 'Amoreira (morus)',
        Feijoa: 'Goiaba-serrana',
        Oxicoco: 'Oxicoco',
        Jackfruit: 'Jaca',
        'Horned Melon': 'Kiwano (melão-de-chifre)',
        Hazelnut: 'Avelã',
        Hazeinut: 'Avelã',
        Mangosteen: 'Mangostão',
        Pumpkin: 'Abóbora',
        'Japanese Persimmon': 'Caqui japonês',
        Annona: 'Fruta-do-conde (annona)',
        'Ceylon Gooseberry': 'Groselha-do-ceilão',
    };

    return map[name] || name;
};

const getFruitOfTheDay = (fruits) => {
    if (!fruits || fruits.length === 0) return null;

    const today = new Date();
    const seed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    const index = seed % fruits.length;
    return fruits[index];
};

const Frutas = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);
    const scale = PixelRatio.get();
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const [fruits, setFruits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fruitOfDay, setFruitOfDay] = useState(null);
    const [selectedFruit, setSelectedFruit] = useState(null);

    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const bottomSheetRef = useRef(null);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const snapPoints = useMemo(() => ['35%'], []);

    const clearModal = () => {
        setSelectedFruit(null);
    };

    const handleSheetChanges = useCallback((index) => {
        setSheetIndex(index);
        if (index === -1) {
            clearModal();
        }
    }, []);

    const handleOpenModal = (fruit) => {
        setSelectedFruit(fruit);
        bottomSheetRef.current?.present();
    };

    const handleCloseModal = () => {
        bottomSheetRef.current?.dismiss();
        clearModal();
    };

    useEffect(() => {
        const fetchFruits = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get('https://www.fruityvice.com/api/fruit/all');
                const data = response.data;

                const normalized = data.map((item) => ({
                    ...item,
                    localizedName: translateFruitName(item.name),
                }));

                setFruits(normalized);
                setFruitOfDay(getFruitOfTheDay(normalized));
            } catch (err) {
                console.log('Erro ao carregar frutas:', err);
                setFruits([]);
                setFruitOfDay(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFruits();
    }, []);

    const FruitItem = ({ fruta }) => {
        const nutritions = fruta.nutritions || {};
        return (
            <View style={styles.fruitItem}>
                <View style={styles.fruitItemInfo}>
                    <View style={styles.fruitItemHeader}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 0.0222 * width,
                            }}
                        >
                            <View style={styles.fruitItemIndicator}>
                                <MaterialCommunityIcons
                                    name="fruit-watermelon"
                                    size={12}
                                    color="white"
                                />
                            </View>

                            <Text
                                style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 9 * scale,
                                }}
                            >
                                {fruta.localizedName}
                            </Text>
                        </View>

                        <Pressable
                            style={styles.fruitItemAction}
                            onPress={() => handleOpenModal(fruta)}
                        >
                            <Entypo name="chevron-right" size={20} color="#f0f0f0" />
                        </Pressable>
                    </View>

                    <View style={styles.fruitItemDetails}>
                        <View style={styles.fruitItemMetric}>
                            <Octicons name="flame" size={18} color="#6C83A1" />
                            <Text
                                style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 4.5 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.5 * scale,
                                }}
                            >
                                {nutritions.calories ?? '--'} calorias
                            </Text>
                        </View>

                        <View style={styles.fruitItemMetric}>
                            <FontAwesome6 name="wheat-awn" size={18} color="#6C83A1" />
                            <Text
                                style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 4.5 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.5 * scale,
                                }}
                            >
                                {nutritions.carbohydrates ?? '--'} g carboidratos
                            </Text>
                        </View>

                        <View style={styles.fruitItemMetric}>
                            <FontAwesome6 name="dumbbell" size={18} color="#6C83A1" />
                            <Text
                                style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 4.5 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 7.5 * scale,
                                }}
                            >
                                {nutritions.protein ?? '--'} g de proteínas
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F5F7FB',
                }}
            >
                <ActivityIndicator size="large" color="#6C83A1" />
            </View>
        );
    }

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable
                        style={styles.headerBtn}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <FontAwesome5
                            name="backward"
                            size={0.0444 * width}
                            color="#97B9E5"
                        />
                    </Pressable>

                    <Pressable style={styles.headerBtn} onPress={() => setMostrarModalAjuda(true)}>
                        <Ionicons
                            name="help-circle"
                            size={0.05 * width}
                            color="#97B9E5"
                        />
                    </Pressable>
                </View>

                <Text
                    style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 10.75 * scale,
                        color: '#6C83A1',
                        lineHeight: 11.075 * scale,
                    }}
                >
                    Frutas
                </Text>

                <View style={styles.fruitOfTheDay}>
                    <Text
                        style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 9.5 * scale,
                            color: '#6C83A1',
                            lineHeight: 12.5 * scale,
                        }}
                    >
                        Fruta do dia:
                    </Text>

                    <View style={styles.fruitContainer}>
                        <Text
                            style={{
                                fontFamily: 'Poppins-SB',
                                fontSize: 9.5 * scale,
                                color: '#6C83A1',
                                lineHeight: 12.5 * scale,
                            }}
                        >
                            {fruitOfDay ? fruitOfDay.localizedName : 'Carregando...'}
                        </Text>

                        {fruitOfDay && (
                            <View style={styles.fruitMetrics}>
                                <View style={styles.fruitMetric}>
                                    <Octicons name="flame" size={18} color="white" />
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#fff',
                                            lineHeight: 8 * scale,
                                        }}
                                    >
                                        {fruitOfDay.nutritions?.calories ?? '--'} calorias
                                    </Text>
                                </View>

                                <View style={styles.fruitMetric}>
                                    <FontAwesome6
                                        name="wheat-awn"
                                        size={18}
                                        color="white"
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#fff',
                                            lineHeight: 8 * scale,
                                        }}
                                    >
                                        {fruitOfDay.nutritions?.carbohydrates ?? '--'} g
                                        carboidratos
                                    </Text>
                                </View>

                                <View style={styles.fruitMetric}>
                                    <FontAwesome6
                                        name="dumbbell"
                                        size={18}
                                        color="white"
                                    />
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 5 * scale,
                                            color: '#fff',
                                            lineHeight: 8 * scale,
                                        }}
                                    >
                                        {fruitOfDay.nutritions?.protein ?? '--'} g de
                                        proteínas
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <Text
                    style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 9.5 * scale,
                        color: '#6C83A1',
                        lineHeight: 12.5 * scale,
                    }}
                >
                    Lista:
                </Text>

                <View
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                >
                    {isLoading && (
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <ActivityIndicator size="large" color="#6C83A1" />
                        </View>
                    )}

                    {!isLoading && (
                        <ScrollView
                            style={{ width: '100%', height: '100%' }}
                            contentContainerStyle={{
                                paddingBottom: 0.05 * height,
                                gap: 0.0222 * height,
                            }}
                        >
                            {fruits.map((fruit) => (
                                <FruitItem key={fruit.id} fruta={fruit} />
                            ))}
                        </ScrollView>
                    )}
                </View>
            </View>

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: '#fff' }}
                style={{
                    padding: 0.0444 * width,
                    zIndex: 1000,
                    position: 'relative',
                }}
                handleIndicatorStyle={{
                    backgroundColor: '#6C83A1',
                }}
                onChange={handleSheetChanges}
            >
                <BottomSheetView
                    style={{ flex: 1 }}
                    contentContainerStyle={{
                        alignItems: 'center',
                        gap: 0.0444 * width,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#6C83A1',
                            lineHeight: 11 * scale,
                        }}
                    >
                        Detalhes da fruta
                    </Text>

                    {selectedFruit && (
                        <View style={styles.fruitDetails}>
                            <Text
                                style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 8.5 * scale,
                                    color: '#6C83A1',
                                    lineHeight: 11.5 * scale,
                                }}
                            >
                                {selectedFruit.localizedName}
                            </Text>

                            <View style={styles.fruitNutrition}>
                                <View style={styles.fruitNutritionItem}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6.5 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 9.5 * scale,
                                        }}
                                    >
                                        Calorias
                                    </Text>

                                    <View style={styles.fruitNutritionView}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 5.75 * scale,
                                                color: '#6C83A1',
                                                lineHeight: 8.75 * scale,
                                            }}
                                        >
                                            {selectedFruit.nutritions?.calories ?? '--'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.fruitNutritionItem}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6.5 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 9.5 * scale,
                                        }}
                                    >
                                        Carboidratos
                                    </Text>

                                    <View style={styles.fruitNutritionView}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 5.75 * scale,
                                                color: '#6C83A1',
                                                lineHeight: 8.75 * scale,
                                            }}
                                        >
                                            {selectedFruit.nutritions?.carbohydrates ??
                                                '--'}{' '}
                                            g
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.fruitNutritionItem}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6.5 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 9.5 * scale,
                                        }}
                                    >
                                        Proteínas
                                    </Text>

                                    <View style={styles.fruitNutritionView}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 5.75 * scale,
                                                color: '#6C83A1',
                                                lineHeight: 8.75 * scale,
                                            }}
                                        >
                                            {selectedFruit.nutritions?.protein ?? '--'} g
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.fruitNutritionItem}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6.5 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 9.5 * scale,
                                        }}
                                    >
                                        Gorduras
                                    </Text>

                                    <View style={styles.fruitNutritionView}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 5.75 * scale,
                                                color: '#6C83A1',
                                                lineHeight: 8.75 * scale,
                                            }}
                                        >
                                            {selectedFruit.nutritions?.fat ?? '--'} g
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.fruitNutritionItem}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6.5 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 9.5 * scale,
                                        }}
                                    >
                                        Açúcares
                                    </Text>

                                    <View style={styles.fruitNutritionView}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 5.75 * scale,
                                                color: '#6C83A1',
                                                lineHeight: 8.75 * scale,
                                            }}
                                        >
                                            {selectedFruit.nutritions?.sugar ?? '--'} g
                                        </Text>
                                    </View>
                                </View>
                            </View> 
                        </View>
                    )}
                </BottomSheetView>
            </BottomSheetModal>

            <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setMostrarModalAjuda(false)}>
                        <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1' }}>Ajuda</Text>
                            </View>

                            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 0.015 * height }} showsVerticalScrollIndicator={false}>
                                <View style={styles.helpSection}>
                                    <Text style={{
                                        fontFamily: 'Poppins-SB',
                                        fontSize: 9 * scale,
                                        color: '#6C83A1',
                                    }}>Frutas</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="information-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{
                                            fontFamily: 'Poppins-SB',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                        }}>Função:</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Mostrar informações nutricionais de frutas (via API).</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="list-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{
                                            fontFamily: 'Poppins-SB',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                        }}>Campos:</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Nome, calorias, nutrientes, benefícios.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="play-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{
                                            fontFamily: 'Poppins-SB',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                        }}>Como usar:</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Pesquise ou escolha uma fruta.</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>O app busca dados e mostra tudo na tela.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="checkmark-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{
                                            fontFamily: 'Poppins-SB',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                        }}>Resultado esperado:</Text>
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Informações completas da fruta + dicas de consumo.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </BottomSheetModalProvider>
    );
};

export default Frutas;