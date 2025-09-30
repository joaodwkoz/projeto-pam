import { useState, useMemo, forwardRef } from 'react';
import { View, Text, Stylesheet, Button } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';

const BottomSheetSlider = forwardRef((props, ref) => {
    const [sliderValue, setSliderValue] = useState(0);

    const renderBackdrop = (backdropProps) => (
        <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} onPress={() => ref.current?.close()}></BottomSheetBackdrop>
    )

    return (
        <BottomSheet ref={ref} index={-1} snapPoints={props.snapPoints} enablePanDownToClose={false} backdropComponent={renderBackdrop}>
            <View style={styles.container}>
                <Text style={{}}>Ajuste o valor</Text>

                <View style={styles.sliderContainer}>
                    <View style={styles.counter}>
                        <Text>{Math.round(sliderValue * 100)}</Text>
                    </View>

                    <Slider style={{}} minimumValue={0} maximumValue={1} minimumTrackTintColor='#fff' maximumTrackTintColor='#000' value={sliderValue} onValueChange={setSliderValue} thumbImage={}></Slider>
                </View>
            </View>
        </BottomSheet>
    )
});

export default BottomSheetSlider;