import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Line, Line as SVGLine, Text as SVGText } from 'react-native-svg';
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
import { TapeItem } from '../../types';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);
const AnimatedText = Animated.createAnimatedComponent(SVGText);

const TapeTool = ({
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
  data: { value: string; fraction: string };
  locked?: boolean;
}) => {
  const initialX = xCoords;
  const initialY = yCoords;

  console.log('initialX', xCoords);
  console.log('initialY', yCoords);

  const points = initialX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialY[i]),
  }));

  React.useEffect(() => {
    xCoords.forEach((x, i) => {
      points[i].x.value = x;
      points[i].prevX.value = x;
    });
    yCoords.forEach((y, i) => {
      points[i].y.value = y;
      points[i].prevY.value = y;
    });
  }, [xCoords, yCoords]);

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
      width: 20 * (2 / scaleValue / 2),
      height: 20 * (2 / scaleValue / 2),
      transform: [{ translateX: point.x.value }, { translateY: point.y.value }],
    })),
  );

  const animatedInfo = useAnimatedStyle(() => {
    // Get mid-point between points
    const midX = (points[0].x.value + points[1].x.value) / 2;
    const midY = (points[0].y.value + points[1].y.value) / 2;

    // Calculate rotation in radians → degrees
    const angleDeg =
      Math.atan2(
        points[1].y.value - points[0].y.value,
        points[1].x.value - points[0].x.value,
      ) *
      (180 / Math.PI);

    return {
      width: 100 * (2 / scaleValue / 2), // ensure scaleValue is a shared value
      height: 20 * (2 / scaleValue / 2),
      transform: [
        { translateX: midX - 30 * (2 / scaleValue / 2) },
        { translateY: midY - 10 * (2 / scaleValue / 2) },
        { rotate: `${angleDeg}deg` }, // correct way for rotation in reanimated
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

  const inches = () => {
    const inches = data.value ? data.value : '0';
    const fraction = data.fraction ? data.fraction : '0';
    if (inches != '0' && fraction != '0') {
      return inches + '-' + fraction + `"`;
    } else if (inches != '0' && fraction == '0') {
      return inches + `"`;
    } else {
      return `0"`;
    }
  };

  return (
    <View style={{ position: 'absolute' }}>
      <Animated.View style={[styles.box2, animatedInfo]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text={`M1: ${inches()}`}
        />
      </Animated.View>

      {!locked
        ? points.map((_, i) => (
            <GestureDetector key={`pan-${i}`} gesture={panGestures[i]}>
              <Animated.View style={[styles.box, animatedStyles[i]]} />
            </GestureDetector>
          ))
        : null}
      {animatedLines.map((props, i) => (
        <AnimatedLine
          key={`line-${i}`}
          x={10 * (2 / scaleValue / 2)}
          y={10 * (2 / scaleValue / 2)}
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
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
  },
});

export default TapeTool;
