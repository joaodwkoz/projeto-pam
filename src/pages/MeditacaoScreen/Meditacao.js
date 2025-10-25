import { View, Pressable, Image, Text, PixelRatio, useWindowDimensions, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { useState, useEffect, useContext, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../../contexts/AuthContext';
import api from '../../../services/api';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { dynamicStyles } from './styles';


const Meditacao = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const { usuario } = useContext(AuthContext);

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
                lineHeight: 17 * scale
            }}>Meditação</Text>

            <View style={styles.history}>
                <Text style={{
                    fontFamily: 'Poppins-M',
                    fontSize: 8 * scale,
                    color: '#6C83A1',
                    lineHeight: 10 * scale
                }}>
                    Histórico
                </Text>

                <View style={styles.historyCard}>
                    <View style={styles.historyCardInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#6C83A1',
                            lineHeight: 10 * scale
                        }}>
                            Últimas sessões
                        </Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#6C83A1',
                            lineHeight: 9 * scale
                        }}>
                            Desfrute de sensações passadas com as últimas sessões
                        </Text>
                    </View>

                    <View style={styles.historyCardBtn}>
                        <Ionicons name="play" size={width * 0.075} color="#fff" />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Meditacao;