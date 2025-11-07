import { View, StyleSheet } from 'react-native';
import { useMemo, useEffect } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useDerivedValue
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { ReText } from 'react-native-redash';

const ProgressoAgua = ({ width, height, theme, total, meta }) => {
    const { colors, fonts, scale } = theme;

    const styles = useMemo(() => dynamicStyles(width, colors, fonts, scale), [width, colors, fonts, scale]);

    const SVG_SIZE = width * 0.75;
    const STROKE_WIDTH = 0.0325 * height;
    const R = SVG_SIZE / 2.5;
    const CIRCLE_LENGTH = 2 * Math.PI * R;

    const progress = useSharedValue(0);
    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const animatedProps = useAnimatedProps(() => {
        const dashOffset = CIRCLE_LENGTH * (1 - progress.value);

        return {
            strokeDashoffset: Math.max(dashOffset, 0), 
        };
    });

    const progressText = useDerivedValue(() => {
        return `${Math.floor(progress.value * 100)}%`;
    });

    useEffect(() => {
        const newProgress = total / meta; 
        const clampedProgress = Math.min(newProgress, 1); 
        progress.value = withTiming(clampedProgress, { duration: 800 }); 
    }, [total, meta]);

    return (
        <View style={styles.consumption}>
            <Svg
                fill={colors.white}
                width={SVG_SIZE}
                height={SVG_SIZE}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [
                    { translateX: -SVG_SIZE / 2 },
                    { translateY: -SVG_SIZE / 2 },
                    ],
                    backgroundColor: colors.white,
                    borderRadius: SVG_SIZE / 2,
                }}
                >
                <Defs>
                    <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors.lightblue} stopOpacity="1" />
                        <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <AnimatedCircle
                    cx={SVG_SIZE / 2}
                    cy={SVG_SIZE / 2}
                    r={R}
                    stroke="url(#waterGradient)"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCLE_LENGTH}
                    strokeLinecap="round"
                    animatedProps={animatedProps}
                />
            </Svg>

            <ReText style={styles.progressText} text={progressText} />
        </View>
    )
};

const dynamicStyles = (width, colors, fonts, scale) => StyleSheet.create({
    consumption: {
        width: width * 0.75,
        height: '51%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },

    progressText: {
        fontFamily: fonts.medium,
        fontSize: 25 * scale,
        color: colors.text.primary,
        lineHeight: 30.5 * scale,
    },
});

export default ProgressoAgua;