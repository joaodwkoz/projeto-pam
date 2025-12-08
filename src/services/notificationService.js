import * as Notifications from 'expo-notifications';

const agendarPordataHora = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Notificação após 1 minuto",
            body: "Passou 1 minuto",
            sound: true
        },
        trigger: {seconds: 3}
    });
    console.log("Notificação agendada para daqui 3 segundos");
};

useEffect(() => {
    const pedirPermissao = async () => {
        const {status} = await
        Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Voce negou a permissão de notificações.');
            
        }
    };
    pedirPermissão();
},  []);