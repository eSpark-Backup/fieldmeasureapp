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
        const maxTranslateX = width - 60;
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
  const leftStyle = animatedInfo(points[0], points[1]);
  const bottomLeftStyle = animatedInfo(points[1], points[2]);
  const bottomRightStyle = animatedInfo(points[2], points[3]);
  const rightStyle = animatedInfo(points[3], points[4]);
  const topRightStyle = animatedInfo(points[4], points[5]);
  const topLeftStyle = animatedInfo(points[5], points[0]);
  const centerStyle = animatedInfo(points[2], points[5]);

  return (
    <View style={{ position: 'absolute' }}>
      <Animated.View style={[styles.box2, leftStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, bottomLeftStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, bottomRightStyle]}>
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
      <Animated.View style={[styles.box2, topRightStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, topLeftStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
      <Animated.View style={[styles.box2, centerStyle]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View>
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
          stroke="#ca5056ff"
          strokeWidth="5"
        />
      ))}
      <AnimatedLine
        x={10 * (2 / scaleValue / 2)}
        y={10 * (2 / scaleValue / 2)}
        animatedProps={animatedLineCenter}
        stroke="#ca5056ff"
        strokeWidth="5"
      />
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
    zIndex: 1000,
  },
  box2: {
    alignItems: 'center',
    backgroundColor: '#ca5056ff',
    // borderRadius: 5,
    // borderWidth: 1,
    position: 'absolute',
  },
});

export default CornerTool;
