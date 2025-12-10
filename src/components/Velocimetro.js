import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Path, Polygon } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const Velocimetro = ({ velocidade = 15, width = 100, height = 100 }) => {
    const rotation = useSharedValue(0);
    const min = 15;
    const max = 40;

    useEffect(() => {
        rotation.value = withTiming(velocidade, { duration: 1000 });
    }, [velocidade]);

    const animatedStyle = useAnimatedStyle(() => {
        const angle = interpolate(rotation.value, [min, max], [-90, 90], "clamp");

        return {
            transform: [{ rotate: `${angle}deg` }],
        };
    });

    return (
        <View style={{ width, height, justifyContent: "center", alignItems: "center" }}>
            <Svg width={width} height={height} viewBox="0 0 100 50">
                <Defs>
                    <LinearGradient id="my-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#a8d0e6" stopOpacity="1" />
                        <Stop offset="25%" stopColor="#b0e3c7" stopOpacity="1" />
                        <Stop offset="50%" stopColor="#fff1a8" stopOpacity="1" />
                        <Stop offset="75%" stopColor="#ffd3a8" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#f4978e" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                <Path
                    d="M10,50 A40,40 0 0,1 90,50"
                    stroke="url(#my-gradient)"
                    strokeWidth="12"
                    fill="none"
                />
            </Svg>
            <Animated.View
            style={[
                {
                position: "absolute",
                width,
                height: height / 2,
                justifyContent: "flex-start",
                alignItems: "center",
                top: height / 1.625,
                },
                animatedStyle,
            ]}
            >
                <Svg width={width} height={height / 2} viewBox="0 0 100 50">
                    <Polygon
                        points="50,4 60,25 50,38 40,25"
                        fill="#6C83A1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        stroke={'#6C83A1'}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

export default Velocimetro;