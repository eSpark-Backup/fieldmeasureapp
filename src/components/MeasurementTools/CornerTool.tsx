import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// function clamp(val: number, min: number, max: number) {
//   return Math.min(Math.max(val, min), max);
// }

const { width, height } = Dimensions.get('screen');

const TapeTool = () => {
  const [transX, setTransX] = useState(0);
  const [transY, setTransY] = useState(0);
  const [transX2, setTransX2] = useState(0);
  const [transY2, setTransY2] = useState(0);

  const translationX = useSharedValue(width / 2);
  const translationY = useSharedValue(height / 3.5);
  const prevTranslationX = useSharedValue(width / 2);
  const prevTranslationY = useSharedValue(height / 3.5);

  const translationX2 = useSharedValue(width / 2);
  const translationY2 = useSharedValue(height / 1.5);
  const prevTranslationX2 = useSharedValue(width / 2);
  const prevTranslationY2 = useSharedValue(height / 1.5);

  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 10;
      const maxTranslateY = height - 50;

      setTransX(prevTranslationX.value + event.translationX);
      setTransY(prevTranslationY.value + event.translationY);

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const pan2 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX2.value = translationX2.value;
      prevTranslationY2.value = translationY2.value;
    })
    .onUpdate(event => {
      // console.log('event.translationX:', event.translationX);
      const maxTranslateX = width - 10;
      const maxTranslateY = height - 50;

      setTransX2(prevTranslationX2.value + event.translationX);
      setTransY2(prevTranslationY2.value + event.translationY);

      translationX2.value = clamp(
        prevTranslationX2.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translationY2.value = clamp(
        prevTranslationY2.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value == 0 ? width / 2 : translationX.value },
      {
        translateY: translationY.value == 0 ? height / 3.5 : translationY.value,
      },
      { scale: scale.value },
    ],
  }));

  const animatedStyles2 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX2.value == 0 ? width / 2 : translationX2.value,
      },
      {
        translateY:
          translationY2.value == 0 ? height / 1.5 : translationY2.value,
      },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={{ position: 'absolute' }}>
      <GestureDetector gesture={pan2}>
        <Animated.View style={[styles.box2, animatedStyles2]}></Animated.View>
      </GestureDetector>
      <Line
        x={10}
        y={10}
        // x1={translationX2.value / 100}
        // y1={translationY2.value / 100}
        // x2={translationX.value / 100}
        // y2={translationY.value / 100}
        x1={transX == 0 ? width / 2 : transX} // Center of first view
        y1={transY == 0 ? height / 3.5 : transY}
        x2={transX2 == 0 ? width / 2 : transX2}
        y2={transY2 == 0 ? height / 1.5 : transY2}
        // x1={width / 2} // Center of first view
        // y1={height / 3.5}
        // x2={width / 2}
        // y2={height / 1.5}
        // x2={pos2.value.x + 25} // Center of second view
        // y2={pos2.value.y + 25}
        stroke="red"
        strokeWidth="2"
        fill="yellow"
      />
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.box, animatedStyles]}></Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  box2: {
    height: 20,
    width: 20,
    position: 'absolute',
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default TapeTool;
