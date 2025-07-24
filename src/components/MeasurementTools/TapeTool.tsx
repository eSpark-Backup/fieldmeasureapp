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

const TapeTool = () => {
  const scale = useSharedValue(1);

  const initialX = [width / 2, width / 2];
  const initialY = [height / 3.5, height / 2];

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
          point.prevX.value + event.translationX,
          1,
          width - 20,
        );
        point.y.value = clamp(
          point.prevY.value + event.translationY,
          1,
          height - 90,
        );
      }),
  );

  const animatedStyles = points.map(point =>
    useAnimatedStyle(() => ({
      transform: [
        { translateX: point.x.value },
        { translateY: point.y.value },
        { scale: scale.value },
      ],
    })),
  );

  const animatedLines = [...Array(1)].map((_, i) => {
    return useAnimatedProps(() => ({
      x1: points[i].x.value,
      y1: points[i].y.value,
      x2: points[(i + 1) % 2].x.value,
      y2: points[(i + 1) % 2].y.value,
    }));
  });

  return (
    <View style={{ position: 'absolute' }}>
      {points.map((_, i) => (
        <GestureDetector key={`pan-${i}`} gesture={panGestures[i]}>
          <Animated.View style={[styles.box, animatedStyles[i]]} />
        </GestureDetector>
      ))}
      {animatedLines.map((props, i) => (
        <AnimatedLine
          key={`line-${i}`}
          x={10}
          y={10}
          animatedProps={props}
          stroke="#1d4ed8"
          strokeWidth="5"
        />
      ))}
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
  },
  box2: {
    height: 20,
    width: 20,
    position: 'absolute',
    backgroundColor: '#ff0',
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default TapeTool;
