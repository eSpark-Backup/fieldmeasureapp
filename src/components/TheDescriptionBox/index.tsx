import React from 'react';
import { View, Text, TextInput, StyleSheet, TextStyle } from 'react-native';
import { background, border, WhiteBackground } from '../../constants/colors';

const TheDescriptionBox = ({
  label = 'Notes',
  placeholder = 'Additional notes and details',
  value,
  focus,
  onChangeText,
  onChangeFocus,
  textStyle,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  focus?: boolean;
  onChangeText: (text: string) => void;
  onChangeFocus: (focus: boolean) => void;
  textStyle?: TextStyle;
}) => {
  console.log('Desc focus', focus);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>{label}</Text> */}
      <TextInput
        style={[
          styles.textarea,
          textStyle,
          {
            borderColor: focus ? '#2975D2' : border,
            borderWidth: focus ? 2 : 1,
          },
        ]}
        multiline
        numberOfLines={6}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onFocus={() => onChangeFocus(true)}
        onBlur={() => onChangeFocus(false)}
        onChangeText={onChangeText}
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  textarea: {
    borderColor: border, // tailwind gray-300
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: background,
    height: 100,
  },
});

export default TheDescriptionBox;
