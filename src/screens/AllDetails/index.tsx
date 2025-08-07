import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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

const AllDetails = () => {
  const [selectedValues, setSelectedValues] = useState(
    () => tempMeasure?.selectedValues || generateInitialValues(),
  );
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({
    curbHeight: '10',
    doorWidth: '10',
    doorHeight: '10',
  });
  const navigation = useNavigation();
  const { setTempMeasure, tempMeasure } = useProjectStore();

  const handleSelect = useCallback((key: string, value: string) => {
    setSelectedValues((prev: any) => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

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
      navigation.goBack(); // 👈 Go back to MeasurementScreen
    } else {
      console.log('Validation Errors:', newErrors);
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
        <TheDatePicker label="Date promised" value={''} onChange={date => {}} />
        <GapView length={25} mode="vertical" />
        <TheButton btnTitle="Done" onPress={handleSubmit} />
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
