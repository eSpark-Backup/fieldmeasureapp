import {
  View,
  TextInput,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import TheText from '../TheText';

const TheTextInput = ({
  label,
  value,
  placeholder,
  onChange,
  style,
  containerStyle,
  secureTextEntry,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}) => {
  return (
    <View style={containerStyle}>
      <TheText
        style={{ fontWeight: '500', paddingBottom: 5, fontSize: 16 }}
        text={label}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#9E9E9E'}
        value={value}
        style={[styles.inputStyle, style]}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    color: '#000',
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default TheTextInput;
