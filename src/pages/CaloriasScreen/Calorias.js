import { View, Pressable, Image, TextInput, Text, PixelRatio, useWindowDimensions, Modal, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BlurView } from 'expo-blur';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { dynamicStyles } from './styles';

const STORAGE_KEY_SETTINGS = 'calories_settings';

const Calorias = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);
    const scale = PixelRatio.get();
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const [refeicoes, setRefeicoes] = useState({
        'cafe_manha': [],
        'almoco': [],
        'jantar': [],
        'lanche': [],
    });

    const [mealType, setMealType] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [portionCount, setPortionCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [metaCalorias, setMetaCalorias] = useState(2500);
    const [mostrarMenuOpcoes, setMostrarMenuOpcoes] = useState(false);
    const [modalConfigVisible, setModalConfigVisible] = useState(false);
    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY_SETTINGS);
                if (stored) {
                    const settings = JSON.parse(stored);
                    if (settings.meta) setMetaCalorias(settings.meta);
                }
            } catch (e) {
                console.error("Erro ao carregar configurações:", e);
            }
        };
        loadSettings();
    }, []);

    const saveSettings = async () => {
        try {
            const settingsToSave = { meta: metaCalorias };
            await AsyncStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settingsToSave));
            setModalConfigVisible(false);
            setMostrarMenuOpcoes(false);
        } catch (e) {
            console.error("Erro ao salvar configurações:", e);
            Alert.alert("Erro", "Não foi possível salvar.");
        }
    };

    const getTodayMeals = async () => {
        const today = new Date().toISOString().slice(0, 10);
        try {
            const response = await api.get(`/refeicoes/${today}`);
            const initialMeals = { 'cafe_manha': [], 'almoco': [], 'jantar': [], 'lanche': [] };
            setRefeicoes({...initialMeals, ...response.data});
        } catch (error) {
            console.error("Erro ao buscar refeições:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getTodayMeals();
        }, [])
    );

    const fetchFoods = async (query) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/alimentos/search?query=${query}`);
            setSearchResults(res.data);
        } catch (e) {
            console.error('Erro ao buscar alimentos', e);
            Alert.alert('Erro', 'Não foi possível buscar os alimentos.');
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetchFoods = useCallback(debounce(fetchFoods, 500), []);

    useEffect(() => {
        if(searchTerm.trim() !== '' && !selectedFood){
            debouncedFetchFoods(searchTerm);
        } else {
            debouncedFetchFoods.cancel();
            setSearchResults([]);
        }
        return () => {
            debouncedFetchFoods.cancel();
        };
    }, [searchTerm, selectedFood, debouncedFetchFoods]);

    const handleSearchChange = (text) => {
        setSearchTerm(text);
        if(selectedFood){
            setSelectedFood(null);
        }
    };
    
    const openSearchModal = (type) => {
        setMealType(type)
        setSearchTerm('');
        setSearchResults([]);
        setSelectedFood(null);
        setPortionCount(1);
        setModalVisible(true);
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearchTerm(food.name);
        setSearchResults([]);
    };

    const handlePortionChange = (amount) => {
        setPortionCount(prev => Math.max(0, prev + amount));
    };

    const calculateTotalCalories = () => {
        if(!selectedFood) return 0;
        return (selectedFood.calories_per_100g * portionCount).toFixed(0);
    };

    const handleSaveMeal = async () => {
        if(!selectedFood) {
            Alert.alert('Atenção', 'Por favor, selecione um alimento.');
            return;
        }
        
        const today = new Date().toISOString().slice(0, 10);
        const tipo = {
            'Café da Manhã': 'cafe_manha',
            'Almoço': 'almoco',
            'Janta': 'jantar',
            'Lanches': 'lanche'
        }

        const dataToSave = {
            nome_alimento: selectedFood.name,
            calorias: selectedFood.calories_per_100g,
            quantidade: portionCount,
            tipo_refeicao: tipo[mealType],
            data_refeicao: today,
        };

        try {
            await api.post('/refeicoes', dataToSave); 
            getTodayMeals(); 
            setModalVisible(false);
        } catch (error) {
            console.error("Erro ao salvar refeição:", error.response?.data || error.message);
            Alert.alert('Erro', 'Não foi possível salvar a refeição.');
        }
    };

    const calculateMealCalories = (mealType) => {
        if(!refeicoes[mealType]) return 0;
        return refeicoes[mealType].reduce((total, food) => total + food.total_calorias, 0);
    };

    const totalCalories = useMemo(() => {
        return Object.values(refeicoes).flat().reduce((total, food) => total + food.total_calorias, 0);
    }, [refeicoes]);

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                </Pressable>

                <Pressable style={styles.headerBtn} onPress={() => setMostrarMenuOpcoes(!mostrarMenuOpcoes)}>
                    <Ionicons name="menu" size={0.06 * width} color="#97B9E5" />
                </Pressable>
            </View>

            {mostrarMenuOpcoes && (
                <View style={styles.menuOptions}>
                    <Pressable style={styles.menuOption} onPress={() => {
                        setModalConfigVisible(true);
                        setMostrarMenuOpcoes(false);
                    }}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>Configurações</Text>
                    </Pressable>
                    <Pressable style={styles.menuOption} onPress={() => {
                        setMostrarModalAjuda(true);
                        setMostrarMenuOpcoes(false);
                    }}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>Ajuda</Text>
                    </Pressable>
                </View>
            )}

            <Text style={{
                fontFamily: 'Poppins-M',
                fontSize: 13 * scale,
                color: '#6C83A1',
                lineHeight: 14.3 * scale
            }}>Minhas calorias</Text>

            <View style={styles.widgets}>
                <View style={[styles.widget, { backgroundColor: '#fff' }]}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        color: '#607DA3'
                    }}>Total</Text>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 9 * scale,
                        color: '#607DA3'
                    }}>{totalCalories.toFixed(0)} kcal</Text>
                </View>

                <View style={[styles.widget, { backgroundColor: '#799BC8' }]}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 7 * scale,
                        color: '#fff'
                    }}>Meta</Text>

                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 9 * scale,
                        color: '#fff'
                    }}>{metaCalorias} kcal</Text>
                </View>
            </View>

            <ScrollView style={{ height: '100%' }} contentContainerStyle={{ gap: 0.0444 * width }} showsVerticalScrollIndicator={false}>
                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/cafedamanha.png')} style={{ width: 0.1 * width, aspectRatio: 1, objectFit: 'contain' }}/>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Café da Manhã</Text>
                        </View>
                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff' }}>{calculateMealCalories('cafe_manha').toFixed(0)}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#607DA3' }}>calorias</Text>
                        </View>
                    </View>
                    {refeicoes['cafe_manha'].map((food) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>
                            <View style={styles.foodItem}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3', paddingVertical: 0.002 * height }}>
                                    {food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}
                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Café da Manhã')}>
                        <View style={styles.listStyle}></View>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Adicionar alimento(s)</Text>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 10 * scale, color: '#607DA3' }}>+</Text>
                    </Pressable>
                </View>

                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/almoco.png')} style={{ width: 0.1 * width, aspectRatio: 1, objectFit: 'contain' }}/>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Almoço</Text>
                        </View>
                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff' }}>{calculateMealCalories('almoco').toFixed(0)}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#607DA3' }}>calorias</Text>
                        </View>
                    </View>
                    {refeicoes['almoco'].map((food) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>
                            <View style={styles.foodItem}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3', paddingVertical: 0.002 * height }}>
                                    {food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}
                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Almoço')}>
                        <View style={styles.listStyle}></View>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Adicionar alimento(s)</Text>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 10 * scale, color: '#607DA3' }}>+</Text>
                    </Pressable>
                </View>

                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/jantar.png')} style={{ width: 0.1 * width, aspectRatio: 1, objectFit: 'contain' }}/>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Jantar</Text>
                        </View>
                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff' }}>{calculateMealCalories('jantar').toFixed(0)}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#607DA3' }}>calorias</Text>
                        </View>
                    </View>
                    {refeicoes['jantar'].map((food) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>
                            <View style={styles.foodItem}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3', paddingVertical: 0.002 * height }}>
                                    {food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}
                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Janta')}>
                        <View style={styles.listStyle}></View>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Adicionar alimento(s)</Text>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 10 * scale, color: '#607DA3' }}>+</Text>
                    </Pressable>
                </View>

                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/lanches.png')} style={{ width: 0.1 * width, aspectRatio: 1, objectFit: 'contain' }}/>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Lanches</Text>
                        </View>
                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff' }}>{calculateMealCalories('lanche').toFixed(0)}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#607DA3' }}>calorias</Text>
                        </View>
                    </View>
                    {refeicoes['lanche'].map((food) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>
                            <View style={styles.foodItem}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3', paddingVertical: 0.002 * height }}>
                                    {food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}
                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Lanches')}>
                        <View style={styles.listStyle}></View>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#607DA3' }}>Adicionar alimento(s)</Text>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 10 * scale, color: '#607DA3' }}>+</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal visible={modalVisible} animationType='slide' transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <View style={styles.searchFood}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 10 * scale, color: '#6C83A1', lineHeight: 11 * scale }}>Pesquisar</Text>

                                <TextInput style={styles.textInput} value={searchTerm} onChangeText={handleSearchChange}></TextInput>

                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#6C83A1" />
                                ) : (
                                    !selectedFood && searchResults.length > 0 && (
                                        <ScrollView style={styles.options} keyboardShouldPersistTaps="handled">
                                            {searchResults.map((item) => (
                                                <View key={item.id} style={styles.option}>
                                                    <Pressable onPress={() => handleSelectFood(item)} style={styles.optionPressable}>
                                                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#5E779A', lineHeight: 8 * scale }}>{item.name} ({item.calories_per_100g}kcal)</Text>
                                                    </Pressable>
                                                    <View style={styles.optionsSeparator} />
                                                </View>
                                            ))}
                                        </ScrollView>
                                    )
                                )}
                            </View>

                            <View style={styles.portionCount}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 6.6 * scale }}>Quantidade de porções {selectedFood ? selectedFood.calories_per_100g : 0} kcal</Text>

                                <View style={styles.portionCounter}>
                                    <Pressable style={styles.portionCounterBtn} onPress={() => handlePortionChange(-1)}>
                                        <FontAwesome6 name="minus" size={24} color="#fff" />
                                    </Pressable>

                                    <TextInput style={styles.portionInput} value={portionCount.toString()} onChangeText={(text) => setPortionCount(Number(text))}></TextInput>

                                    <Pressable style={styles.portionCounterBtn} onPress={() => handlePortionChange(+1)}>
                                        <Entypo name="plus" size={24} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.total}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 9 * scale, color: '#6C83A1', lineHeight: 10 * scale }}>Total estimado: </Text>
                                <View style={styles.totalCal}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff', lineHeight: 8 * scale }}>{calculateTotalCalories()}</Text>
                                </View>
                            </View>

                            <View style={styles.actions}>
                                <Pressable onPress={() => setModalVisible(false)} style={[styles.btn, { backgroundColor: '#f0f0f0' }]}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Cancelar</Text>
                                </Pressable>

                                <Pressable onPress={handleSaveMeal} style={[styles.btn, { backgroundColor: '#6C83A1' }]}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#fff', lineHeight: 9 * scale }}>Salvar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <Modal visible={modalConfigVisible} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setModalConfigVisible(false)}>
                         <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>           
                            <View style={styles.modalInput}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', textAlign: 'left' }}>Meta Diária (kcal)</Text>
                                <TextInput 
                                    style={styles.textInput} 
                                    keyboardType='numeric' 
                                    value={String(metaCalorias)} 
                                    onChangeText={(val) => setMetaCalorias(Number(val))} 
                                />
                            </View>

                            <View style={styles.actions}>
                                <Pressable style={[styles.btn, { backgroundColor: '#f0f0f0' }]} onPress={() => setModalConfigVisible(false)}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1' }}>Cancelar</Text>
                                </Pressable>
                                <Pressable style={[styles.btn, { backgroundColor: '#6C83A1' }]} onPress={saveSettings}>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff' }}>Salvar</Text>
                                </Pressable>
                            </View>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>

            <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setMostrarModalAjuda(false)}>
                        <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1' }}>Ajuda</Text>
                            </View>

                            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 0.015 * height }} showsVerticalScrollIndicator={false}>
                                <View style={styles.helpSection}>
                                    <Text style={{ fontFamily: 'Poppins-SB', fontSize: 9 * scale, color: '#6C83A1' }}>Calorias</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="information-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Função:</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Monitorar a ingestão calórica diária.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="list-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Campos:</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Café da manhã, almoço, jantar, lanches.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="play-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Como usar:</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Adicione os alimentos consumidos em cada refeição.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center'}}>
                                        <Ionicons name="checkmark-circle" size={0.05 * width} color="#6C83A1" />
                                        <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7 * scale, color: '#6C83A1' }}>Resultado esperado:</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#8A9CB3' }}>Controle do total de calorias vs Meta.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </View>
    )
}

export default Calorias;