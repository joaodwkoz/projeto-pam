import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, Modal, ScrollView, Pressable, TextInput, PixelRatio, useWindowDimensions, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import WheelPicker from '@quidone/react-native-wheel-picker';

import { dynamicStyles } from '../pages/GlicemiaScreen/styles';


import { scheduleNotification } from '../services/notificationService';

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


    // FUNÇÃO DE SALVAR + AGENDAR NOTIFICAÇÃO
    const handleSalvar = async () => {

        // monta a data da notificação com o horário do usuário
        const dataNotificacao = new Date(
            horario.ano,
            horario.mes - 1,
            horario.dia,
            horario.hora,
            horario.minuto
        );

        try {
            // ag
            await scheduleNotification(dataNotificacao);

         
            handleNewMedition();

            fecharModal();

        } catch (e) {
            console.log("Erro ao agendar notificação:", e);
        }
    };


    if (!visible) return null;

    return (
        <Modal visible={visible} transparent onRequestClose={fecharModal}>
            <BlurView tint='dark' intensity={8} experimentalBlurMethod='dimezisBlurView' style={styles.meditionModalContainer}>
                <View style={styles.meditionModalWrapper}>
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 0.0222 * width }}>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#6C83A1',
                            lineHeight: 10 * scale
                        }}>
                            Registrar nova medição
                        </Text>

                        {/* ---- INPUT VALOR ---- */}
                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>Nome</Text>

                            <TextInput
                                style={{
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
                                }}
                                scrollEnabled={false}
                                multiline={false}
                                value={valor}
                                onChangeText={setValor}
                            />
                        </View>

                        {/* ---- TIPO DE MEDIÇÃO ---- */}
                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>Tipo de medição</Text>

                            <View style={styles.meditionModalChipInput}>

                                {["Em jejum", "Pré-refeição", "Pós-refeição", "Aleatória"].map(tipo => (
                                    <Pressable
                                        key={tipo}
                                        style={[
                                            styles.meditionModalChipInputOption,
                                            { backgroundColor: tipoMedicao === tipo ? '#6C83A1' : '#f0f0f0' }
                                        ]}
                                        onPress={() => setTipoMedicao(tipo)}
                                    >
                                        <Text style={{
                                            fontFamily: 'Poppins-M',
                                            fontSize: 6 * scale,
                                            color: tipoMedicao === tipo ? '#fff' : '#6C83A1',
                                            lineHeight: 8 * scale
                                        }}>
                                            {tipo}
                                        </Text>
                                    </Pressable>
                                ))}

                            </View>
                        </View>

                        {/* ---- DATA ---- */}
                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>Data</Text>

                            {pickersProntos ? (
                                <View style={styles.meditionModalDatePicker}>

                                    {/* DIA */}
                                    <WheelPicker
                                        data={dias}
                                        value={horario.dia}
                                        visibleItemCount={3}
                                        enableScrollByTapOnItem={true}
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
                                        onValueChanged={({ item: { value } }) => handleTrocaHorario("dia", value)}
                                    />

                                    <Text style={styles.meditionModalSlash}>/</Text>

                                    {/* MÊS */}
                                    <WheelPicker
                                        data={meses}
                                        value={horario.mes}
                                        visibleItemCount={3}
                                        enableScrollByTapOnItem={true}
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
                                        onValueChanged={({ item: { value } }) => handleTrocaHorario("mes", value)}
                                    />

                                    <Text style={styles.meditionModalSlash}>/</Text>

                                    {/* ANO */}
                                    <WheelPicker
                                        data={anos}
                                        value={horario.ano}
                                        visibleItemCount={3}
                                        enableScrollByTapOnItem={true}
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
                                        onValueChanged={({ item: { value } }) => handleTrocaHorario("ano", value)}
                                    />
                                </View>
                            ) : (
                                <View style={{ height: 0.075 * height, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#6C83A1" />
                                </View>
                            )}

                        </View>

                        {/* ---- HORA ---- */}
                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>Hora</Text>

                            {pickersProntos ? (
                                <View style={styles.meditionModalTimePicker}>
                                    
                                    {/* HORA */}
                                    <WheelPicker
                                        data={horas}
                                        value={horario.hora}
                                        visibleItemCount={3}
                                        enableScrollByTapOnItem={true}
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
                                        onValueChanged={({ item: { value } }) => handleTrocaHorario("hora", value)}
                                    />

                                    <Text style={styles.meditionModalSlash}>:</Text>

                                    {/* MINUTO */}
                                    <WheelPicker
                                        data={minutos}
                                        value={horario.minuto}
                                        visibleItemCount={3}
                                        enableScrollByTapOnItem={true}
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
                                        onValueChanged={({ item: { value } }) => handleTrocaHorario("minuto", value)}
                                    />

                                </View>
                            ) : (
                                <View style={{ height: 0.075 * height, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color="#6C83A1" />
                                </View>
                            )}
                        </View>

                        {/* ---- OBSERVAÇÕES ---- */}
                        <View style={styles.meditionModalInput}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>Observações</Text>

                            <TextInput
                                style={{
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
                                }}
                                scrollEnabled={false}
                                multiline={true}
                                value={observacoes}
                                onChangeText={setObservacoes}
                            />
                        </View>

                    </ScrollView>

                    {/* ---- BOTÕES ---- */}
                    <View style={styles.meditionModalActions}>
                        <Pressable style={styles.meditionModalBtn} onPress={fecharModal}>
                            <Text style={{
                                fontFamily: 'Poppins-M',
                                fontSize: 7 * scale,
                                color: '#6C83A1',
                                lineHeight: 7.7 * scale
                            }}>Cancelar</Text>
                        </Pressable>

                        {/*  BOTÃO SALVAR QUE GERA NOTIFICAÇÃO */}
                        <Pressable
                            style={[styles.meditionModalBtn, { backgroundColor: '#6C83A1' }]}
                            onPress={handleSalvar}
                        >
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
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.visible === nextProps.visible &&
        prevProps.valor === nextProps.valor &&
        prevProps.tipoMedicao === nextProps.tipoMedicao &&
        prevProps.observacoes === nextProps.observacoes &&
        prevProps.horario.dia === nextProps.horario.dia &&
        prevProps.horario.mes === nextProps.horario.mes &&
        prevProps.horario.ano === nextProps.horario.ano &&
        prevProps.horario.hora === nextProps.hora.hora &&
        prevProps.horario.minuto === nextProps.horario.minuto
    );
});

export default GlicemiaModal;
