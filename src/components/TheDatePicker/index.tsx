import {
  View,
  TextInput,
  TextStyle,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import TheText from '../TheText';
import DatePicker from 'react-native-modal-datetime-picker';
import { border } from '../../constants/colors';

const TheTextInput = ({
  label,
  containerStyle,
  style,
  required,
}: {
  label: string;
  containerStyle?: ViewStyle;
  style?: TextStyle;
  required?: boolean;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={containerStyle}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
        }}
      >
        {label && <TheText style={styles.label} text={label} />}
        {required && <TheText style={styles.required} text=" *" />}
      </View>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setShowPicker(true)}>
        <TextInput
          value={selectedDate.toLocaleDateString('en-GB')}
          style={[styles.inputStyle, style]}
          editable={false}
        />
      </TouchableOpacity>
      <DatePicker
        isVisible={showPicker}
        mode="date"
        onConfirm={date => {
          setShowPicker(false);
          setSelectedDate(date);
        }}
        onCancel={() => setShowPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderColor: border,
    borderWidth: 1,
    borderRadius: 5,
  },
  label: { fontWeight: '500', fontSize: 16 },
  required: {
    fontSize: 16,
  },
});

export default TheTextInput;
