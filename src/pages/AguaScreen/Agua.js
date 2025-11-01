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
      const loadData = async () => {
        await Promise.all([
          fetchConsumedCups()
        ]);
      };
      loadData();
    }, [fetchConsumedCups]);

    const ICONS = [
      {
        nome: 'Xicara',
        caminho: `${BASE_URL_STORAGE}assets/xicara.png`
      },
      {
        nome: 'Copo',
        caminho: `${BASE_URL_STORAGE}assets/copo.png`
      },
      {
        nome: 'Garrafa',
        caminho: `${BASE_URL_STORAGE}assets/garrafa.png`
      },
      {
        nome: 'Garrafa esportiva',
        caminho: `${BASE_URL_STORAGE}assets/garrafaesportiva.png`
      },
      {
        nome: 'Garrafão',
        caminho: `${BASE_URL_STORAGE}assets/garrafao.png`
      },
      {
        nome: 'Jarra',
        caminho: `${BASE_URL_STORAGE}assets/jarra.png`
      },
      {
        nome: 'Galão',
        caminho: `${BASE_URL_STORAGE}assets/galao.png`
      },
    ]

    const [mostrarOpcoes, setMostrarOpcoes] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState('Create');
    const [nome, setNome] = useState("");
    const [capacidade, setCapacidade] = useState("");
    const [iconeEscolhido, setIconeEscolhido] = useState(-1);
    const [copo, setCopo] = useState(-1);

    const clearModal = () => {
      setModalVisible(false);
      setModalState('Create');
      setNome("");
      setCapacidade("");
      setIconeEscolhido(-1);
      setCopo(-1);
    }

    const handleSaveCup = async () => {
      const dados = {
        'nome': nome,
        'capacidade_ml': Number(capacidade),
        'icone_id': iconeEscolhido + 1,
        'usuario_id': usuario.id
      }

      try {
        const res = await api.post('/copo', dados);
        setCopos(prevCopos => [...prevCopos, res.data]);
      } catch(e) {
        console.error('Ocorreu um erro ao salvar o copo', e);
      } finally {
        clearModal();
      }
    }

    const handleOpenUpdateModal = (nome, capacidade, iconeId) => {
      setModalState('Update');
      setNome(nome);
      setCapacidade(String(capacidade));
      setIconeEscolhido(iconeId - 1);
      setModalVisible(true)
    }

    const handleUpdateCup = async () => {
      const dados = {
        'nome': nome,
        'capacidade_ml': Number(capacidade),
        'icone_id': iconeEscolhido + 1,
        'usuario_id': usuario.id
      }

      try {
        const res = await api.put(`/copos/${copo}`, dados);
        const copoAtualizado = res.data;
        setCopos(prevCopos =>
          prevCopos.map(c => 
            c.id === copoAtualizado.id
              ? copoAtualizado
              : c
          )
        );
      } catch(e) {
        console.error('Ocorreu um erro ao atualizar o copo', e);
      } finally {
        clearModal();
      }
    }

    const handleDeleteCup = async () => {
      try {
        await api.delete(`/copos/${copo}`);
        setCopos(prevCopos =>
          prevCopos.filter(c => c.id !== copo)
        );
      } catch(e) {
        console.error('Ocorreu um erro ao remover o copo', e);
      } finally {
        clearModal();
      }
    }

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

            <View style={styles.cupBtns}>
                <Pressable style={styles.cupBtn} onPress={() => setHistoricoModalVisible(true)}>
                <Octicons name="graph" size={24} color="#fff" />
                </Pressable>

                <Pressable style={styles.cupBtn} onPress={()=> setModalVisible(true)}>
                <Entypo name="plus" size={24} color="#fff" />
                </Pressable>
            </View>

            <Copos setTotal={setTotalMl}></Copos>

            

            <AguaModalHistorico visible={historicoModalVisible} setVisible={setHistoricoModalVisible} width={width} height={height} scale={scale}></AguaModalHistorico>
        </View>
    )
}

export default Agua;