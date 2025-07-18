import { View, Text, TextStyle } from 'react-native';
import React from 'react';

const TheText = ({
  text,
  style,
  size,
  onPress,
}: {
  text: string;
  style?: TextStyle;
  size?: number;
  onPress?: () => void;
}) => {
  return (
    <Text style={[style, { fontSize: size }]} onPress={onPress}>
      {text}
    </Text>
  );
};

export default TheText;
