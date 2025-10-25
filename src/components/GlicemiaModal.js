import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, Modal, ScrollView, Pressable, TextInput, PixelRatio, useWindowDimensions, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import WheelPicker from '@quidone/react-native-wheel-picker';

import { dynamicStyles } from '../pages/GlicemiaScreen/styles';

const GlicemiaModal = React.memo(({
    visible,
    fecharModal,
    handleNewMedition,
    horario,
    setHorario,
    tipoMedicao,
    setTipoMedicao,
    valor,
    setValor,
    observacoes,
    setObservacoes,
    dias,
    meses,
    anos,
    horas,
    minutos
}) => {
    const { width, height } = useWindowDimensions();

    const scale = PixelRatio.get();

    const styles = useMemo(() => dynamicStyles(width, height), [width, height]);

    const [pickersProntos, setPickersProntos] = useState(false);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => setPickersProntos(true), 100);
            return () => clearTimeout(timer);
        } else {
            setPickersProntos(false);
        }

    }, [visible]);

    const handleTrocaHorario = useCallback((key, newVal) => {
        setHorario(prev => ({
            ...prev,
            [key]: newVal,
        }));
    }, [setHorario]);

    if (!visible) return null;

    return (
        <Modal visible={visible} transparent onRequestClose={fecharModal}>
            <BlurView tint='dark' intensity={8} experimentalBlurMethod='dimezisBlurView' style={styles.meditionModalContainer}>
                <View style={styles.meditionModalWrapper}>
                    <ScrollView style={{
                        flex: 1,
                    }} contentContainerStyle={{
                        gap: 0.0222 * width,
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#6C83A1',
                            lineHeight: 10 * scale 
                        }}>Registrar nova medição</Text>

                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Nome</Text>

                            <TextInput style={{
                                width: '100%',
                                height: 0.0444 * height,
                                padding: 0.008 * height,
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                lineHeight: 8 * scale,
                                backgroundColor: '#fff',
                                borderColor: '#eee',
                                borderWidth: 0.002 * height,
                                borderRadius: 0.01 * height,
                                color: '#6C83A1',
                            }} scrollEnabled={false} multiline={false} value={valor} onChangeText={setValor}></TextInput>
                        </View>

                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Tipo de medição</Text>

                            <View style={styles.meditionModalChipInput}>
                                <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Em jejum' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Em jejum')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao == 'Em jejum' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Em jejum</Text>
                                </Pressable>

                                <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Pré-refeição' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Pré-refeição')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao == 'Pré-refeição' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Pré-refeição</Text>
                                </Pressable>

                                <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Pós-refeição' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Pós-refeição')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao == 'Pós-refeição' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Pós-refeição</Text>
                                </Pressable>

                                <Pressable style={[styles.meditionModalChipInputOption, {backgroundColor: tipoMedicao === 'Aleatória' ? '#6C83A1' : '#f0f0f0'}]} onPress={() => setTipoMedicao('Aleatória')}>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: tipoMedicao == 'Aleatória' ? '#fff' : '#6C83A1',
                                        lineHeight: 8 * scale 
                                    }}>Aleatória</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Data</Text>

                            {pickersProntos ? (
                                <>
                                    <View style={styles.meditionModalDatePicker}>
                                        <WheelPicker
                                            data={dias}
                                            value={horario.dia}
                                            enableScrollByTapOnItem={true}
                                            visibleItemCount={3}
                                            itemTextStyle={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 7.25 * scale,
                                                color: '#a4b7cfff',
                                            }}
                                            width={0.1875 * width}
                                            overlayItemStyle={{
                                                backgroundColor: '#b9cadfff',
                                                opacity: 0.125,
                                            }}
                                            itemHeight={0.0425 * height}
                                            onValueChanged={({item: {value}}) => {
                                                setHorario(prevHorario => ({
                                                    ...prevHorario,
                                                    dia: value, 
                                                }));
                                            }}
                                        />

                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 7.7 * scale 
                                        }}>/</Text>

                                        <WheelPicker
                                            data={meses}
                                            value={horario.mes}
                                            enableScrollByTapOnItem={true}
                                            visibleItemCount={3}
                                            itemTextStyle={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 7.25 * scale,
                                                color: '#a4b7cfff',
                                            }}
                                            width={0.1875 * width}
                                            overlayItemStyle={{
                                                backgroundColor: '#b9cadfff',
                                                opacity: 0.125,
                                            }}
                                            itemHeight={0.0425 * height}
                                            onValueChanged={({item: {value}}) => {
                                                setHorario(prevHorario => ({
                                                    ...prevHorario,
                                                    mes: value, 
                                                }));
                                            }}
                                        />

                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 7.7 * scale 
                                        }}>/</Text>

                                        <WheelPicker
                                            data={anos}
                                            value={horario.ano}
                                            enableScrollByTapOnItem={true}
                                            visibleItemCount={3}
                                            itemTextStyle={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 7.25 * scale,
                                                color: '#a4b7cfff',
                                            }}
                                            width={0.225 * width}
                                            overlayItemStyle={{
                                                backgroundColor: '#b9cadfff',
                                                opacity: 0.125,
                                            }}
                                            itemHeight={0.0425 * height}
                                            onValueChanged={({item: {value}}) => {
                                                setHorario(prevHorario => ({
                                                    ...prevHorario,
                                                    ano: value, 
                                                }));
                                            }}
                                        />
                                    </View>
                                </> 
                            ) : (
                                <View style={{ height: 0.075 * height, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#6C83A1" />
                                </View>
                            )}
                        </View>

                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Hora</Text>

                            {pickersProntos ? (
                                <>
                                    <View style={styles.meditionModalTimePicker}>
                                        <WheelPicker
                                            data={horas}
                                            value={horario.hora}
                                            enableScrollByTapOnItem={true}
                                            visibleItemCount={3}
                                            itemTextStyle={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 7.25 * scale,
                                                color: '#a4b7cfff',
                                            }}
                                            width={0.1875 * width}
                                            overlayItemStyle={{
                                                backgroundColor: '#b9cadfff',
                                                opacity: 0.125,
                                            }}
                                            itemHeight={0.0425 * height}
                                            onValueChanged={({item: {value}}) => {
                                                setHorario(prevHorario => ({
                                                    ...prevHorario,
                                                    hora: value, 
                                                }));
                                            }}
                                        />

                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 7 * scale,
                                            color: '#6C83A1',
                                            lineHeight: 7.7 * scale 
                                        }}>:</Text>

                                        <WheelPicker
                                            data={minutos}
                                            value={horario.minuto}
                                            enableScrollByTapOnItem={true}
                                            visibleItemCount={3}
                                            itemTextStyle={{
                                                fontFamily: 'Poppins-M',
                                                fontSize: 7.25 * scale,
                                                color: '#a4b7cfff',
                                            }}
                                            width={0.1875 * width}
                                            overlayItemStyle={{
                                                backgroundColor: '#b9cadfff',
                                                opacity: 0.125,
                                            }}
                                            itemHeight={0.0425 * height}
                                            onValueChanged={({item: {value}}) => {
                                                setHorario(prevHorario => ({
                                                    ...prevHorario,
                                                    minuto: value, 
                                                }));
                                            }}
                                        />
                                </View>
                                </>
                            ) : (
                                <View style={{ height: 0.075 * height, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#6C83A1" />
                                </View>
                            )}
                        </View>

                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Observações</Text>

                            <TextInput style={{
                                width: '100%',
                                height: 0.1 * height,
                                padding: 0.008 * height,
                                fontFamily: 'Poppins-M',
                                fontSize: 6 * scale,
                                lineHeight: 8 * scale,
                                backgroundColor: '#fff',
                                borderColor: '#eee',
                                borderWidth: 0.002 * height,
                                borderRadius: 0.01 * height,
                                color: '#6C83A1',
                            }} scrollEnabled={false} multiline={true} value={observacoes} onChangeText={setObservacoes}></TextInput>
                        </View>
                    </ScrollView>

                    <View style={styles.meditionModalActions}>
                        <Pressable style={styles.meditionModalBtn} onPress={fecharModal}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale 
                            }}>Cancelar</Text>
                        </Pressable>

                        <Pressable style={[styles.meditionModalBtn, { backgroundColor: '#6C83A1' }]}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#fff',
                                lineHeight: 7.7 * scale 
                            }}>Salvar</Text>
                        </Pressable>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}, (prevProps, nextProps) => {
    return (
        prevProps.visible === nextProps.visible &&
        prevProps.valor === nextProps.valor &&
        prevProps.tipoMedicao === nextProps.tipoMedicao &&
        prevProps.observacoes === nextProps.observacoes &&
        prevProps.horario.dia === nextProps.horario.dia &&
        prevProps.horario.mes === nextProps.horario.mes &&
        prevProps.horario.ano === nextProps.horario.ano &&
        prevProps.horario.hora === nextProps.horario.hora &&
        prevProps.horario.minuto === nextProps.horario.minuto
    );
});

export default GlicemiaModal;