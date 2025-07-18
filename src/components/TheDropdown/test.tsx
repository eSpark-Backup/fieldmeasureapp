import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  LayoutRectangle,
  Pressable,
} from 'react-native';
import TheText from '../TheText';
import { background, border, lightBackground } from '../../constants/colors';

type Option = {
  label: string;
  value: string;
};

type DropdownProps = {
  label: string;
  options: Option[];
  placeholder: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  required?: boolean;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  placeholder,
  selectedValue,
  onValueChange,
  required = false,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(
    null,
  );
  const dropdownRef = useRef<View>(null);

  const handleSelect = useCallback(
    (value: string) => {
      onValueChange(value);
      setDropdownVisible(false);
    },
    [onValueChange],
  );

  const selectedLabel =
    options.find(option => option.value === selectedValue)?.label ||
    placeholder;

  const handleDropdownPress = useCallback(() => {
    dropdownRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownVisible(true);
    });
  }, []);

  const renderOption = useCallback(
    ({ item }: { item: Option }) => (
      <TouchableOpacity
        style={styles.optionItem}
        onPress={() => handleSelect(item.value)}
      >
        <TheText text={item.label} style={styles.optionText} />
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <TheText style={styles.label} text={label} />
        {required && <TheText style={styles.required} text=" *" />}
      </View>
      <TouchableOpacity
        ref={dropdownRef}
        onPress={handleDropdownPress}
        style={styles.dropdown}
        activeOpacity={0.8}
      >
        <TheText
          style={selectedValue ? styles.selectedText : styles.placeholderText}
          text={selectedLabel}
        />
      </TouchableOpacity>
      {dropdownVisible && (
        <Pressable
          style={styles.overlay}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownList}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={renderOption}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  required: {
    color: 'red',
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: border,
    borderRadius: 5,
    backgroundColor: lightBackground,
    padding: 10,
  },
  placeholderText: {
    color: '#999',
  },
  selectedText: {
    color: '#000',
    paddingLeft: 5,
  },
  overlay: {
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#2c2c2c',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    width: '99%',
    maxHeight: 300,
    alignSelf: 'center',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 16,
  },
});

export default Dropdown;
