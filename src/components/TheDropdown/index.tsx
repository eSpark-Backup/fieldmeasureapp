import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  ViewStyle,
  StyleProp,
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
}) => {
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(selected ?? '');

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
            { borderColor: border, height },
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
    [data, handleSelection, height, selectedItem],
  );

  return (
    <View>
      {title && (
        <View style={styles.labelRow}>
          <TheText style={styles.label} text={title} />
          {required && <TheText style={styles.required} text=" *" />}
        </View>
      )}

      <View style={[style, { height }]}>
        <Pressable
          style={[styles.dropdownButton, { height, borderColor: border }]}
          onPress={handleToggle}
        >
          <TheText
            text={selectedItem || placeholder}
            style={{
              color: selectedItem ? '#000' : '#969696',
            }}
          />
          <EntypoIcon
            name={show ? 'chevron-up' : 'chevron-down'}
            color={'#66666666'}
            size={16}
          />
        </Pressable>

        {isOpen && (
          <View style={[styles.dropdownListWrapper, { zIndex }]}>
            <ScrollView
              style={{
                backgroundColor: background,
                maxHeight: data.length > 4 ? 150 : undefined,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
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
    top: '100%',
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
    paddingHorizontal: 10,
  },
  optionItemBorder: {
    borderTopWidth: 0.5,
  },
});

export default TheDropdown;
