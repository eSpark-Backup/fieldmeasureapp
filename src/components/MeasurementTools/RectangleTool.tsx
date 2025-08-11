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
import TheText from '../TheText';
import { WhiteBackground } from '../../constants/colors';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const RectangleTool = ({
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
      width: 20 * (2 / scaleValue / 2),
      height: 20 * (2 / scaleValue / 2),
      transform: [{ translateX: point.x.value }, { translateY: point.y.value }],
    })),
  );

  const animatedLines = [...Array(4)].map((_, i) => {
    return useAnimatedProps(() => ({
      x1: points[i].x.value,
      y1: points[i].y.value,
      x2: points[(i + 1) % 4].x.value,
      y2: points[(i + 1) % 4].y.value,
    }));
  });

  const animatedInfo = (p1: any, p2: any) =>
    useAnimatedStyle(() => {
      // Get mid-point between points
      const midX = (p1.x.value + p2.x.value) / 2;
      const midY = (p1.y.value + p2.y.value) / 2;

      // Calculate rotation in radians → degrees
      const angleDeg =
        Math.atan2(p2.y.value - p1.y.value, p2.x.value - p1.x.value) *
        (180 / Math.PI);

      return {
        width: 80 * (2 / scaleValue / 2), // ensure scaleValue is a shared value
        height: 20 * (2 / scaleValue / 2),
        transform: [
          { translateX: midX - 30 * (2 / scaleValue / 2) },
          { translateY: midY - 10 * (2 / scaleValue / 2) },
          { rotate: `${angleDeg}deg` }, // correct way for rotation in reanimated
        ],
      };
    });

  // Four sides of rectangle
  const topStyle = animatedInfo(points[0], points[1]);
  const rightStyle = animatedInfo(points[1], points[2]);
  const bottomStyle = animatedInfo(points[2], points[3]);
  const leftStyle = animatedInfo(points[3], points[0]);

  return (
    <View style={{ position: 'absolute' }}>
      <Animated.View style={[styles.box2, topStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, rightStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, bottomStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, leftStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      {points.map((_, i) => (
        <GestureDetector key={`pan-${i}`} gesture={panGestures[i]}>
          <Animated.View style={[styles.box, animatedStyles[i]]} />
        </GestureDetector>
      ))}
      {animatedLines.map((props, i) => (
        <AnimatedLine
          key={`line-${i}`}
          x={10 * (2 / scaleValue / 2)}
          y={10 * (2 / scaleValue / 2)}
          animatedProps={props}
          stroke="#15803d"
          strokeWidth="5"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2975D2',
    position: 'absolute',
  },
  box2: {
    // height: 20,
    // width: 20,
    position: 'absolute',
    backgroundColor: '#15803d',
    alignItems: 'center',
    // borderRadius: 20,
    // borderWidth: 1,
  },
});

export default RectangleTool;
