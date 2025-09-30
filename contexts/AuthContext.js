import {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedUsuario = await AsyncStorage.getItem('usuario');

                const storedToken = await AsyncStorage.getItem('token');

                if(storedUsuario && storedToken){
                    setUsuario(JSON.parse(storedUsuario));
                    setToken(storedToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                }
            } catch (error) {
                console.error('Falha em pegar os dados do usuário do armazenamento!', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadStorageData();
    }, []);

    const signIn = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });

            const { token, usuario } = res.data;

            setToken(token);
            setUsuario(usuario);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            await AsyncStorage.setItem('token', token);
        } catch(e) {
            console.error('Erro ao fazer login', e);
            throw new Error('Credenciais inválidas. Por favor, tente novamente.');
        }
    }

    const signUp = async (name, email, password, cep, numero, complemento, logradouro, bairro, cidade, estado) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, cep, numero, complemento, logradouro, bairro, cidade, estado });

            const { token, usuario } = res.data;

            setToken(token);
            setUsuario(usuario);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            await AsyncStorage.setItem('token', token);
        } catch(e) {
            console.error('Erro ao fazer cadastro', e);
            throw new Error('Erro ao cadastrar. Por favor, tente novamente.');
        }
    }

    const updateUser = async (dadosUsuario) => {
        setUsuario(dadosUsuario);

        try {
            await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));
        } catch(e) {
            console.error("Falha ao atualizar o usuário no AsyncStorage", e);
        }
    }

    const signOut = async () => {
        try {
            await api.post('/auth/logout');
        } catch(e) {
            console.error('Erro ao fazer logout', e);
        } finally {
            setUsuario(null);
            setToken(null);

            await AsyncStorage.removeItem('usuario');
            await AsyncStorage.removeItem('token');

            delete api.defaults.headers.common['Authorization'];
        }
    }

    return (
        <AuthContext.Provider value={{ signed: !!usuario, usuario, token, isLoading, signIn, signUp, updateUser, signOut }}> 
            {children}
        </AuthContext.Provider>
    )
}