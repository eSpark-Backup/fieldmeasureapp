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
import { formatInches, formatInchesSum } from './utils';

const { width, height } = Dimensions.get('screen');
const AnimatedLine = Animated.createAnimatedComponent(SVGLine);

const CornerTool = ({
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
  data: Record<
    | 'TopLA'
    | 'TopLB'
    | 'TopRA'
    | 'TopRB'
    | 'RightA'
    | 'RightB'
    | 'CenterA'
    | 'CenterB'
    | 'LeftA'
    | 'LeftB'
    | 'BotLA'
    | 'BotLB'
    | 'BotRA'
    | 'BotRB',
    MeasurementPair
  >;
  locked?: boolean;
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
  const bottomLeftStyle = animatedInfo(points[1], points[2]);
  const bottomRightStyle = animatedInfo(points[2], points[3]);
  const rightStyle = animatedInfo(points[3], points[4]);
  const topRightStyle = animatedInfo(points[4], points[5]);
  const topLeftStyle = animatedInfo(points[5], points[0]);
  const centerStyle = animatedInfo(points[2], points[5]);

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
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`LA: ${formatInches(data.LeftA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.LeftA, data.LeftB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`LB: ${formatInches(data.LeftB)}`}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, bottomLeftStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`BLA: ${formatInches(data.BotLA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.BotLA, data.BotLB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`BLB: ${formatInches(data.BotLB)}`}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, bottomRightStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`BRA: ${formatInches(data.BotRA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.BotRA, data.BotRB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`BRB: ${formatInches(data.BotRB)}`}
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
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`RA: ${formatInches(data.RightA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.RightA, data.RightB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`RB: ${formatInches(data.RightB)}`}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, topRightStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`TRA: ${formatInches(data.TopRA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.TopRA, data.TopRB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`TRB: ${formatInches(data.TopRB)}`}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, topLeftStyle]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`TLA: ${formatInches(data.TopLA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.TopLA, data.TopLB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`TLB: ${formatInches(data.TopLB)}`}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View style={[styles.box2, centerStyle]}>
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            width: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`CA: ${formatInches(data.CenterA)}`}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={formatInchesSum(data.CenterA, data.CenterB)}
            />
          </View>
          <View
            style={{
              backgroundColor: '#ca5056ff',
              paddingHorizontal: 10,
              alignItems: 'center',
            }}
          >
            <TheText
              size={14 * (2 / scaleValue / 2)}
              color={WhiteBackground}
              text={`CB: ${formatInches(data.CenterB)}`}
            />
          </View>
        </View>
      </Animated.View>
      {!locked
        ? points.map((_, i) => (
            <GestureDetector key={`point-${i}`} gesture={panGestures[i]}>
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
    // backgroundColor: '#ca5056ff',
    // borderRadius: 5,
    // borderWidth: 1,
    position: 'absolute',
  },
});

export default CornerTool;
