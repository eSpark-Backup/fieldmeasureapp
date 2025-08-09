import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Line as SVGLine } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const CornerTool = ({
  scaleValue,
  getCoords,
  xCoords,
  yCoords,
}: {
  scaleValue: number;
  getCoords: (xCoords: number[], yCoords: number[]) => void;
  xCoords: number[];
  yCoords: number[];
}) => {
  const initialX = xCoords;
  const initialY = yCoords;

  const points = initialX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialY[i]),
  }));

  const panGestures = points.map(point =>
    Gesture.Pan()
      .minDistance(1)
      .onStart(() => {
        point.prevX.value = point.x.value;
        point.prevY.value = point.y.value;
      })
      .onUpdate(event => {
        const maxTranslateX = width - 60; // you had 60 before, so keep it
        const maxTranslateY = height - 90;

        point.x.value = clamp(
          point.prevX.value + event.translationX,
          1,
          maxTranslateX,
        );
        point.y.value = clamp(
          point.prevY.value + event.translationY,
          1,
          maxTranslateY,
        );
      })
      .onEnd(() => {
        runOnJS(getCoords)(
          points.map(p => p.x.value), // X array
          points.map(p => p.y.value), // Y array
        );
      }),
  );

  const animatedStyles = points.map(point =>
    useAnimatedStyle(() => ({
      width: 20 * (2 / scaleValue / 2),
      height: 20 * (2 / scaleValue / 2),
      transform: [{ translateX: point.x.value }, { translateY: point.y.value }],
    })),
  );

  const animatedLines = [...Array(6)].map((_, i) =>
    useAnimatedProps(() => ({
      x1: points[i].x.value,
      y1: points[i].y.value,
      x2: points[(i + 1) % 6].x.value,
      y2: points[(i + 1) % 6].y.value,
    })),
  );

  // Extra “center” line (6 → 3 in your original)
  const animatedLineCenter = useAnimatedProps(() => ({
    x1: points[5].x.value,
    y1: points[5].y.value,
    x2: points[2].x.value,
    y2: points[2].y.value,
  }));

  return (
    <View style={{ position: 'absolute' }}>
      {points.map((_, i) => (
        <GestureDetector key={`point-${i}`} gesture={panGestures[i]}>
          <Animated.View style={[styles.box, animatedStyles[i]]} />
        </GestureDetector>
      ))}

      {animatedLines.map((props, i) => (
        <AnimatedLine
          key={`line-${i}`}
          x={10 * (2 / scaleValue / 2)}
          y={10 * (2 / scaleValue / 2)}
          animatedProps={props}
          stroke="#c2410c"
          strokeWidth="1"
        />
      ))}

      <AnimatedLine
        x={10 * (2 / scaleValue / 2)}
        y={10 * (2 / scaleValue / 2)}
        animatedProps={animatedLineCenter}
        stroke="#0c4ac2"
        strokeWidth="1.5"
      />
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
