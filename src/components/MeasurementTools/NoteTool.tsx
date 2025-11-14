import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, ColorValue } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import TheText from '../TheText';
import { WhiteBackground } from '../../constants/colors';
import { CanvasVals } from '../../types';

const { width, height } = Dimensions.get('screen');

const NoteTool = ({
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
}: {
  scaleValue: number;
  getCoords: (xCoords: number[], yCoords: number[]) => void;
  xCoords: number[];
  yCoords: number[];
  data: { value: string; focused: boolean };
  locked?: boolean;
  canvasSize: CanvasVals;
  baseColor: ColorValue;
  onLabelPress: (data: { value: string; focused: boolean }) => void;
  labelSize: number;
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
          point.prevX.value + event.translationX / scaleValue,
          canvasSize.offsetX,
          canvasSize.width + canvasSize.offsetX - 100,
        );
        point.y.value = clamp(
          point.prevY.value + event.translationY / scaleValue,
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
      width: 100 * (2 / scaleValue / 2),
      // height: 20 * (2 / scaleValue / 2),
      transform: [{ translateX: point.x.value }, { translateY: point.y.value }],
    })),
  );

  const onLabel = Gesture.Tap().onStart(() => {
    console.log('SVG Rect pressed via gesture ✅');
    const newData = { ...data };
    newData.focused = true;
    runOnJS(onLabelPress)(newData);
  });

  const combinedGestures = points.map((point, index) =>
    Gesture.Simultaneous(panGestures[index].enabled(!locked), onLabel),
  );

  return (
    <View style={{ position: 'absolute' }}>
      {/* <Animated.View style={[styles.box2, animatedInfo]}>
        <TheText
          size={14 * (2 / scaleValue / 2)}
          color={WhiteBackground}
          text={`M1: ${inches()}`}
        />
      </Animated.View> */}

      {points.map((_, i) => (
        <GestureDetector key={`pan-${i}`} gesture={combinedGestures[i]}>
          <Animated.View
            style={[
              styles.box,
              animatedStyles[i],
              {
                borderColor: data.focused ? '#EAE72E' : baseColor,
                backgroundColor: baseColor,
              },
            ]}
          >
            <TheText
              size={labelSize * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`Note`}
            />
          </Animated.View>
        </GestureDetector>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 5,
    borderWidth: 2,
    position: 'absolute',
    alignItems: 'center',
  },
  box2: {
    // height: 20,
    // width: 20,
    position: 'absolute',
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
  },
});

export default NoteTool;
