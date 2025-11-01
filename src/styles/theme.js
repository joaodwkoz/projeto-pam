import { Ionicons, Octicons, MaterialIcons } from '@expo/vector-icons';

export const colors = {
    primary: '#6C83A1',
    secondary: '#607DA3',
    bg: '#F0F4F7',
    text: {
        app: '#6C83A1',
        secondary: '#799BC8',
    },
    white: '#fff',
    lightblue: '#b9cadf',
    surface: '#fafafa'
};

export const fonts = {
    medium: 'Poppins-M',
    semiBold: 'Poppins-SB',
};

export const alerts = {
    success: {
        bg: '#f2fcf2',
        text: '#96d689', 
        close: '#476947',
        icon: {
            lib: Octicons,
            name: "check-circle",
            color: '#96d689',
        }
    },
    warning: {
        bg: '#fff9de',
        text: '#f5e19d',
        close: '#9b831c',
        icon: {
            lib: Ionicons,
            name: "warning",
            color: '#f5e19d',
        }
    },
    info: {
        bg: '#eaf0ff',
        text: '#9db5f5',
        close: '#344655',
        icon: {
            lib: MaterialIcons,
            name: "info",
            color: '#9db5f5',
        }
    },
    error: {
        bg: '#ffeaea',
        text: '#f59d9d',
        close: '#9b1c1c',
        icon: {
            lib: MaterialIcons,
            name: "error",
            color: '#f59d9d',
        }
    }
};