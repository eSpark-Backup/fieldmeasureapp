import { View, Text, TextStyle, ColorValue } from 'react-native';
import React from 'react';
import { textColor } from '../../constants/colors';

const TheText = ({
  text,
  color = textColor,
  style,
  size,
  onPress,
}: {
  text: string;
  color?: ColorValue;
  style?: TextStyle;
  size?: number;
  onPress?: () => void;
}) => {
  return (
    <Text style={[style, { fontSize: size, color }]} onPress={onPress}>
      {text}
    </Text>
  );
};

export default TheText;
