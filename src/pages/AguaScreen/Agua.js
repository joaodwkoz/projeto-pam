import { View, Pressable, Image, Alert, Text, PixelRatio, useWindowDimensions, TextInput } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedProps,
    useDerivedValue,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import Svg, { Circle } from 'react-native-svg';
import { useState, useContext, useEffect } from 'react';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { dynamicStyles } from './styles';

const Agua = () => {
    const { width, height } = useWindowDimensions();
    
    const styles = dynamicStyles(width, height);

    const [fontsLoaded] = useFonts({
        'Poppins-M': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SB': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });

    const scale = PixelRatio.get();

    const navigation = useNavigation();

    const SVG_SIZE = width * 0.75;
    const strokeWidth = 50;
    const R = SVG_SIZE / 2 - strokeWidth / 2;
    const CIRCLE_LENGTH = 2 * Math.PI * R;

    const progress = useSharedValue(0);

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
    }));

    useEffect(() => {
        progress.value = withTiming(1, { duration: 2000 });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable style={styles.headerBtn} onPress={() => navigation.navigate('Home')}>
                    <FontAwesome5 name="backward" size={0.0444 * width} color="#97B9E5" />
                </Pressable>

                <Pressable style={styles.headerBtn}>
                    <Ionicons name="settings-sharp" size={0.0444 * width} color="#97B9E5" />
                </Pressable>
            </View>

            <Text style={{
                fontFamily: 'Poppins-M',
                fontSize: 13 * scale,
                color: '#6C83A1',
                lineHeight: 17 * scale
            }}>Consumo de água</Text>

            <View style={styles.consumption}>
            <Svg
                fill="#fff"
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
                    backgroundColor: '#fff',
                    borderRadius: SVG_SIZE / 2,
                    elevation: 0.25,
                }}
                >
                <AnimatedCircle
                    cx={SVG_SIZE / 2}
                    cy={SVG_SIZE / 2}
                    r={R}
                    stroke="#6C83A1"
                    strokeWidth={strokeWidth / 2}
                    strokeDasharray={CIRCLE_LENGTH}
                    strokeLinecap="round"
                    animatedProps={animatedProps}
                />
                </Svg>
            </View>
        </View>
    )
}

export default Agua;

/*

const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';

const { width, height } = Dimensions.get('window');

const CIRCLE_LENGTH = 1000;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function App() {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progress.value),
  }));

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}`;
  });

  const onPress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 1, { duration: 2000 });
  }, []);

  return (
    <View style={styles.container}>
      <ReText style={styles.progressText} text={progressText} />
      <Svg style={{ position: 'absolute' }}>
        <Circle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={72}
        />
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={24}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
        />
      </Svg>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>Run</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 80,
    color: 'rgba(256,256,256,0.7)',
    width: 200,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.7,
    height: 60,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    letterSpacing: 2.0,
  },
});

*/