import { View, Text, TextStyle } from 'react-native';
import React from 'react';

const TheText = ({
  text,
  style,
  size,
}: {
  text: string;
  style?: TextStyle;
  size?: number;
}) => {
  return <Text style={[style, { fontSize: size }]}>{text}</Text>;
};

export default TheText;
