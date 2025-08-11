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

const LaserTool = ({
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

  const animatedInfoLeft = useAnimatedStyle(() => {
    // Get mid-point between points
    const midX =
      (points[0].x.value + points[0].x.value + points[1].x.value) / 4;
    const midY = (points[0].y.value + points[1].y.value) / 2;

    // Calculate rotation in radians → degrees
    const angleDeg =
      Math.atan2(
        points[1].y.value - points[0].y.value,
        points[1].x.value - points[0].x.value,
      ) *
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

  // const animatedInfoCenter = useAnimatedStyle(() => {
  //   // Get mid-point between points
  //   const midX = (points[0].x.value + points[1].x.value) / 2;
  //   const midY = (points[0].y.value + points[1].y.value) / 2;

  //   // Calculate rotation in radians → degrees
  //   const angleDeg =
  //     Math.atan2(
  //       points[1].y.value - points[0].y.value,
  //       points[1].x.value - points[0].x.value,
  //     ) *
  //     (180 / Math.PI);

  //   return {
  //     width: 80 * (2 / scaleValue / 2), // ensure scaleValue is a shared value
  //     height: 20 * (2 / scaleValue / 2),
  //     transform: [
  //       { translateX: midX - 30 * (2 / scaleValue / 2) },
  //       { translateY: midY - 10 * (2 / scaleValue / 2) },
  //       { rotate: `${angleDeg}deg` }, // correct way for rotation in reanimated
  //     ],
  //   };
  // });

  const animatedInfoCenter = useAnimatedStyle(() => {
    const dx = points[1].x.value - points[0].x.value;
    const dy = points[1].y.value - points[0].y.value;

    const length = Math.sqrt(dx * dx + dy * dy); // line length
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // rotation in degrees

    const midX = (points[0].x.value + points[1].x.value) / 2;
    const midY = (points[0].y.value + points[1].y.value) / 2;

    return {
      width: length, // same as line length
      height: 20 / scaleValue, // fixed height but scales with zoom
      position: 'absolute',
      transform: [
        { translateX: midX + 10 - length / 2 }, // center align horizontally
        { translateY: midY - 10 / scaleValue }, // center align vertically
        { rotate: `${angle}deg` }, // rotation
      ],
    };
  });

  const animatedInfoRight = useAnimatedStyle(() => {
    const p0x = points[0].x.value;
    const p0y = points[0].y.value;
    const p1x = points[1].x.value;
    const p1y = points[1].y.value;

    // Midpoint between points
    const midX = (p0x + p1x) / 2;
    const midY = (p0y + p1y) / 2;

    // Direction vector from p0 → p1
    const dx = p1x - p0x;
    const dy = p1y - p0y;

    // Normalize direction vector
    const length = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / length;
    const uy = dy / length;

    // Shift along the line's direction (positive = toward point 1)
    const offsetAlongLine = 40; // adjust this value to set gap
    const shiftedX = midX + ux * offsetAlongLine;
    const shiftedY = midY + uy * offsetAlongLine;

    // Rotation in degrees
    const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);

    return {
      width: 80 * (2 / scaleValue / 2),
      height: 20 * (2 / scaleValue / 2),
      transform: [
        { translateX: shiftedX - 30 * (2 / scaleValue / 2) },
        { translateY: shiftedY - 10 * (2 / scaleValue / 2) },
        { rotate: `${angleDeg}deg` },
      ],
    };
  });

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
      {/* <Animated.View style={[styles.box2, animatedInfoLeft]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View> */}
      <Animated.View style={[styles.box2, animatedInfoCenter]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#b91c1c',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="M1:0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#b91c1c',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="M1:0"
            />
          </View>
          <View
            style={{
              backgroundColor: '#b91c1c',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text="M1:0"
            />
          </View>
        </View>
      </Animated.View>
      {/* <Animated.View style={[styles.box2, animatedInfoRight]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View> */}
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
          stroke="#b91c1c"
          strokeWidth="5"
          strokeDasharray={[10, 5]}
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
    height: 20,
    width: 20,
    position: 'absolute',
    // backgroundColor: '#b91c1c',
    alignItems: 'center',
  },
});

export default LaserTool;
