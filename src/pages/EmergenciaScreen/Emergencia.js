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
    Linking,
    Modal,
    Alert
} from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Foundation from '@expo/vector-icons/Foundation';
import AntDesign from '@expo/vector-icons/AntDesign';

import {
    BottomSheetModalProvider,
    BottomSheetModal,
    BottomSheetView,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import { dynamicStyles } from './styles';

const STORAGE_KEY = 'emergency_contacts';

const Emergencia = () => {
    const { width, height } = useWindowDimensions();
    const styles = dynamicStyles(width, height);
    const scale = PixelRatio.get();
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const [contacts, setContacts] = useState([]);
    const [isContactsLoading, setIsContactsLoading] = useState(true);
    const [isSavingContact, setIsSavingContact] = useState(false);
    const [isDeletingContact, setIsDeletingContact] = useState(false);

    const [callingServiceCode, setCallingServiceCode] = useState(null);
    const [contactActionLoadingId, setContactActionLoadingId] = useState(null);
    const [contactActionType, setContactActionType] = useState(null);

    const [isLocationLoading, setIsLocationLoading] = useState(true);
    const [addressLine1, setAddressLine1] = useState('Carregando endereço...');
    const [addressLine2, setAddressLine2] = useState('Aguarde um momento');
    const [locationAccuracy, setLocationAccuracy] = useState('-');
    const [userLocation, setUserLocation] = useState(null);

    const [mostrarModalAjuda, setMostrarModalAjuda] = useState(false);

    const bottomSheetRef = useRef(null);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const snapPoints = useMemo(() => ['42%'], []);
    const [modalState, setModalState] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: '',
        phone: '',
        note: '',
    });

    useEffect(() => {
        loadContacts();
        handleRefreshLocation();
    }, []);

    const loadContacts = async () => {
        try {
            setIsContactsLoading(true);
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setContacts(JSON.parse(stored));
            } else {
                setContacts([]);
            }
        } catch (e) {
            console.log('Erro ao carregar contatos: ', e);
            setContacts([]);
        } finally {
            setIsContactsLoading(false);
        }
    };

    const handleRefreshLocation = async () => {
        setIsLocationLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos da sua localização para emergências.');
                setAddressLine1('Permissão negada');
                setAddressLine2('Habilite nas configurações');
                setLocationAccuracy('-');
                return;
            }

            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            
            setUserLocation(location);
            setLocationAccuracy(`${Math.round(location.coords.accuracy)}m`);

            let addressResponse = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (addressResponse.length > 0) {
                const addr = addressResponse[0];
                const street = addr.street || 'Rua desconhecida';
                const number = addr.streetNumber || 'S/N';
                const district = addr.district || addr.subregion || '';
                const city = addr.city || '';
                const region = addr.region || '';

                setAddressLine1(`${street}, ${number}`);
                setAddressLine2(`${district} - ${city}, ${region}`.replace(/^ - /, ''));
            } else {
                setAddressLine1('Endereço não encontrado');
                setAddressLine2('Tente novamente');
            }

        } catch (error) {
            console.log('Erro ao obter localização:', error);
            setAddressLine1('Erro ao localizar');
            setAddressLine2('Verifique seu GPS');
        } finally {
            setIsLocationLoading(false);
        }
    };

    const persistContacts = async (nextContacts) => {
        setContacts(nextContacts);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextContacts));
        } catch (e) {
            console.log('Erro ao salvar contatos: ', e);
        }
    };

    const clearModal = () => {
        setModalState(null);
        setSelectedContact(null);
        setContactForm({
            name: '',
            phone: '',
            note: '',
        });
        setIsSavingContact(false);
        setIsDeletingContact(false);
    };

    const handleSheetChanges = useCallback((index) => {
        setSheetIndex(index);
        if (index === -1) {
            clearModal();
        }
    }, []);

    const openAddContact = () => {
        setModalState('add');
        setSelectedContact(null);
        setContactForm({
            name: '',
            phone: '',
            note: '',
        });
        bottomSheetRef.current?.present();
    };

    const openViewContact = (contact) => {
        setModalState('view');
        setSelectedContact(contact);
        setContactForm({
            name: contact.name,
            phone: contact.phone,
            note: contact.note || '',
        });
        bottomSheetRef.current?.present();
    };

    const openEditContact = (contact) => {
        setModalState('edit');
        setSelectedContact(contact);
        setContactForm({
            name: contact.name,
            phone: contact.phone,
            note: contact.note || '',
        });
        bottomSheetRef.current?.present();
    };

    const openDeleteContact = (contact) => {
        setModalState('delete');
        setSelectedContact(contact);
        bottomSheetRef.current?.present();
    };

    const handleCloseModal = () => {
        bottomSheetRef.current?.dismiss();
        clearModal();
    };

    const handleSaveContact = async () => {
        if (!contactForm.name.trim() || !contactForm.phone.trim()) {
            return;
        }

        try {
            setIsSavingContact(true);

            if (modalState === 'add') {
                const newContact = {
                    id: Date.now().toString(),
                    name: contactForm.name.trim(),
                    phone: contactForm.phone.trim(),
                    note: contactForm.note.trim(),
                };
                const nextContacts = [...contacts, newContact];
                await persistContacts(nextContacts);
            }

            if (modalState === 'edit' && selectedContact) {
                const nextContacts = contacts.map((c) =>
                    c.id === selectedContact.id
                        ? {
                              ...c,
                              name: contactForm.name.trim(),
                              phone: contactForm.phone.trim(),
                              note: contactForm.note.trim(),
                          }
                        : c
                );
                await persistContacts(nextContacts);
            }

            handleCloseModal();
        } catch (e) {
            console.log('Erro ao salvar contato: ', e);
        } finally {
            setIsSavingContact(false);
        }
    };

    const handleDeleteContact = async () => {
        if (!selectedContact) return;
        try {
            setIsDeletingContact(true);
            const nextContacts = contacts.filter((c) => c.id !== selectedContact.id);
            await persistContacts(nextContacts);
            handleCloseModal();
        } catch (e) {
            console.log('Erro ao remover contato: ', e);
        } finally {
            setIsDeletingContact(false);
        }
    };

    const handleCallService = async (number) => {
        try {
            setCallingServiceCode(number);
            await Linking.openURL(`tel:${number}`);
        } catch (e) {
            console.log('Erro ao ligar para serviço: ', e);
        } finally {
            setCallingServiceCode(null);
        }
    };

    const handleCallContact = async (contact) => {
        try {
            setContactActionLoadingId(contact.id);
            setContactActionType('call');
            await Linking.openURL(`tel:${contact.phone}`);
        } catch (e) {
            console.log('Erro ao ligar para contato: ', e);
        } finally {
            setContactActionLoadingId(null);
            setContactActionType(null);
        }
    };

    const handleWhatsAppContact = async (contact) => {
        try {
            setContactActionLoadingId(contact.id);
            setContactActionType('whatsapp');

            const cleanPhone = contact.phone.replace(/\D/g, '');

            let message = "Olá, estou precisando de ajuda.";
            if (userLocation) {
                const mapsLink = `https://www.google.com/maps/search/?api=1&query=${userLocation.coords.latitude},${userLocation.coords.longitude}`;
                message += ` Minha localização atual: ${addressLine1}, ${addressLine2}. Link: ${mapsLink}`;
            }

            const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
            await Linking.openURL(url);
        } catch (e) {
            console.log('Erro ao abrir WhatsApp: ', e);
        } finally {
            setContactActionLoadingId(null);
            setContactActionType(null);
        }
    };

    const handleChangeFormField = (field, value) => {
        setContactForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const renderModalTitle = () => {
        if (modalState === 'add') return 'Adicionar novo contato';
        if (modalState === 'edit') return 'Editar contato';
        if (modalState === 'view') return 'Detalhes do contato';
        if (modalState === 'delete') return 'Remover contato';
        return '';
    };

    const renderModalContent = () => {
        if (modalState === 'view' && selectedContact) {
            return (
                <View style={styles.contactForm}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 10 * scale }}>
                        {selectedContact.name}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6.5 * scale, color: '#6C83A1', lineHeight: 9.5 * scale }}>
                        Telefone: {selectedContact.phone}
                    </Text>
                    {selectedContact.note ? (
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>
                            Obs.: {selectedContact.note}
                        </Text>
                    ) : null}

                    <View style={styles.contactActions}>
                        <Pressable
                            style={[styles.contactAction, { paddingVertical: 0.01 * height }]}
                            onPress={() => handleCallContact(selectedContact)}
                            disabled={contactActionLoadingId === selectedContact.id && contactActionType === 'call'}
                        >
                            {contactActionLoadingId === selectedContact.id && contactActionType === 'call' ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Foundation name="telephone" size={24} color="white" />
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Ligar</Text>
                                </>
                            )}
                        </Pressable>

                        <Pressable
                            style={[styles.contactAction, { paddingVertical: 0.01 * height }]}
                            onPress={() => handleWhatsAppContact(selectedContact)}
                            disabled={contactActionLoadingId === selectedContact.id && contactActionType === 'whatsapp'}
                        >
                            {contactActionLoadingId === selectedContact.id && contactActionType === 'whatsapp' ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <FontAwesome5 name="whatsapp" size={24} color="white" />
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Mensagem</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            );
        }

        if (modalState === 'add' || modalState === 'edit') {
            return (
                <View style={styles.contactForm}>
                    <View style={styles.contactFormGroup}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Nome</Text>
                        <BottomSheetTextInput
                            style={styles.bottomSheetInput}
                            value={contactForm.name}
                            onChangeText={(text) => handleChangeFormField('name', text)}
                        />
                    </View>

                    <View style={styles.contactFormGroup}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Número</Text>
                        <BottomSheetTextInput
                            style={styles.bottomSheetInput}
                            keyboardType="phone-pad"
                            maxLength={15}
                            value={contactForm.phone}
                            onChangeText={(text) => handleChangeFormField('phone', text)}
                        />
                    </View>

                    <View style={styles.contactFormGroup}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Observação</Text>
                        <BottomSheetTextInput
                            style={styles.bottomSheetInput}
                            value={contactForm.note}
                            onChangeText={(text) => handleChangeFormField('note', text)}
                        />
                    </View>

                    <Pressable
                        style={styles.contactFormAction}
                        onPress={handleSaveContact}
                        disabled={isSavingContact}
                    >
                        {isSavingContact ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>
                                {modalState === 'add' ? 'Adicionar' : 'Salvar alterações'}
                            </Text>
                        )}
                    </Pressable>
                </View>
            );
        }

        if (modalState === 'delete' && selectedContact) {
            return (
                <View style={styles.contactForm}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 10 * scale, textAlign: 'center' }}>
                        Tem certeza que deseja remover o contato:
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-SB', fontSize: 7.5 * scale, color: '#e11d48', lineHeight: 10.5 * scale, textAlign: 'center' }}>
                        {selectedContact.name}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 0.0222 * width }}>
                        <Pressable style={[styles.contactFormAction, { flex: 1, backgroundColor: '#6C83A1' }]} onPress={handleCloseModal} disabled={isDeletingContact}>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Cancelar</Text>
                        </Pressable>

                        <Pressable style={[styles.contactFormAction, { flex: 1, backgroundColor: '#e11d48' }]} onPress={handleDeleteContact} disabled={isDeletingContact}>
                            {isDeletingContact ? <ActivityIndicator size="small" color="#fff" /> : 
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Remover</Text>}
                        </Pressable>
                    </View>
                </View>
            );
        }

        return null;
    };

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F7FB' }}>
                <ActivityIndicator size="large" color="#6C83A1" />
            </View>
        );
    }

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                        <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                    </Pressable>

                    <Pressable style={styles.headerBtn} onPress={() => setMostrarModalAjuda(true)}>
                        <Ionicons name="help-circle" size={0.05 * width} color="#97B9E5" />
                    </Pressable>
                </View>

                <Text style={{ fontFamily: 'Poppins-M', fontSize: 10.75 * scale, color: '#6C83A1', lineHeight: 13.075 * scale }}>Emergência</Text>

                <View style={styles.location}>
                    <View style={styles.locationHeader}>
                        <Feather name="map-pin" size={24} color="#6C83A1" />
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 11 * scale }}>Localização atual</Text>
                    </View>

                    <View style={styles.locationView}>
                        <View style={styles.locationAddress}>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 10 * scale }} numberOfLines={1}>
                                {addressLine1}
                            </Text>
                            <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#6C83A1', lineHeight: 10 * scale }} numberOfLines={1}>
                                {addressLine2}
                            </Text>
                        </View>

                        <View style={styles.locationInfo}>
                            <View style={styles.locationPrecision}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>
                                    Precisão: {locationAccuracy}
                                </Text>
                            </View>
                            
                            <Pressable 
                                style={[styles.locationAction, isLocationLoading && { opacity: 0.7 }]} 
                                onPress={handleRefreshLocation}
                                disabled={isLocationLoading}
                            >
                                {isLocationLoading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Atualizar</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={styles.publicServices}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 11 * scale }}>Serviços públicos (Toque p/ ligar):</Text>
                    <View style={styles.services}>
                        <View style={styles.serviceRow}>
                            <Pressable style={styles.service} onPress={() => handleCallService('192')} disabled={callingServiceCode === '192'}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>192</Text>
                                {callingServiceCode === '192' ? <ActivityIndicator size="small" color="#6C83A1" /> : <FontAwesome5 name="ambulance" size={24} color="#6C83A1" />}
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>SAMU</Text>
                            </Pressable>

                            <Pressable style={styles.service} onPress={() => handleCallService('190')} disabled={callingServiceCode === '190'}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>190</Text>
                                {callingServiceCode === '190' ? <ActivityIndicator size="small" color="#6C83A1" /> : <MaterialIcons name="local-police" size={24} color="#6C83A1" />}
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Polícia</Text>
                            </Pressable>
                        </View>

                        <View style={styles.serviceRow}>
                            <Pressable style={styles.service} onPress={() => handleCallService('193')} disabled={callingServiceCode === '193'}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>193</Text>
                                {callingServiceCode === '193' ? <ActivityIndicator size="small" color="#6C83A1" /> : <MaterialCommunityIcons name="fire-truck" size={24} color="#6C83A1" />}
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Bombeiros</Text>
                            </Pressable>

                            <Pressable style={styles.service} onPress={() => handleCallService('188')} disabled={callingServiceCode === '188'}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>188</Text>
                                {callingServiceCode === '188' ? <ActivityIndicator size="small" color="#6C83A1" /> : <FontAwesome5 name="ribbon" size={24} color="#6C83A1" />}
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>CVV</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={styles.emmergencyContacts}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 11 * scale }}>Contatos de emergência</Text>
                    <View style={styles.contactList}>
                        {isContactsLoading ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="small" color="#6C83A1" />
                            </View>
                        ) : (
                            <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ gap: 0.0222 * width }}>
                                {contacts.length === 0 && (
                                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#6C83A1', lineHeight: 9 * scale }}>Nenhum contato cadastrado.</Text>
                                )}
                                {contacts.map((contact) => (
                                    <Pressable key={contact.id} style={styles.contact} onPress={() => openViewContact(contact)}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 6.5 * scale, color: '#6C83A1', lineHeight: 9.5 * scale }}>
                                                    {contact.name} ({contact.note ? contact.note : ''})
                                                </Text>
                                            </View>
                                            <View style={styles.contactCrud}>
                                                <Pressable onPress={() => openEditContact(contact)}>
                                                    <AntDesign name="edit" size={16} color="#6C83A1" />
                                                </Pressable>
                                                <Pressable onPress={() => openDeleteContact(contact)}>
                                                    <AntDesign name="close" size={16} color="#6C83A1" />
                                                </Pressable>
                                            </View>
                                        </View>
                                        <View style={styles.contactActions}>
                                            <Pressable
                                                style={styles.contactAction}
                                                onPress={() => handleCallContact(contact)}
                                                disabled={contactActionLoadingId === contact.id && contactActionType === 'call'}
                                            >
                                                {contactActionLoadingId === contact.id && contactActionType === 'call' ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <><Foundation name="telephone" size={24} color="white" /><Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Ligar</Text></>
                                                )}
                                            </Pressable>
                                            <Pressable
                                                style={styles.contactAction}
                                                onPress={() => handleWhatsAppContact(contact)}
                                                disabled={contactActionLoadingId === contact.id && contactActionType === 'whatsapp'}
                                            >
                                                {contactActionLoadingId === contact.id && contactActionType === 'whatsapp' ? (
                                                    <ActivityIndicator size="small" color="#fff" />
                                                ) : (
                                                    <><FontAwesome5 name="whatsapp" size={24} color="white" /><Text style={{ fontFamily: 'Poppins-M', fontSize: 6 * scale, color: '#fff', lineHeight: 9 * scale }}>Mensagem</Text></>
                                                )}
                                            </Pressable>
                                        </View>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                    <Pressable style={styles.contactListAction} onPress={openAddContact}>
                        <Text style={{ fontFamily: 'Poppins-M', fontSize: 7 * scale, color: '#fff', lineHeight: 11 * scale }}>Adicionar contato</Text>
                    </Pressable>
                </View>
            </View>

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{ backgroundColor: '#fff' }}
                style={{ padding: 0.0444 * width, zIndex: 1000, position: 'relative' }}
                handleIndicatorStyle={{ backgroundColor: '#6C83A1' }}
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1', lineHeight: 11 * scale }}>{renderModalTitle()}</Text>
                    {renderModalContent()}
                </BottomSheetView>
            </BottomSheetModal>

            <Modal visible={mostrarModalAjuda} transparent animationType='slide'>
                <BlurView intensity={8} tint="dark" experimentalBlurMethod='dimezisBlurView' style={styles.modalBackdrop}>
                    <Pressable style={styles.modalBackdrop} onPress={() => setMostrarModalAjuda(false)}>
                        <Pressable style={styles.helpModal} onPress={(e) => e.stopPropagation()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-M', fontSize: 8 * scale, color: '#6C83A1' }}>Ajuda</Text>
                            </View>

                            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ gap: 0.015 * height }} showsVerticalScrollIndicator={false}>
                                <View style={styles.helpSection}>
                                    <Text style={{
                                        fontFamily: 'Poppins-SB',
                                        fontSize: 9 * scale,
                                        color: '#6C83A1',
                                    }}>Emergência</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{ flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center' }}>
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
                                    }}>Enviar aviso rápido para contatos em situação de emergência.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{ flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center' }}>
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
                                    }}>Localização via GPS, contatos de emergência.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{ flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center' }}>
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
                                    }}>Cadastre seus contatos.</Text>
                                    <Text style={{
                                        fontFamily: 'Poppins-M',
                                        fontSize: 6 * scale,
                                        color: '#8A9CB3',
                                    }}>Em caso de emergência, toque em “Emergência”.</Text>
                                </View>

                                <View style={styles.helpSection}>
                                    <View style={{ flexDirection: 'row', gap: 0.0111 * width, alignItems: 'center' }}>
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
                                    }}>Mensagem automática com sua localização enviada aos contatos.</Text>
                                </View>
                            </ScrollView>
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>
        </BottomSheetModalProvider>
    );
};

export default Emergencia;