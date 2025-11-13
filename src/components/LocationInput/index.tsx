import { View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import TheTextInput from '../TheTextInput';
import { useKeyboard } from '../../utils/KeyboardContext';
import { TextInput } from 'react-native-gesture-handler';

const LocationInput = ({
  location,
  onLocChange,
  id,
}: {
  location: string;
  onLocChange: (loc: string) => void;
  id: string;
}) => {
  const inputRef = useRef<TextInput>(null);
  const {
    registerInput,
    setActiveInputId,
    activeInputId,
    currentValue,
    showKeyboard,
  } = useKeyboard();

  useEffect(() => {
    if (inputRef.current) {
      registerInput(id, inputRef.current);
    }
  }, [id, registerInput]);

  // When this input becomes active, update its value when keyboard changes
  useEffect(() => {
    if (activeInputId === id) {
      onLocChange(currentValue);
    }
  }, [currentValue, activeInputId, id]);

  return (
    <View>
      <TheTextInput
        ref={inputRef}
        label="Location"
        placeholder="Living Room"
        value={location}
        onChange={onLocChange}
        required
        showSoftInputOnFocus={false}
        onFocus={() => {
          setActiveInputId(id);
          showKeyboard(location, undefined, true);
        }}
      />
    </View>
  );
};

export default LocationInput;
