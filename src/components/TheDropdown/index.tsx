import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  ViewStyle,
  StyleProp,
  TextInput,
} from 'react-native';

import TheText from '../TheText';
import { background, border, lightBackground } from '../../constants/colors';

import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';

interface DropdownProps {
  data: string[];
  placeholder?: string;
  zIndex?: number;
  onSelect: ({ key, value }: { key: string; value: string }) => void;
  style?: StyleProp<ViewStyle>;
  placeholderColor?: string;
  height?: number;
  title?: string;
  bgColor?: string;
  id: string;
  selected?: string | null;
  required?: boolean;
  isOpen: boolean;
  setOpenDropdownId: (id: string | null) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

const TheDropdown: React.FC<DropdownProps> = ({
  data,
  onSelect,
  placeholder = 'Select option',
  zIndex = 10,
  style,
  height = 40,
  title,
  id,
  selected,
  required,
  isOpen,
  setOpenDropdownId,
  error,
  containerStyle,
}) => {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selected ?? '');

  useEffect(() => {
    setSelectedItem(selected ?? '');
  }, [selected]);

  const handleToggle = () => {
    setOpenDropdownId(isOpen ? null : id);
  };

  const handleSelection = useCallback(
    (item: string) => {
      setSelectedItem(item);
      setOpenDropdownId(null); // Close after selection
      onSelect({ key: id, value: item });
    },
    [id, onSelect, setOpenDropdownId],
  );

  const renderOptions = useMemo(
    () =>
      data.map((item, index) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.optionItem,
            { borderColor: border },
            index > 0 && styles.optionItemBorder,
          ]}
          onPress={() => handleSelection(item)}
        >
          <TheText text={item} />
          {selectedItem === item && (
            <FeatherIcon name="check" size={16} color="#34e145" />
          )}
        </TouchableOpacity>
      )),
    [data, handleSelection, selectedItem],
  );

  return (
    <View style={containerStyle}>
      <View style={styles.labelRow}>
        {title && <TheText style={styles.label} text={title} />}
        {required && <TheText style={styles.required} text=" *" />}
      </View>

      <View style={[style, {}]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggle}
          style={{ justifyContent: 'center' }}
        >
          <TextInput
            value={selectedItem || placeholder}
            style={[styles.inputStyle, style]}
            editable={false}
          />
          <EntypoIcon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            color={'#66666666'}
            size={16}
            style={{ position: 'absolute', right: 15 }}
          />
        </TouchableOpacity>
        {/* <Pressable
          style={[styles.dropdownButton, { borderColor: border }]}
          onPress={handleToggle}
        >
          <TheText
            text={selectedItem || placeholder}
            color={selectedItem ? '#000' : '#969696'}
            size={16}
          />
          <EntypoIcon
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            color={'#66666666'}
            size={16}
          />
        </Pressable> */}
        {error ? (
          <TheText
            color={'red'}
            text={error}
            style={styles.errorText}
            size={10}
          />
        ) : null}

        {/* {renderOptions} */}
        {isOpen && (
          <View
            style={[
              styles.dropdownListWrapper,
              { top: error ? '70%' : '90%', zIndex },
            ]}
          >
            <ScrollView
              style={{
                backgroundColor: background,
                maxHeight: 150,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {renderOptions}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  required: {
    fontSize: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: border,
    borderRadius: 5,
    backgroundColor: lightBackground,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownListWrapper: {
    position: 'absolute',
    top: '90%',
    width: '100%',
    borderWidth: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
    borderColor: border,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  optionItemBorder: {
    borderTopWidth: 0.5,
  },
  errorText: {
    color: 'red',
    paddingTop: 4,
    textAlign: 'right',
  },
  inputStyle: {
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 15,
    backgroundColor: '#F5F5F5',
    borderColor: border,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default TheDropdown;
