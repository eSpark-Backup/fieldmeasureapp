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
  const [transX3, setTransX3] = useState(0);
  const [transY3, setTransY3] = useState(0);
  const [transX4, setTransX4] = useState(0);
  const [transY4, setTransY4] = useState(0);

  const translationX = useSharedValue(width / 10.2);
  const translationY = useSharedValue(height / 3.5);
  const prevTranslationX = useSharedValue(width / 10.2);
  const prevTranslationY = useSharedValue(height / 3.5);

  const translationX2 = useSharedValue(width / 10.2);
  const translationY2 = useSharedValue(height / 1.5);
  const prevTranslationX2 = useSharedValue(width / 10.2);
  const prevTranslationY2 = useSharedValue(height / 1.5);

  const translationX3 = useSharedValue(width / 1.2);
  const translationY3 = useSharedValue(height / 1.5);
  const prevTranslationX3 = useSharedValue(width / 1.2);
  const prevTranslationY3 = useSharedValue(height / 1.5);

  const translationX4 = useSharedValue(width / 1.2);
  const translationY4 = useSharedValue(height / 3.5);
  const prevTranslationX4 = useSharedValue(width / 1.2);
  const prevTranslationY4 = useSharedValue(height / 3.5);

  const scale = useSharedValue(1);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 20;
      const maxTranslateY = height - 90;

      setTransX(prevTranslationX.value + event.translationX);
      setTransY(prevTranslationY.value + event.translationY);

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        1,
        maxTranslateX,
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        1,
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
      const maxTranslateX = width - 20;
      const maxTranslateY = height - 90;

      setTransX2(prevTranslationX2.value + event.translationX);
      setTransY2(prevTranslationY2.value + event.translationY);

      translationX2.value = clamp(
        prevTranslationX2.value + event.translationX,
        1,
        maxTranslateX,
      );
      translationY2.value = clamp(
        prevTranslationY2.value + event.translationY,
        1,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const pan3 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX3.value = translationX3.value;
      prevTranslationY3.value = translationY3.value;
    })
    .onUpdate(event => {
      // console.log('event.translationX:', event.translationX);
      const maxTranslateX = width - 20;
      const maxTranslateY = height - 90;

      setTransX3(prevTranslationX3.value + event.translationX);
      setTransY3(prevTranslationY3.value + event.translationY);

      translationX3.value = clamp(
        prevTranslationX3.value + event.translationX,
        1,
        maxTranslateX,
      );
      translationY3.value = clamp(
        prevTranslationY3.value + event.translationY,
        1,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const pan4 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX4.value = translationX4.value;
      prevTranslationY4.value = translationY4.value;
    })
    .onUpdate(event => {
      // console.log('event.translationX:', event.translationX);
      const maxTranslateX = width - 20;
      const maxTranslateY = height - 90;

      setTransX4(prevTranslationX4.value + event.translationX);
      setTransY4(prevTranslationY4.value + event.translationY);

      translationX4.value = clamp(
        prevTranslationX4.value + event.translationX,
        1,
        maxTranslateX,
      );
      translationY4.value = clamp(
        prevTranslationY4.value + event.translationY,
        1,
        maxTranslateY,
      );
    })
    .runOnJS(true);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX.value == 0 ? width / 10.2 : translationX.value,
      },
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
  const animatedStyles3 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          translationX3.value == 0 ? width / 1.5 : translationX3.value,
      },
      {
        translateY:
          translationY3.value == 0 ? height / 1.5 : translationY3.value,
      },
      { scale: scale.value },
    ],
  }));
  const animatedStyles4 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          translationX4.value == 0 ? width / 1.1 : translationX4.value,
      },
      {
        translateY:
          translationY4.value == 0 ? height / 1.5 : translationY4.value,
      },
      { scale: scale.value },
    ],
  }));

  const sizeBoxStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: (translationX.value + translationX4.value) / 2 - (20 - 15),
      },
      {
        translateY: (translationY.value + translationY4.value) / 2 - (20 - 15),
      },
      { scale: scale.value },
    ],
  }));

  const sizeBox1Styles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: (translationX.value + translationX4.value) / 3 - (20 - 15),
      },
      {
        translateY:
          translationY.value +
          (translationY4.value - translationY.value) / 4 -
          (20 - 15),
      },
      { scale: scale.value },
    ],
  }));

  const sizeBox2Styles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          (translationX.value + translationX4.value) / 1.5 - (20 - 15),
        // translateX:
        //   ((translationX.value + translationX4.value) / 2 - (20 - 15)) / 2 +
        //   (translationX.value + translationX4.value) / 2 -
        //   (20 - 15) +
        //   -20,
      },
      {
        translateY: translationY4.value - (20 - 15),
      },
      { scale: scale.value },
    ],
  }));

  console.log('translationX.value:', translationX.value);
  console.log('translationX4.value:', translationX4.value);
  console.log('translationY.value:', translationY.value);
  console.log('translationY4.value:', translationY4.value);
  console.log(
    'translationY4.value - translationX.value:',
    translationY4.value - translationY.value,
  );

  return (
    <View style={{ position: 'absolute' }}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.box, animatedStyles]}></Animated.View>
      </GestureDetector>
      <GestureDetector gesture={pan2}>
        <Animated.View style={[styles.box, animatedStyles2]}></Animated.View>
      </GestureDetector>
      <Animated.View style={[styles.sizeBox, sizeBoxStyles]}></Animated.View>
      <Animated.View style={[styles.sizeBox, sizeBox1Styles]}></Animated.View>
      <Animated.View style={[styles.sizeBox, sizeBox2Styles]}></Animated.View>
      <Line
        x={15}
        y={15}
        x1={transX == 0 ? width / 10.2 : transX} // Center of first view
        y1={transY == 0 ? height / 3.5 : transY}
        x2={transX2 == 0 ? width / 10.2 : transX2}
        y2={transY2 == 0 ? height / 1.5 : transY2}
        stroke="red"
        strokeWidth="2"
      />
      <Line
        x={15}
        y={15}
        x1={transX2 == 0 ? width / 10.2 : transX2} // Center of first view
        y1={transY2 == 0 ? height / 1.5 : transY2}
        x2={transX3 == 0 ? width / 1.2 : transX3}
        y2={transY3 == 0 ? height / 1.5 : transY3}
        stroke="green"
        strokeWidth="2"
      />
      <Line
        x={15}
        y={15}
        x1={transX3 == 0 ? width / 1.2 : transX3} // Center of first view
        y1={transY3 == 0 ? height / 1.5 : transY3}
        x2={transX4 == 0 ? width / 1.2 : transX4}
        y2={transY4 == 0 ? height / 3.5 : transY4}
        stroke="blue"
        strokeWidth="2"
      />
      <Line
        x={15}
        y={15}
        x1={transX4 == 0 ? width / 1.2 : transX4} // Center of first view
        y1={transY4 == 0 ? height / 3.5 : transY4}
        x2={transX == 0 ? width / 10.2 : transX}
        y2={transY == 0 ? height / 3.5 : transY}
        stroke="black"
        strokeWidth="2"
      />
      <GestureDetector gesture={pan3}>
        <Animated.View style={[styles.box, animatedStyles3]}></Animated.View>
      </GestureDetector>
      <GestureDetector gesture={pan4}>
        <Animated.View style={[styles.box, animatedStyles4]}></Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 30,
    width: 30,
    backgroundColor: '#b58df1',
    borderRadius: 20,
    borderWidth: 1,
    position: 'absolute',
    // margin: 20,
    zIndex: 1000,
  },
  sizeBox: {
    height: 40,
    width: 40,
    backgroundColor: '#b58df1',
    borderRadius: 5,
    borderWidth: 1,
    position: 'absolute',
    // margin: 20,
  },
});

export default TapeTool;
