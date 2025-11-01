import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';

const CopoModal = () => {
    return (
        <Modal visible={modalVisible} transparent animationType='slide'>
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <View style={styles.modalInput}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#6C83A1',
                            lineHeight: 7.7 * scale,
                        }}>Nome</Text>

                        <TextInput style={{
                            width: '100%',
                            height: 0.0444 * height,
                            padding: 3 * scale,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                            backgroundColor: '#fff',
                            borderColor: '#eee',
                            borderWidth: 0.002 * height,
                            borderRadius: 0.01 * height,
                            color: '#6C83A1',
                        }} scrollEnabled={false} multiline={false} value={nome} onChangeText={(nome) => setNome(nome)} ></TextInput>
                    </View>

                    <View style={styles.modalSelect}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#6C83A1',
                            lineHeight: 7.7 * scale,
                        }}>Ícone</Text>

                        <Pressable style={styles.select} onPress={() => setMostrarOpcoes(!mostrarOpcoes)}>
                            <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            color: '#6C83A1',
                            lineHeight: 9 * scale,
                            }}>{iconeEscolhido !== -1 ? ICONS[iconeEscolhido].nome : "Selecione um ícone"}</Text>
                        </Pressable>

                        {mostrarOpcoes && <View style={styles.optionsContainer}>
                            <ScrollView style={{
                            height: '100%',
                            width: '100%',
                            }}  contentContainerStyle={{
                            alignItems: 'center',
                            gap: 0.0111 * height
                            }} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
                            {ICONS.map((i, index) => {
                                if (iconeEscolhido !== index) {
                                return (
                                    <Pressable style={[styles.option]} key={index} onPress={() => {setIconeEscolhido(index)
                                    setMostrarOpcoes(false);  
                                    }}>
                                    <View style={styles.optionIcon}>
                                        <Image source={{uri: i.caminho}} style={{
                                        height: '66%',
                                        width: '66%',
                                        objectFit: 'contain',
                                        }} />
                                    </View>

                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#6C83A1',
                                        lineHeight: 9 * scale,
                                    }}>{i.nome}</Text>
                                    </Pressable>
                                )
                                }
                            })}
                            </ScrollView>
                        </View>}
                    </View>

                    <View style={styles.modalInput} pointerEvents={mostrarOpcoes ? 'none' : 'auto'}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 7 * scale,
                            color: '#6C83A1',
                            lineHeight: 7.7 * scale,
                        }}>Capacidade</Text>

                        <TextInput style={{
                            width: '100%',
                            height: 0.0444 * height,
                            padding: 3 * scale,
                            fontFamily: 'Poppins-M',
                            fontSize: 6 * scale,
                            lineHeight: 8 * scale,
                            backgroundColor: '#fff',
                            borderColor: '#eee',
                            borderWidth: 0.002 * height,
                            borderRadius: 0.01 * height,
                            color: '#6C83A1',
                        }} scrollEnabled={false} multiline={false} value={capacidade} onChangeText={(capacidade) => setCapacidade(capacidade)}></TextInput>
                    </View>

                    <View style={styles.actions}>
                        {modalState === 'Update' && <Pressable style={[styles.actionsBtn, { backgroundColor: '#cf5555d3' }]} onPress={() => handleDeleteCup(false)}>
                            <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            lineHeight: 5.5 * scale,
                            color: '#fff',
                            }}>Remover</Text>
                        </Pressable>}

                        <Pressable style={[styles.actionsBtn, { backgroundColor: '#f0f0f0' }]} onPress={() => clearModal()}>
                            <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            lineHeight: 5.5 * scale,
                            color: '#6C83A1',
                            }}>Cancelar</Text>
                        </Pressable>

                        <Pressable style={[styles.actionsBtn, { backgroundColor: '#6C83A1' }]} onPress={() => {
                            modalState === 'Create' ? handleSaveCup() : handleUpdateCup();
                        }}>
                            <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            lineHeight: 5.5 * scale,
                            color: '#fff',
                            }}>Continuar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
};

export default CopoModal;

const dynamicStyles = (width, height) => StyleSheet.create({

});