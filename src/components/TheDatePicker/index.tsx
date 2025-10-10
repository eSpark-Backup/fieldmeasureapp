import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import DatePicker from 'react-native-modal-datetime-picker';
import TheText from '../TheText';
import { border } from '../../constants/colors';

interface TheDatePickerProps {
  label?: string;
  required?: boolean;
  value?: string | Date | null;
  onChange?: (date: Date) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
}

const TheDatePicker: React.FC<TheDatePickerProps> = ({
  label,
  required,
  value,
  onChange,
  containerStyle,
  inputStyle,
  error,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toDateString();
  };

  return (
    <View style={containerStyle}>
      {(label || required) && (
        <View style={styles.labelRow}>
          {label && <TheText style={styles.label} text={label} />}
          {required && <TheText style={styles.required} text=" *" />}
        </View>
      )}

      <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker(true)}>
        <TextInput
          value={formatDate(value ?? null)}
          style={[styles.inputStyle, inputStyle]}
          editable={false}
          placeholder="Select date"
          placeholderTextColor="#888"
        />
      </TouchableOpacity>

      <DatePicker
        isVisible={showPicker}
        mode="date"
        onConfirm={date => {
          setShowPicker(false);
          onChange?.(date);
        }}
        onCancel={() => setShowPicker(false)}
      />

      {error ? (
        <TheText text={error} color="red" style={styles.errorText} size={10} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: { fontWeight: '500', fontSize: 16 },
  required: { fontSize: 16, color: 'red' },
  inputStyle: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderColor: border,
    borderWidth: 1,
    borderRadius: 5,
  },
  errorText: {
    paddingTop: 4,
    textAlign: 'right',
  },
});

export default TheDatePicker;
