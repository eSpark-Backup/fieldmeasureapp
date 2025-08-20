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
import { background, WhiteBackground } from '../../constants/colors';
import { MeasurementPair } from '../../types';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const RakeTool = ({
  scaleValue,
  getCoords,
  getCoordsDist,
  xCoords,
  yCoords,
  xCoordsDist,
  yCoordsDist,
  data,
  showDist,
}: {
  scaleValue: number;
  getCoords: (xCoords: number[], yCoords: number[]) => void;
  getCoordsDist: (xCoords: number[], yCoords: number[]) => void;
  xCoords: number[];
  yCoords: number[];
  xCoordsDist: number[];
  yCoordsDist: number[];
  data: {
    value: string;
    fraction: string;
    distance: MeasurementPair;
  };
  showDist: boolean;
}) => {
  const initialX = xCoords;
  const initialY = yCoords;

  const initialDistX = xCoordsDist;
  const initialDistY = yCoordsDist;

  const points = initialX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialY[i]),
  }));

  const pointsDist = initialDistX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialDistY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialDistY[i]),
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
        if (index == 0) {
          pointsDist[index].x.value = point.x.value;
          pointsDist[index].y.value = point.y.value;
        }
        if (index == 1 && !showDist) {
          pointsDist[index].x.value = point.x.value / 0.9;
          pointsDist[index].y.value = point.y.value / 0.9;
        }
      })
      .onEnd(() => {
        runOnJS(getCoords)(
          points.map(p => p.x.value),
          points.map(p => p.y.value),
        );
        runOnJS(getCoordsDist)(
          pointsDist.map(p => p.x.value),
          pointsDist.map(p => p.y.value),
        );
      }),
  );

  const panGesturesDist = pointsDist.map((point, index) =>
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
        // 🔥 Sync with points[index]
        if (index == 0) {
          points[index].x.value = point.x.value;
          points[index].y.value = point.y.value;
        }
      })
      .onEnd(() => {
        runOnJS(getCoordsDist)(
          pointsDist.map(p => p.x.value),
          pointsDist.map(p => p.y.value),
        );
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

  const animatedStylesDist = pointsDist.map(point =>
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

  const animatedInfoDist = useAnimatedStyle(() => {
    // Get mid-point between points
    const midX = (pointsDist[0].x.value + pointsDist[1].x.value) / 2;
    const midY = (pointsDist[0].y.value + pointsDist[1].y.value) / 2;

    // Calculate rotation in radians → degrees
    const angleDeg =
      Math.atan2(
        pointsDist[1].y.value - pointsDist[0].y.value,
        pointsDist[1].x.value - pointsDist[0].x.value,
      ) *
      (180 / Math.PI);

    return {
      minWidth: 100 * (2 / scaleValue / 2), // ensure scaleValue is a shared value
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

  const animatedLinesDist = [...Array(1)].map((_, i) => {
    return useAnimatedProps(() => ({
      x1: pointsDist[i].x.value,
      y1: pointsDist[i].y.value,
      x2: pointsDist[(i + 1) % 2].x.value,
      y2: pointsDist[(i + 1) % 2].y.value,
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
  const inchesDist = () => {
    const inches = data.distance.value ? data.distance.value : '0';
    const fraction = data.distance.fraction ? data.distance.fraction : '0';
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
          text={`R1: ${inches()}`}
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
          stroke="#7e22ce"
          strokeWidth="5"
          strokeDasharray={[10, 5]}
        />
      ))}
      {showDist && (
        <>
          <Animated.View style={[styles.box2, animatedInfoDist]}>
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`RD1: ${inchesDist()}`}
            />
          </Animated.View>
          {pointsDist.map((_, i) => (
            <GestureDetector key={`pan-${i}`} gesture={panGesturesDist[i]}>
              <Animated.View
                style={[
                  styles.box,
                  { backgroundColor: i == 1 ? '#8B5DF6' : '#fff' },
                  animatedStylesDist[i],
                ]}
              />
            </GestureDetector>
          ))}
        </>
      )}
      {animatedLinesDist.map((props, i) => (
        <AnimatedLine
          key={`line-${i}`}
          x={10 * (2 / scaleValue / 2)}
          y={10 * (2 / scaleValue / 2)}
          animatedProps={props}
          stroke={showDist ? '#7e22ce' : 'transparent'}
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
    // height: 20,
    // width: 20,
    position: 'absolute',
    backgroundColor: '#7e22ce',
    alignItems: 'center',
  },
});

export default RakeTool;
