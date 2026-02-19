import React, { useEffect } from 'react';
import { View, StyleSheet, ColorValue } from 'react-native';
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
import { CanvasVals, MeasurementPair } from '../../types';
import { formatInches, formatInchesSum } from './utils';

const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const LaserTool = ({
  scaleValue,
  getCoords,
  xCoords,
  yCoords,
  data,
  locked,
  canvasSize,
  baseColor,
  onLabelPress,
  labelSize,
  label,
  hideEndpoints,
}: {
  scaleValue: number;
  getCoords: (xCoords: number[], yCoords: number[]) => void;
  xCoords: number[];
  yCoords: number[];
  data: {
    SideA: MeasurementPair;
    SideB: MeasurementPair;
  };
  locked?: boolean;
  canvasSize: CanvasVals;
  baseColor: ColorValue;
  onLabelPress: (data: {
    SideA: MeasurementPair;
    SideB: MeasurementPair;
  }) => void;
  labelSize: number;
  label: string;
  hideEndpoints: boolean;
}) => {
  const initialX = xCoords;
  const initialY = yCoords;

  const points = initialX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialY[i]),
  }));

  useEffect(() => {
    initialX.forEach((x, i) => {
      points[i].x.value = x;
      points[i].prevX.value = x;
    });
    initialY.forEach((y, i) => {
      points[i].y.value = y;
      points[i].prevY.value = y;
    });
  }, [initialX, initialY]);

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
          canvasSize.offsetX,
          canvasSize.width + canvasSize.offsetX - 20,
        );
        point.y.value = clamp(
          point.prevY.value + event.translationY,
          0,
          canvasSize.height - 20,
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

  const animatedInfoCenter = useAnimatedStyle(() => {
    const dx = points[1].x.value - points[0].x.value;
    const dy = points[1].y.value - points[0].y.value;

    const length = Math.sqrt(dx * dx + dy * dy); // line length
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // rotation in degrees

    const midX = (points[0].x.value + points[1].x.value) / 2;
    const midY = (points[0].y.value + points[1].y.value) / 2;

    return {
      width: length, // same as line length
      // height: 20 / scaleValue, // fixed height but scales with zoom
      position: 'absolute',
      transform: [
        { translateX: midX + 10 - length / 2 }, // center align horizontally
        { translateY: midY - 10 / scaleValue }, // center align vertically
        { rotate: `${angle}deg` }, // rotation
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

  const handleFocus = (side: 'SideA' | 'SideB') =>
    Gesture.Tap().onStart(() => {
      console.log('SVG Rect pressed via gesture ✅');
      runOnJS(onLabelPress)({
        ...data,
        SideA: { ...data.SideA, focused: side === 'SideA' },
        SideB: { ...data.SideB, focused: side === 'SideB' },
      });
    });

  return (
    <View style={{ position: 'absolute' }}>
      <Animated.View style={[styles.box2, animatedInfoCenter]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <GestureDetector gesture={handleFocus('SideB')}>
            <View
              style={{
                backgroundColor: baseColor,
                paddingHorizontal: 10,
                alignItems: 'center',
                borderWidth: 2,
                borderRadius: 5,
                borderColor: data.SideB.focused ? '#EAE72E' : baseColor,
              }}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`${label}B: ${formatInches(data.SideB)}`}
              />
            </View>
          </GestureDetector>
          <View
            style={{
              backgroundColor: baseColor,
              paddingHorizontal: 10,
              alignItems: 'center',
              position: 'absolute',
              top: '100%',
            }}
          >
            <TheText
              size={labelSize * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`${label}: ${formatInchesSum(
                data.SideA,
                data.SideB,
              )}`}
            />
          </View>
          <GestureDetector gesture={handleFocus('SideA')}>
            <View
              style={{
                backgroundColor: baseColor,
                paddingHorizontal: 10,
                alignItems: 'center',
                borderWidth: 2,
                borderRadius: 5,
                borderColor: data.SideA.focused ? '#EAE72E' : baseColor,
              }}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`${label}A: ${formatInches(data.SideA)}`}
              />
            </View>
          </GestureDetector>
        </View>
      </Animated.View>
      {/* <Animated.View style={[styles.box2, animatedInfoRight]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text="M1:0"
        />
      </Animated.View> */}
      {!locked && !hideEndpoints
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
          stroke={baseColor}
          strokeWidth="2.5"
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
    width: 20,
    position: 'absolute',
    alignItems: 'center',
  },
});

export default LaserTool;
