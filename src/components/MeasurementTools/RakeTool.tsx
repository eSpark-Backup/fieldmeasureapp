import React, { useEffect } from 'react';
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
import { CanvasVals, MeasurementPair } from '../../types';

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
  locked,
  canvasSize,
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
  locked?: boolean;
  canvasSize: CanvasVals;
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

  const pointsDist = initialDistX.map((x, i) => ({
    x: useSharedValue(x),
    y: useSharedValue(initialDistY[i]),
    prevX: useSharedValue(x),
    prevY: useSharedValue(initialDistY[i]),
  }));

  useEffect(() => {
    initialDistX.forEach((x, i) => {
      pointsDist[i].x.value = x;
      pointsDist[i].prevX.value = x;
    });
    initialDistY.forEach((y, i) => {
      pointsDist[i].y.value = y;
      pointsDist[i].prevY.value = y;
    });
  }, [initialDistX, initialDistY]);

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
        if (index == 0) {
          pointsDist[index].x.value = point.x.value;
          pointsDist[index].y.value = point.y.value;
          pointsDist[1].x.value = points[1].x.value / 0.9;
          pointsDist[1].y.value = points[1].y.value / 0.9;
        }
        if (index == 1 && !showDist) {
          pointsDist[0].x.value = points[0].x.value;
          pointsDist[0].y.value = points[0].y.value;
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
          canvasSize.offsetX,
          canvasSize.width + canvasSize.offsetX - 20,
        );
        point.y.value = clamp(
          point.prevY.value + event.translationY,
          0,
          canvasSize.height - 20,
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
    const inches = data.distance?.value ? data.distance?.value : '0';
    const fraction = data.distance?.fraction ? data.distance?.fraction : '0';
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
        <View style={{ width: '100%', alignItems: 'flex-end' }}>
          <View
            style={{
              backgroundColor: '#7e22ce',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`R1: +${inches()}`}
            />
          </View>
        </View>
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
          stroke="#7e22ce"
          strokeWidth="5"
          strokeDasharray={[10, 5]}
        />
      ))}
      {showDist && (
        <>
          <Animated.View style={[styles.box3, animatedInfoDist]}>
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`RD1: ${inchesDist()}`}
            />
          </Animated.View>
          {!locked
            ? pointsDist.map((_, i) => (
                <GestureDetector key={`pan-${i}`} gesture={panGesturesDist[i]}>
                  <Animated.View
                    style={[
                      styles.box,
                      { backgroundColor: i == 1 ? '#8B5DF6' : '#fff' },
                      animatedStylesDist[i],
                    ]}
                  />
                </GestureDetector>
              ))
            : null}
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
    position: 'absolute',
    alignItems: 'center',
  },
  box3: {
    position: 'absolute',
    backgroundColor: '#7e22ce',
    alignItems: 'center',
  },
});

export default RakeTool;
