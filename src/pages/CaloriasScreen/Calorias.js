import { View, Pressable, Image, StyleSheet, Text, PixelRatio, useWindowDimensions } from 'react-native';
import { useState, useRef } from 'react-native';
import { useFonts } from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { dynamicStyles } from './styles';
import BottomSheetSlider from '../../../components/BottomSheetSlider';

const Calorias = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const bottomRef = useRef(null);
    const snapPoints = useMemo(() => ['35%'], []);
    const openPress = () => bottomRef.current?.expand();

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtn}>
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
                    }}>1920 cal</Text>
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

            <View style={styles.meal}>
                <View style={styles.mealHeader}>
                    <View style={styles.mealIdentity}>
                        <Image source={require('../../../assets/imgs/breakfast.png')} style={{
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
                            }}>530</Text>
                        </View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            color: '#607DA3'
                        }}>calorias</Text>
                    </View>
                </View>

                <Pressable style={styles.addFoodBtn}>
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
                        <Image source={require('../../../assets/imgs/lunch.png')} style={{
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
                            }}>530</Text>
                        </View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            color: '#607DA3'
                        }}>calorias</Text>
                    </View>
                </View>

                <Pressable style={styles.addFoodBtn}>
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
                        <Image source={require('../../../assets/imgs/dinner.png')} style={{
                            width: 0.1 * width,
                            aspectRatio: 1 / 1,
                            objectFit: 'contain',
                        }}/>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#607DA3',
                        }}>Janta</Text>
                    </View>

                    <View style={styles.calCounter}>
                        <View style={styles.counter}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                color: '#fff'
                            }}>530</Text>
                        </View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            color: '#607DA3'
                        }}>calorias</Text>
                    </View>
                </View>

                <Pressable style={styles.addFoodBtn}>
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
                        <Image source={require('../../../assets/imgs/snacks.png')} style={{
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
                            }}>530</Text>
                        </View>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            color: '#607DA3'
                        }}>calorias</Text>
                    </View>
                </View>

                <Pressable style={styles.addFoodBtn}>
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

            <BottomSheetSlider ref={bottomSheetRef} snapPoints={snapPoints} />
        </View>
    )
}

export default Calorias;