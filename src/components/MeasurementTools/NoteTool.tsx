import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import TheText from '../TheText';
import { WhiteBackground } from '../../constants/colors';

const { width, height } = Dimensions.get('screen');

const NoteTool = ({
  scaleValue,
  getCoords,
  xCoords,
  yCoords,
  data,
  locked,
}: {
  scaleValue: number;
  getCoords: (xCoords: number[], yCoords: number[]) => void;
  xCoords: number[];
  yCoords: number[];
  data: { value: string };
  locked?: boolean;
}) => {
  const initialX = xCoords;
  const initialY = yCoords;

  const points = initialX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialY[i]),
  }));

  const panGestures = points.map((point, index) =>
    Gesture.Pan()
      .minDistance(1)
      .onStart(() => {
        point.prevX.value = point.x.value;
        point.prevY.value = point.y.value;
      })
      .onUpdate(event => {
        point.x.value = clamp(
          point.prevX.value + event.translationX / scaleValue,
          1,
          width - 20,
        );
        point.y.value = clamp(
          point.prevY.value + event.translationY / scaleValue,
          1,
          height - 90,
        );
      })
      .onEnd(() => {
        runOnJS(getCoords)(
          points.map(p => p.x.value),
          points.map(p => p.y.value),
        );
      }),
  );

  const animatedStyles = points.map(point =>
    useAnimatedStyle(() => ({
      width: 100 * (2 / scaleValue / 2),
      height: 20 * (2 / scaleValue / 2),
      transform: [{ translateX: point.x.value }, { translateY: point.y.value }],
    })),
  );

  return (
    <View style={{ position: 'absolute' }}>
      {/* <Animated.View style={[styles.box2, animatedInfo]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text={`M1: ${inches()}`}
        />
      </Animated.View> */}

      {points.map((_, i) => (
        <GestureDetector
          key={`pan-${i}`}
          gesture={panGestures[i].enabled(!locked)}
        >
          <Animated.View style={[styles.box, animatedStyles[i]]}>
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`Note`}
            />
          </Animated.View>
        </GestureDetector>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#A16207',
    borderRadius: 5,
    position: 'absolute',
    alignItems: 'center',
  },
  box2: {
    // height: 20,
    // width: 20,
    position: 'absolute',
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
  },
});

export default NoteTool;
