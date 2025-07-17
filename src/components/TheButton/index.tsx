import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import React, { JSX } from 'react';
import TheText from '../TheText';

const TheButton = ({
  btnTitle,
  icon,
  style,
  btnColor,
  titleColor,
  titleStyle,
  onPress,
}: {
  btnTitle: string;
  icon?: JSX.Element;
  style?: ViewStyle;
  btnColor?: string;
  titleColor?: string;
  titleStyle?: TextStyle;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        { backgroundColor: btnColor ? btnColor : '#2975D2' },
      ]}
      onPress={onPress}
    >
      {icon}
      <TheText
        size={16}
        style={{ color: titleColor ? titleColor : 'white', ...titleStyle }}
        text={btnTitle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: '#2975D2',
    borderRadius: 5,
    gap: 5,
  },
});

export default TheButton;
