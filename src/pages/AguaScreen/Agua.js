import { View, Pressable, Image, Text, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { FontAwesome5, Ionicons,Entypo, Octicons } from '@expo/vector-icons';
import { dynamicStyles } from './styles';
import { useAuth } from '../../hooks/useAuth';

import AguaModalHistorico from '../../components/AguaModalHistorico';
import { useTheme } from '../../hooks/useTheme';
import ProgressoAgua from '../../components/ProgressoAgua';
import { BASE_URL_STORAGE } from '../../constants/api';

import Copos from '../../components/Copos';

import { formatDateToYYYYMMDD } from '../../utils/date';

const Agua = () => {
    const { usuario } = useAuth();
    const navigation = useNavigation();

    const theme = useTheme();
    const { colors, spacing, width, height, scale } = theme;
    
    const styles = useMemo(() => dynamicStyles(width, height, colors, spacing, scale), [width, height, colors, spacing, scale]);

    const [totalMl, setTotalMl] = useState(0);
    const META_ML = 4000;

    const today = new Date();
    const formattedDate = formatDateToYYYYMMDD(today);

    const fetchConsumedCups = useCallback(async () => {
      try {
        const res = await api.get(`/usuario/${usuario.id}/consumos-por-data?data=${formattedDate}`);
        setTotalMl(res.data.total_volume_ml); 
      } catch (e) {
        console.error("Erro ao buscar consumos do usuário:", e);
      } finally {
        setIsLoadingConsumos(false);
      }
    }, [usuario.id, formattedDate]);

    const [isLoadingConsumos, setIsLoadingConsumos] = useState(true);

    useEffect(() => {
        fetchConsumedCups();
    }, [fetchConsumedCups]);

    const [historicoModalVisible, setHistoricoModalVisible] = useState(false);

    if (isLoadingConsumos) {
        return <ActivityIndicator color='#6C83A1' size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

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
            }}>Consumo de água</Text>

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
                    }}>{totalMl}ml</Text>
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
                    }}>4000ml</Text>
                </View>
            </View>

            <ProgressoAgua width={width} height={height} theme={theme} total={totalMl} meta={META_ML} />

            <Copos setTotal={setTotalMl} onOpenHistory={() => setHistoricoModalVisible(true)}></Copos>

            <AguaModalHistorico visible={historicoModalVisible} setVisible={setHistoricoModalVisible}></AguaModalHistorico>
        </View>
    )
}

export default Agua;