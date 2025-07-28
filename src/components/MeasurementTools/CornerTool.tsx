import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Line as SVGLine } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const CornerTool = () => {
  const translationX = useSharedValue(width * 0.1);
  const translationY = useSharedValue(height / 3.5);
  const prevTranslationX = useSharedValue(width * 0.1);
  const prevTranslationY = useSharedValue(height / 3.5);

  const translationX2 = useSharedValue(width * 0.1);
  const translationY2 = useSharedValue(height / 2);
  const prevTranslationX2 = useSharedValue(width * 0.1);
  const prevTranslationY2 = useSharedValue(height / 2);

  const translationX3 = useSharedValue(width / 2 - 30);
  const translationY3 = useSharedValue(height / 2);
  const prevTranslationX3 = useSharedValue(width / 2 - 30);
  const prevTranslationY3 = useSharedValue(height / 2);

  const translationX4 = useSharedValue(width - width * 0.25);
  const translationY4 = useSharedValue(height / 2);
  const prevTranslationX4 = useSharedValue(width - width * 0.25);
  const prevTranslationY4 = useSharedValue(height / 2);

  const translationX5 = useSharedValue(width - width * 0.25);
  const translationY5 = useSharedValue(height / 3.5);
  const prevTranslationX5 = useSharedValue(width - width * 0.25);
  const prevTranslationY5 = useSharedValue(height / 3.5);

  const translationX6 = useSharedValue(width / 2 - 30);
  const translationY6 = useSharedValue(height / 3.5);
  const prevTranslationX6 = useSharedValue(width / 2 - 30);
  const prevTranslationY6 = useSharedValue(height / 3.5);

  const scale = useSharedValue(1);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 60;
      const maxTranslateY = height - 90;

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
    });

  const pan2 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX2.value = translationX2.value;
      prevTranslationY2.value = translationY2.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 60;
      const maxTranslateY = height - 90;

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
    });

  const pan3 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX3.value = translationX3.value;
      prevTranslationY3.value = translationY3.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 60;
      const maxTranslateY = height - 90;

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
    });

  const pan4 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX4.value = translationX4.value;
      prevTranslationY4.value = translationY4.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 60;
      const maxTranslateY = height - 90;

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
    });
  const pan5 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX5.value = translationX5.value;
      prevTranslationY5.value = translationY5.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 60;
      const maxTranslateY = height - 90;

      translationX5.value = clamp(
        prevTranslationX5.value + event.translationX,
        1,
        maxTranslateX,
      );
      translationY5.value = clamp(
        prevTranslationY5.value + event.translationY,
        1,
        maxTranslateY,
      );
    });
  const pan6 = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX6.value = translationX6.value;
      prevTranslationY6.value = translationY6.value;
    })
    .onUpdate(event => {
      const maxTranslateX = width - 60;
      const maxTranslateY = height - 90;

      translationX6.value = clamp(
        prevTranslationX6.value + event.translationX,
        1,
        maxTranslateX,
      );
      translationY6.value = clamp(
        prevTranslationY6.value + event.translationY,
        1,
        maxTranslateY,
      );
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          translationX.value == 0 ? width - width : translationX.value,
      },
      {
        translateY:
          translationY.value == 0 ? width - width : translationY.value,
      },
      { scale: scale.value },
    ],
  }));
  const animatedStyles2 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          translationX2.value == 0 ? width - width : translationX2.value,
      },
      {
        translateY:
          translationY2.value == 0 ? width - width : translationY2.value,
      },
      { scale: scale.value },
    ],
  }));
  const animatedStyles3 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX3.value == 0 ? width / 2 : translationX3.value,
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
        translateX: translationX4.value == 0 ? width : translationX4.value,
      },
      {
        translateY:
          translationY4.value == 0 ? height / 1.5 : translationY4.value,
      },
      { scale: scale.value },
    ],
  }));
  const animatedStyles5 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX5.value == 0 ? width : translationX5.value,
      },
      {
        translateY:
          translationY5.value == 0 ? height / 3.5 : translationY5.value,
      },
      { scale: scale.value },
    ],
  }));
  const animatedStyles6 = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translationX6.value == 0 ? width / 2 : translationX6.value,
      },
      {
        translateY:
          translationY6.value == 0 ? height / 3.5 : translationY6.value,
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
      },
      {
        translateY: translationY4.value - (20 - 15),
      },
      { scale: scale.value },
    ],
  }));

  const animatedLineProps1 = useAnimatedProps(() => ({
    x1: translationX.value,
    y1: translationY.value,
    x2: translationX2.value,
    y2: translationY2.value,
  }));
  const animatedLineProps2 = useAnimatedProps(() => ({
    x1: translationX2.value,
    y1: translationY2.value,
    x2: translationX3.value,
    y2: translationY3.value,
  }));
  const animatedLineProps3 = useAnimatedProps(() => ({
    x1: translationX3.value,
    y1: translationY3.value,
    x2: translationX4.value,
    y2: translationY4.value,
  }));
  const animatedLineProps4 = useAnimatedProps(() => ({
    x1: translationX4.value,
    y1: translationY4.value,
    x2: translationX5.value,
    y2: translationY5.value,
  }));
  const animatedLineProps5 = useAnimatedProps(() => ({
    x1: translationX5.value,
    y1: translationY5.value,
    x2: translationX6.value,
    y2: translationY6.value,
  }));
  const animatedLineProps6 = useAnimatedProps(() => ({
    x1: translationX6.value,
    y1: translationY6.value,
    x2: translationX.value,
    y2: translationY.value,
  }));
  const animatedLinePropsCenter = useAnimatedProps(() => ({
    x1: translationX6.value,
    y1: translationY6.value,
    x2: translationX3.value,
    y2: translationY3.value,
  }));

  const animatedLines = [
    animatedLineProps1,
    animatedLineProps2,
    animatedLineProps3,
    animatedLinePropsCenter,
    animatedLineProps4,
    animatedLineProps5,
    animatedLineProps6,
  ];

  return (
    <View style={{ position: 'absolute' }}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.box, animatedStyles]}></Animated.View>
      </GestureDetector>
      <GestureDetector gesture={pan2}>
        <Animated.View style={[styles.box, animatedStyles2]}></Animated.View>
      </GestureDetector>
      <GestureDetector gesture={pan3}>
        <Animated.View style={[styles.box, animatedStyles3]}></Animated.View>
      </GestureDetector>
      {/* <Animated.View style={[styles.sizeBox, sizeBoxStyles]}></Animated.View>
      <Animated.View style={[styles.sizeBox, sizeBox1Styles]}></Animated.View>
      <Animated.View style={[styles.sizeBox, sizeBox2Styles]}></Animated.View> */}
      {animatedLines.map((props, i) => (
        <AnimatedLine
          key={`line-${i}`}
          x={10}
          y={10}
          animatedProps={props}
          stroke="#c2410c"
          strokeWidth="1"
        />
      ))}
      <GestureDetector gesture={pan4}>
        <Animated.View style={[styles.box, animatedStyles4]}></Animated.View>
      </GestureDetector>
      <GestureDetector gesture={pan5}>
        <Animated.View style={[styles.box, animatedStyles5]}></Animated.View>
      </GestureDetector>
      <GestureDetector gesture={pan6}>
        <Animated.View style={[styles.box, animatedStyles6]}></Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2975D2',
    position: 'absolute',
    zIndex: 1000,
  },
  sizeBox: {
    height: 40,
    width: 40,
    backgroundColor: '#b58df1',
    borderRadius: 5,
    borderWidth: 1,
    position: 'absolute',
  },
});

export default CornerTool;
