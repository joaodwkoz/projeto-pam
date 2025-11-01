import { useWindowDimensions, PixelRatio } from 'react-native';

import { colors, fonts, alerts } from '../styles/theme';

export function useTheme() {
    const { width, height } = useWindowDimensions();

    const scale = PixelRatio.get();
    
    const spacing = {
        app: 0.0889 * width,
        large: 0.0444 * width,
        medium: 0.0222 * width,
        small: 0.0111 * width
    };

    const modal = {
        bg: '#fefefe',
        padding: spacing.medium,
        gap: spacing.medium,
    };

    return {
        colors,
        fonts,
        spacing,
        modal,
        alerts,
        width,
        height,
        scale,
    }
}