import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ColorValue,
  StyleProp,
} from 'react-native';
import React, { JSX } from 'react';
import TheText from '../TheText';
import { primaryColor, WhiteBackground } from '../../constants/colors';

const TheButton = ({
  btnTitle,
  icon,
  style,
  btnColor,
  titleColor,
  titleStyle,
  onPress,
  disabled,
}: {
  btnTitle: string;
  icon?: JSX.Element;
  style?: StyleProp<ViewStyle>;
  btnColor?: ColorValue;
  titleColor?: ColorValue;
  titleStyle?: TextStyle;
  onPress?: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        { backgroundColor: btnColor ? btnColor : primaryColor },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      {btnTitle ? (
        <TheText
          size={16}
          color={titleColor ? titleColor : WhiteBackground}
          style={titleStyle}
          text={btnTitle}
        />
      ) : null}
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
    backgroundColor: primaryColor,
    borderRadius: 5,
    gap: 5,
  },
});

export default TheButton;
