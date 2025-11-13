import React, { forwardRef, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TextStyle } from 'react-native';
import { background, border, WhiteBackground } from '../../constants/colors';
import { useKeyboard } from '../../utils/KeyboardContext';

interface DescriptionBoxProps {
  label?: string;
  placeholder?: string;
  value?: string;
  focus?: boolean;
  onChangeText: (text: string) => void;
  onChangeFocus?: (focus: boolean) => void;
  textStyle?: TextStyle;
  showSoftInputOnFocus?: boolean;
  id?: string;
}

const TheDescriptionBox = forwardRef<TextInput, DescriptionBoxProps>(
  (
    {
      id,
      label = 'Notes',
      placeholder = 'Additional notes and details',
      value,
      focus,
      onChangeText,
      onChangeFocus,
      textStyle,
      showSoftInputOnFocus,
    },
    ref, // 👈 ref comes from parent
  ) => {
    const {
      registerInput,
      setActiveInputId,
      activeInputId,
      currentValue,
      showKeyboard,
    } = useKeyboard();

    // Register the input ref when it's available
    const handleRef = useCallback(
      (inputRef: TextInput | null) => {
        if (inputRef && id) {
          registerInput(id, inputRef);
        }
        // Forward the ref
        if (typeof ref === 'function') {
          ref(inputRef);
        } else if (ref) {
          ref.current = inputRef;
        }
      },
      [id, registerInput, ref],
    );

    useEffect(() => {
      // Only update if this input is active
      if (activeInputId === id) {
        onChangeText(currentValue);
      }
    }, [currentValue, activeInputId, id]);

    return (
      <View style={styles.container}>
        {/* <Text style={styles.label}>{label}</Text> */}
        <TextInput
          ref={handleRef}
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
          onFocus={() => {
            onChangeFocus?.(true);
            if (showSoftInputOnFocus === false) {
              setActiveInputId(id!);
              showKeyboard(value, undefined, true);
            }
          }}
          onBlur={() => {
            onChangeFocus?.(false);
            if (activeInputId === id) {
              setActiveInputId(null);
            }
          }}
          onChangeText={onChangeText}
          textAlignVertical="top"
          showSoftInputOnFocus={showSoftInputOnFocus}
        />
      </View>
    );
  },
);

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
    color: '#000',
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
