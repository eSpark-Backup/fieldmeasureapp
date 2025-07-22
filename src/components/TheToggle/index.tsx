import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Animated,
  TouchableOpacity,
  View,
  DimensionValue,
} from 'react-native';
import {
  background,
  border,
  primaryColor,
  WhiteBackground,
} from '../../constants/colors';

interface IAnimatedButton {
  value: boolean;
  onValueChange: (value: boolean) => void;
  large?: boolean;
}

export const TheToggle = ({
  value,
  onValueChange,
  large = false,
}: IAnimatedButton) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  const handleOnPress = () => {
    Animated.timing(animatedValue, {
      toValue: value ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onValueChange(!value);
    });
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0, // Move to 1 for true, 0 for false
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: large ? [0, 1] : [0, 1],
    outputRange: large ? [0, 53] : [0, 18],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleOnPress}>
      <View
        style={
          Boolean(value)
            ? [
                styles.switchContainerActive,
                large && { width: 100, height: 30 },
              ]
            : [styles.switchContainer, large && { width: 100, height: 30 }]
        }
      >
        <Animated.View
          style={[
            styles.switchHandle,
            { transform: [{ translateX }] },
            large && { width: 35, height: 20, marginLeft: '5%' },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};
export default TheToggle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 35,
    height: 18,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: border,
    borderRadius: 20,
    backgroundColor: border,
  },
  switchContainerActive: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 35,
    height: 18,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: border,
    borderRadius: 20,
    backgroundColor: primaryColor,
  },
  switchHandle: {
    width: 14,
    height: 14,
    borderRadius: 15,
    backgroundColor: WhiteBackground,
  },
});
