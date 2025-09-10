import { View, Pressable, Image, StyleSheet, Text, PixelRatio, useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { dynamicStyles } from './styles';

const Home = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.user}>
                    <Pressable style={styles.userImg}>
                        <Image source={require('../../../assets/imgs/user-icon.png')} style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'contain',
                        }} />
                    </Pressable>

                    <View style={styles.userInfo}>
                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 8 * scale,
                            color: '#475C7C'
                        }}>Olá, João Pedro</Text>

                        <Text style={{
                            fontFamily: 'Poppins-M',
                            fontSize: 5 * scale,
                            color: '#6A84AA'
                        }}>9 de setembro de 2025</Text>
                    </View>
                </View>

                <View style={styles.notifications}>

                </View>
            </View>

            <View style={styles.apps}>
                <View style={styles.appsHeader}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1'
                    }}>Aplicações</Text>

                    <Pressable>
                        <Text style={{
                            fontFamily: 'Poppins-SB',
                            fontSize: 7 * scale,
                            color: '#546A87',
                        }}>Ver todas</Text>
                    </Pressable>
                </View>

                <View style={styles.appsContainer}>
                    <View style={styles.mainApp}>

                    </View>

                    <View style={styles.otherApps}>
                        <View style={styles.app}></View>

                        <View style={styles.app}></View>
                    </View>
                </View>
            </View>

            <View style={styles.targets}>
                <View style={styles.targetsHeader}>
                    <Text style={{
                        fontFamily: 'Poppins-M',
                        fontSize: 13 * scale,
                        color: '#6C83A1'
                    }}>Metas do dia</Text>
                </View>
            </View>
        </View>
    )
}

export default Home;