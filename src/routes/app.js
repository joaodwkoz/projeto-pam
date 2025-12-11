import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../pages/HomeScreen/Home';
import Calorias from '../pages/CaloriasScreen/Calorias';
import Profile from '../pages/ProfileScreen/Profile';
import Agua from '../pages/AguaScreen/Agua';
import Imc from '../pages/ImcScreen/Imc';
import Alergias from '../pages/AlergiasScreen/Alergias';
import Glicemia from '../pages/GlicemiaScreen/Glicemia';
import Batimentos from '../pages/BatimentosScreen/Batimentos';
import Motivacao from '../pages/MotivacaoScreen/Motivacao';
import Frutas from '../pages/FrutasScreen/Frutas';
import Emergencia from '../pages/EmergenciaScreen/Emergencia';
import Pressao from '../pages/PressaoScreen/Pressao';
import Vacinas from '../pages/VacinasScreen/Vacinas';
import Remedios from '../pages/RemediosScreen/Remedios';
import UbsProximas from '../pages/UbsProximasScreen/UbsProximas';

const Stack = createNativeStackNavigator();

export default function AppRoutes() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Calorias" component={Calorias} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Agua" component={Agua} />
            <Stack.Screen name="Imc" component={Imc} />
            <Stack.Screen name="Alergias" component={Alergias} />
            <Stack.Screen name="Glicemia" component={Glicemia} />
            <Stack.Screen name="Batimentos" component={Batimentos} />
            <Stack.Screen name="Motivacao" component={Motivacao} />
            <Stack.Screen name="Frutas" component={Frutas} />
            <Stack.Screen name="Emergencia" component={Emergencia} />
            <Stack.Screen name="Pressao" component={Pressao} />
            <Stack.Screen name="Vacinas" component={Vacinas} />
            <Stack.Screen name="Remedios" component={Remedios} />
            <Stack.Screen name="UbsProximas" component={UbsProximas} />
        </Stack.Navigator>
    )
}