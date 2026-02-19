import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, ColorValue } from 'react-native';
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

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const RectangleTool = ({
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
  data: Record<
    'TopA' | 'TopB' | 'RightA' | 'RightB' | 'BotA' | 'BotB' | 'LeftA' | 'LeftB',
    MeasurementPair
  >;
  locked?: boolean;
  canvasSize: CanvasVals;
  baseColor: ColorValue;
  onLabelPress: (
    data: Record<
      | 'TopA'
      | 'TopB'
      | 'RightA'
      | 'RightB'
      | 'BotA'
      | 'BotB'
      | 'LeftA'
      | 'LeftB',
      MeasurementPair
    >,
  ) => void;
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

      // Normalize angle so text is never upside-down
      if (angle > 90 || angle < -90) {
        angle += 180;
      }

      const midX = (p1.x.value + p2.x.value) / 2;
      const midY = (p1.y.value + p2.y.value) / 2;

      return {
        width: length,
        // height: 20 / scaleValue, // keep same scale effect
        position: 'absolute',
        transform: [
          { translateX: midX - length / 2 }, // center horizontally
          { translateY: midY - labelSize / scaleValue / 2 }, // center vertically
          { rotate: `${angle}deg` },
        ],
      };
    });
  };

  const animatedVInfo = (p1: any, p2: any) => {
    return useAnimatedStyle(() => {
      const dx = p2.x.value - p1.x.value;
      const dy = p2.y.value - p1.y.value;

      const length = Math.sqrt(dx * dx + dy * dy); // distance between points
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const midX = (p1.x.value + p2.x.value) / 2;
      const midY = (p1.y.value + p2.y.value) / 2;

      return {
        width: length,
        // height: 20 / scaleValue, // keep same scale effect
        position: 'absolute',
        transform: [
          { translateX: midX - length / 2 }, // center horizontally
          { translateY: midY - labelSize / scaleValue / 2 }, // center vertically
          { rotate: `${angle}deg` },
        ],
      };
    });
  };

  // Four sides of rectangle
  const leftStyle = animatedVInfo(points[0], points[1]);
  const bottomStyle = animatedInfo(points[1], points[2]);
  const rightStyle = animatedVInfo(points[2], points[3]);
  const topStyle = animatedInfo(points[3], points[0]);

  const handleFocus = (side: keyof typeof data) =>
    Gesture.Tap().onStart(() => {
      console.log('SVG Rect pressed via gesture ✅');
      const updatedData = { ...data };

      // Unfocus all sides first
      Object.keys(updatedData).forEach(key => {
        updatedData[key as keyof typeof data] = {
          ...updatedData[key as keyof typeof data],
          focused: false,
        };
      });

      // Focus only the tapped side
      updatedData[side] = {
        ...updatedData[side],
        focused: true,
      };

      runOnJS(onLabelPress)(updatedData);
    });

  return (
    <View style={{ position: 'absolute' }}>
      <Animated.View style={[styles.box2, leftStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <GestureDetector gesture={handleFocus('LeftA')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.LeftA.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`A: ${formatInches(data.LeftA)}`}
              />
            </View>
          </GestureDetector>
          <View
            style={[styles.centerLabelCont, { backgroundColor: baseColor }]}
          >
            <TheText
              size={labelSize * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`${formatInchesSum(data.LeftA, data.LeftB)}`}
            />
          </View>
          <GestureDetector gesture={handleFocus('LeftB')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.LeftB.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`B: ${formatInches(data.LeftB)}`}
              />
            </View>
          </GestureDetector>
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
          <GestureDetector gesture={handleFocus('BotA')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.BotA.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`A: ${formatInches(data.BotA)}`}
              />
            </View>
          </GestureDetector>
          <View
            style={[styles.centerLabelCont, { backgroundColor: baseColor }]}
          >
            <TheText
              size={labelSize * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.BotA, data.BotB)}
            />
          </View>
          <GestureDetector gesture={handleFocus('BotB')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.BotB.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`B: ${formatInches(data.BotB)}`}
              />
            </View>
          </GestureDetector>
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
          <GestureDetector gesture={handleFocus('RightA')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.RightA.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`A: ${formatInches(data.RightA)}`}
              />
            </View>
          </GestureDetector>
          <View
            style={[styles.centerLabelCont, { backgroundColor: baseColor }]}
          >
            <TheText
              size={labelSize * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.RightA, data.RightB)}
            />
          </View>
          <GestureDetector gesture={handleFocus('RightB')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.RightB.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`B: ${formatInches(data.RightB)}`}
              />
            </View>
          </GestureDetector>
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
          <GestureDetector gesture={handleFocus('TopA')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.TopA.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`A: ${formatInches(data.TopA)}`}
              />
            </View>
          </GestureDetector>
          <View
            style={[styles.centerLabelCont, { backgroundColor: baseColor }]}
          >
            <TheText
              size={labelSize * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.TopA, data.TopB)}
            />
          </View>
          <GestureDetector gesture={handleFocus('TopB')}>
            <View
              style={[
                styles.labelContainer,
                {
                  borderColor: data.TopB.focused ? '#EAE72E' : baseColor,
                  backgroundColor: baseColor,
                },
              ]}
            >
              <TheText
                size={labelSize * (2 / scaleValue / 2)}
                color={WhiteBackground}
                text={`B: ${formatInches(data.TopB)}`}
              />
            </View>
          </GestureDetector>
        </View>
      </Animated.View>
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
  centerLabelCont: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  labelContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default RectangleTool;
