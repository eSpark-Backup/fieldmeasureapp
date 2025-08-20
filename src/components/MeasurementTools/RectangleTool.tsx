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
import { MeasurementPair } from '../../types';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const RectangleTool = ({
  scaleValue,
  getCoords,
  xCoords,
  yCoords,
  data,
}: {
  scaleValue: number;
  getCoords: (xCoords: number[], yCoords: number[]) => void;
  xCoords: number[];
  yCoords: number[];
  data: Record<
    'TopA' | 'TopB' | 'RightA' | 'RightB' | 'BotA' | 'BotB' | 'LeftA' | 'LeftB',
    MeasurementPair
  >;
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

  const animatedInfo = (p1: any, p2: any) => {
    return useAnimatedStyle(() => {
      const dx = p2.x.value - p1.x.value;
      const dy = p2.y.value - p1.y.value;

      const length = Math.sqrt(dx * dx + dy * dy); // distance between points
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // ✅ Normalize angle so text is never upside-down
      if (angle > 90 || angle < -90) {
        angle += 180;
      }

      const midX = (p1.x.value + p2.x.value) / 2;
      const midY = (p1.y.value + p2.y.value) / 2;

      return {
        width: length,
        height: 20 / scaleValue, // keep same scale effect
        position: 'absolute',
        transform: [
          { translateX: midX - length / 2 }, // center horizontally
          { translateY: midY - 20 / scaleValue / 2 }, // center vertically
          { rotate: `${angle}deg` },
        ],
      };
    });
  };

  // Four sides of rectangle
  const leftStyle = animatedInfo(points[0], points[1]);
  const bottomStyle = animatedInfo(points[1], points[2]);
  const rightStyle = animatedInfo(points[2], points[3]);
  const topStyle = animatedInfo(points[3], points[0]);

  return (
    <View style={{ position: 'absolute' }}>
      <Animated.View style={[styles.box2, leftStyle]}>
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="A:0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="0-0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="B:0"
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, bottomStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="A:0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="0-0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="B:0"
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, rightStyle]}>
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="A:0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="0-0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="B:0"
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, topStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="A:0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="0-0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#15803d',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="B:0"
            />
          </View>
        </View>
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
    // backgroundColor: '#15803d',
    alignItems: 'center',
    // borderRadius: 20,
    // borderWidth: 1,
  },
});

export default RectangleTool;
