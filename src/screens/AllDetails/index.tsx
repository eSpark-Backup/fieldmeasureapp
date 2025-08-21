import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  GapView,
  TheButton,
  TheDatePicker,
  TheDropdown,
  TheTextInput,
} from '../../components';
import { background } from '../../constants/colors';
import { DROPDOWNS, INPUT_FIELDS } from '../../constants';
import { useNavigation } from '@react-navigation/native';
import { validateDecimal } from '../../constants/validations/schema';
import TheDescriptionBox from '../../components/TheDescriptionBox';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProjectStore } from '../../store/ProjectsStore';

const generateInitialValues = () =>
  Object.fromEntries(DROPDOWNS.map(drop => [drop.id, drop.selected || '']));

const initialInputs = {
  curbHeight: '10',
  doorWidth: '10',
  doorHeight: '10',
};

const AllDetails = () => {
  const [selectedValues, setSelectedValues] = useState(
    () => tempMeasure?.selectedValues || generateInitialValues(),
  );
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: string }>(
    initialInputs,
  );
  const navigation = useNavigation();
  const { setTempMeasure, tempMeasure } = useProjectStore();

  const skipPromptRef = useRef(false);

  const handleSelect = useCallback((key: string, value: string) => {
    setSelectedValues((prev: any) => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const stateRef = useRef({
    selectedValues,
    inputs,
    description,
  });

  useEffect(() => {
    stateRef.current = {
      selectedValues,
      inputs,
      description,
    };
  }, [selectedValues, inputs, description]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (skipPromptRef.current) {
        // ✅ reset so it doesn’t skip next time
        skipPromptRef.current = false;
        return;
      }

      const { selectedValues, inputs, description } = stateRef.current;

      if (
        !tempMeasure &&
        JSON.stringify(selectedValues) ==
          JSON.stringify(generateInitialValues()) &&
        inputs == initialInputs &&
        description == ''
      ) {
        navigation.dispatch(e.data.action);
        return;
      } else if (
        tempMeasure &&
        JSON.stringify(selectedValues) ==
          JSON.stringify(tempMeasure.selectedValues) &&
        inputs == tempMeasure.inputs &&
        description == tempMeasure.description
      ) {
        navigation.dispatch(e.data.action);
        return;
      }

      e.preventDefault();
      Alert.alert(
        'Save Changes?',
        'Would you like to save your measurements before leaving?',
        [
          {
            text: "Don't Save",
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action),
          },
          {
            text: 'Save',
            style: 'default',
            onPress: () => {
              const saved = handleSubmit();
              if (saved) {
                navigation.dispatch(e.data.action);
              } else {
                skipPromptRef.current = false;
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    });

    return unsubscribe;
  }, [navigation, selectedValues]);

  const handleSaveAndGoBack = () => {
    skipPromptRef.current = true;
    const saved = handleSubmit();
    if (saved) {
      navigation.goBack();
    } else {
      skipPromptRef.current = false;
    }
  };

  const handleSubmit = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    DROPDOWNS.forEach(({ id, title }) => {
      if (!selectedValues[id]) newErrors[id] = `${title} is required`;
    });

    INPUT_FIELDS.forEach(({ field, label }) => {
      const value = inputs[field];
      if (!value) newErrors[field] = `${label} is required`;
      else if (!validateDecimal(value))
        newErrors[field] = `${label} must be a valid decimal`;
    });

    setErrors(newErrors);

    if (!Object.keys(newErrors).length) {
      const tempData = {
        selectedValues,
        inputs,
        description,
        timestamp: Date.now(), // optional, can help with sorting
      };

      setTempMeasure(tempData);
      return true;
      // navigation.goBack(); // 👈 Go back to MeasurementScreen
    } else {
      console.log('Validation Errors:', newErrors);
      return false;
    }
  }, [selectedValues, inputs, description, navigation, setTempMeasure]);

  useEffect(() => {
    if (tempMeasure) {
      console.log('🌟 Temp measure loaded:', tempMeasure);

      if (tempMeasure.selectedValues) {
        setSelectedValues(tempMeasure.selectedValues);
      }

      if (tempMeasure.inputs) {
        setInputs(tempMeasure.inputs);
      }

      if (tempMeasure.description) {
        setDescription(tempMeasure.description);
      }
    }
  }, []);

  useEffect(() => {
    console.log('🌟 Selected values:', selectedValues);
    console.log('🌟 Inputs:', inputs);
  }, [selectedValues, inputs]);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View>
          <TheDescriptionBox
            value={description}
            onChangeText={setDescription}
            placeholder="Additional notes and details"
            textStyle={{ color: '#000' }}
          />
          {DROPDOWNS.map(({ data, placeholder, title, id }) => (
            <TheDropdown
              key={id}
              data={data}
              placeholder={placeholder}
              title={title}
              id={id}
              selected={
                data.find(option => option === selectedValues[id]) || null
              }
              onSelect={({ key, value }) => handleSelect(key, value)}
              required
              isOpen={openDropdownId === id}
              setOpenDropdownId={setOpenDropdownId}
              error={errors[id]}
            />
          ))}
        </View>

        {INPUT_FIELDS.map(({ label, field, placeholder }) => (
          <TheTextInput
            key={field}
            label={label}
            required
            value={inputs[field]}
            onChange={text => handleInputChange(field, text)}
            error={errors[field]}
            isNum
            placeholder={placeholder}
          />
        ))}
        <TheDatePicker
          label="Date promised"
          style={{ color: '#000' }}
          value={''}
          containerStyle={{}}
          onChange={date => {}}
        />
        <GapView length={25} mode="vertical" />
        <TheButton btnTitle="Done" onPress={handleSaveAndGoBack} />
        <GapView length={useSafeAreaInsets().bottom} mode="vertical" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
});

export default AllDetails;
