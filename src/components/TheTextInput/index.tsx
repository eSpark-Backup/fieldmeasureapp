import {
  View,
  TextInput,
  TextStyle,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import TheText from '../TheText';
import { border } from '../../constants/colors';

const TheTextInput = ({
  label,
  value,
  placeholder,
  style,
  containerStyle,
  secureTextEntry,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  onChange?: (text: string) => void;
  onBlur?: (e: any) => void;
  error?: string;
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
        onBlur={onBlur}
      />

      {error ? (
        <TheText text={error} style={styles.errorText} size={10} />
      ) : (
        <TheText text={''} style={styles.errorText} size={10} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    color: '#000',
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderColor: border,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: 'red',

    paddingTop: 4,
    textAlign: 'right',
  },
});

export default TheTextInput;
