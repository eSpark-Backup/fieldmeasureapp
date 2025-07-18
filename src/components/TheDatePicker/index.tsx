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

const TheTextInput = ({
  label,
  containerStyle,
  style,
}: {
  label: string;
  containerStyle?: ViewStyle;
  style?: TextStyle;
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={containerStyle}>
      <TheText style={{ fontWeight: '500' }} text={label} />
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
    color: '#000',
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default TheTextInput;
