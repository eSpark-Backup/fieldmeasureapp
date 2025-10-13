import { View, Text, TextStyle, ColorValue, TextProps } from 'react-native';
import React from 'react';
import { textColor } from '../../constants/colors';

interface TheTextProps extends TextProps {
  text: string;
  color?: ColorValue;
  style?: TextStyle;
  size?: number;
  onPress?: () => void;
  numberOfLines?: number;
}

const TheText: React.FC<TheTextProps> = ({
  text,
  color = textColor,
  style,
  size,
  onPress,
  numberOfLines,
  ...props
}) => {
  return (
    <Text
      style={[style, { fontSize: size, color }]}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...props}
    >
      {text}
    </Text>
  );
};

export default TheText;
