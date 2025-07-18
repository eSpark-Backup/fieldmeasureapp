import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TheDropdown } from '../../components';
import { background } from '../../constants/colors';
import { DROPDOWNS } from '../../constants';

const generateInitialValues = () => {
  const initialValues: { [key: string]: string } = {};
  DROPDOWNS.forEach(drop => {
    initialValues[drop.id] = drop.selected || '';
  });
  return initialValues;
};

const AllDetails = () => {
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>(generateInitialValues());
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleSelect = (key: string, value: string) => {
    setSelectedValues(prev => ({ ...prev, [key]: value }));
    console.log(`Selected from ${key}: ${value}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 15 }}>
          {DROPDOWNS.map(({ data, placeholder, title, id }, idx) => (
            <TheDropdown
              key={id}
              data={data}
              placeholder={placeholder}
              title={title}
              id={id}
              selected={selectedValues[id]}
              onSelect={({ key, value }) => handleSelect(key, value)}
              required
              isOpen={openDropdownId === id}
              setOpenDropdownId={setOpenDropdownId}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
    justifyContent: 'flex-start',
  },
});

export default AllDetails;
