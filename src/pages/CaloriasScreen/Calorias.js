import { View, Pressable, Image, TextInput, Text, PixelRatio, useWindowDimensions, Modal, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFonts } from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { dynamicStyles } from './styles';
import api from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce';
import { useFocusEffect } from '@react-navigation/native';

const Calorias = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

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

    const navigation = useNavigation();

    const getTodayMeals = async () => {
        const today = new Date().toISOString().slice(0, 10);

        try {
            const response = await api.get(`/refeicoes/${today}`);
            const initialMeals = { 'cafe_manha': [], 'almoco': [], 'jantar': [], 'lanche': [] };
            setRefeicoes({...initialMeals, ...response.data});
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao buscar refeições do dia:", error);
            Alert.alert('Erro', 'Não foi possível carregar as refeições.');
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                </Pressable>

                <Pressable style={styles.headerBtn}>
                    <Ionicons name="settings-sharp" size={0.0444 * width} color="#97B9E5" />
                </Pressable>
            </View>

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
                    }}>2500 cal</Text>
                </View>
            </View>

            <ScrollView style={{
                height: '100%'
            }} contentContainerStyle={{
                gap: 0.0444 * width,
            }} showsVerticalScrollIndicator={false}>
                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/cafedamanha.png')} style={{
                                width: 0.1 * width,
                                aspectRatio: 1 / 1,
                                objectFit: 'contain',
                            }}/>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#607DA3',
                            }}>Café da Manhã</Text>
                        </View>

                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#fff'
                                }}>{calculateMealCalories('cafe_manha').toFixed(0)}</Text>
                            </View>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#607DA3'
                            }}>calorias</Text>
                        </View>
                    </View>

                    {refeicoes['cafe_manha'].map((food, index) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>

                            <View style={styles.foodItem}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#607DA3',
                                    paddingVertical: 0.002 * height,
                                }}>{food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}

                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Café da Manhã')}>
                        <View style={styles.listStyle}></View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#607DA3'
                        }}>Adicionar alimento(s)</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 10 * scale,
                            color: '#607DA3'
                        }}>+</Text>
                    </Pressable>
                </View>

                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/almoco.png')} style={{
                                width: 0.1 * width,
                                aspectRatio: 1 / 1,
                                objectFit: 'contain',
                            }}/>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#607DA3',
                            }}>Almoço</Text>
                        </View>

                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#fff'
                                }}>{calculateMealCalories('almoco').toFixed(0)}</Text>
                            </View>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#607DA3'
                            }}>calorias</Text>
                        </View>
                    </View>

                    {refeicoes['almoco'].map((food, index) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>

                            <View style={styles.foodItem}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#607DA3',
                                    paddingVertical: 0.002 * height,
                                }}>{food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}

                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Almoço')}>
                        <View style={styles.listStyle}></View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#607DA3'
                        }}>Adicionar alimento(s)</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 10 * scale,
                            color: '#607DA3'
                        }}>+</Text>
                    </Pressable>
                </View>

                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/jantar.png')} style={{
                                width: 0.1 * width,
                                aspectRatio: 1 / 1,
                                objectFit: 'contain',
                            }}/>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#607DA3',
                            }}>Jantar</Text>
                        </View>

                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#fff'
                                }}>{calculateMealCalories('jantar').toFixed(0)}</Text>
                            </View>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#607DA3'
                            }}>calorias</Text>
                        </View>
                    </View>

                    {refeicoes['jantar'].map((food, index) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>

                            <View style={styles.foodItem}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#607DA3',
                                    paddingVertical: 0.002 * height,
                                }}>{food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}

                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Janta')}>
                        <View style={styles.listStyle}></View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#607DA3'
                        }}>Adicionar alimento(s)</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 10 * scale,
                            color: '#607DA3'
                        }}>+</Text>
                    </Pressable>
                </View>

                <View style={styles.meal}>
                    <View style={styles.mealHeader}>
                        <View style={styles.mealIdentity}>
                            <Image source={require('../../../assets/imgs/lanches.png')} style={{
                                width: 0.1 * width,
                                aspectRatio: 1 / 1,
                                objectFit: 'contain',
                            }}/>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#607DA3',
                            }}>Lanches</Text>
                        </View>

                        <View style={styles.calCounter}>
                            <View style={styles.counter}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#fff'
                                }}>{calculateMealCalories('lanche').toFixed(0)}</Text>
                            </View>

                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#607DA3'
                            }}>calorias</Text>
                        </View>
                    </View>

                    {refeicoes['lanche'].map((food, index) => (
                        <View key={food.id} style={styles.listFoodItem}>
                            <View style={styles.listStyle}></View>

                            <View style={styles.foodItem}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 7 * scale,
                                    color: '#607DA3',
                                    paddingVertical: 0.002 * height,
                                }}>{food.quantidade}x {food.nome_alimento} ({food.total_calorias.toFixed(0)} kcal)
                                </Text>
                            </View>
                        </View>
                    ))}

                    <Pressable style={styles.addFoodBtn} onPress={() => openSearchModal('Lanches')}>
                        <View style={styles.listStyle}></View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#607DA3'
                        }}>Adicionar alimento(s)</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 10 * scale,
                            color: '#607DA3'
                        }}>+</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <Modal visible={modalVisible} animationType='slide' transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <View style={styles.searchFood}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 10 * scale,
                                    color: '#fff',
                                    lineHeight: 11 * scale,
                                }}>Pesquisar</Text>

                                <TextInput style={{
                                    width: '100%',
                                    height: 0.045 * height,
                                    padding: 4 * scale,
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    lineHeight: 8 * scale,
                                    backgroundColor: '#fff',
                                    borderRadius: 0.015 * width,
                                }} value={searchTerm} onChangeText={handleSearchChange}></TextInput>

                                {isLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    !selectedFood && searchResults.length > 0 && (
                                        <ScrollView style={styles.options} keyboardShouldPersistTaps="handled">
                                            {searchResults.map((item) => (
                                                <View key={item.id} style={styles.option}>
                                                    <Pressable onPress={() => handleSelectFood(item)} style={styles.optionPressable}>
                                                        <Text style={{
                                                            fontFamily: 'Poppins-M',
                                                            fontSize: 6 * scale,
                                                            color: '#5E779A',
                                                            lineHeight: 8 * scale,
                                                        }}>{item.name} ({item.calories_per_100g}kcal)</Text>
                                                    </Pressable>
                                                    <View style={styles.optionsSeparator} />
                                                </View>
                                            ))}
                                        </ScrollView>
                                    )
                                )}
                            </View>

                            <View style={styles.portionCount}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 6 * scale,
                                    color: '#fff',
                                    lineHeight: 6.6 * scale,
                                }}>Quantidade de porções {selectedFood ? selectedFood.calories_per_100g : 0} kcal</Text>

                                <View style={styles.portionCounter}>
                                    <Pressable style={styles.portionCounterBtn} onPress={() => handlePortionChange(-1)}>
                                        <FontAwesome6 name="minus" size={24} color="#fff" />
                                    </Pressable>

                                    <TextInput style={{
                                        width: '40%',
                                        height: 0.045 * height,
                                        padding: 4 * scale,
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        lineHeight: 8 * scale,
                                        backgroundColor: '#fff',
                                        color: '#5E779A',
                                        borderRadius: 0.015 * width,
                                    }} value={portionCount.toString()} onChangeText={(text) => setPortionCount(NUmber(portionCount))}></TextInput>

                                    <Pressable style={styles.portionCounterBtn} onPress={() => handlePortionChange(+1)}>
                                        <Entypo name="plus" size={24} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.total}>
                                <Text style={{
                                    fontFamily: 'Poppins-M',
                                    fontSize: 9 * scale,
                                    color: '#fff',
                                    lineHeight: 10 * scale,
                                }}>Total estimado: </Text>

                                <View style={styles.totalCal}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 7 * scale,
                                        color: '#fff',
                                        lineHeight: 8 * scale,
                                    }}>{calculateTotalCalories()}</Text>
                                </View>
                            </View>

                            <View style={styles.actions}>
                                <Pressable onPress={() => setModalVisible(false)} style={[styles.btn, {
                                    backgroundColor: '#fff',
                                }]}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 8 * scale,
                                        color: '#1C314D',
                                        lineHeight: 9 * scale,
                                    }}>Cancelar</Text>
                                </Pressable>

                                <Pressable onPress={handleSaveMeal} style={[styles.btn, {
                                    backgroundColor: '#1C314D',
                                }]}>
                                    <Text style={{
                                    fontFamily: 'Poppins-M',
                                        fontSize: 8 * scale,
                                        color: '#fff',
                                        lineHeight: 9 * scale, 
                                    }}>Salvar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    )
}

export default Calorias;