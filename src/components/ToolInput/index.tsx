import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  StyleProp,
} from 'react-native';

import TheText from '../TheText';
import { background, border, lightBackground } from '../../constants/colors';

import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import TheTextInput from '../TheTextInput';

interface DropdownProps {
  data: string[];
  label?: string;
  placeholder?: string;
  zIndex?: number;
  onSelect: ({ key, value }: { key: string; value: string }) => void;
  style?: StyleProp<ViewStyle>;
  placeholderColor?: string;
  bgColor?: string;
  id: string;
  selected?: string | null;
  dInches?: string | null;
  isOpen: boolean;
  setOpenDropdownId: (id: string | null) => void;
  error?: string;
  containerStyle?: ViewStyle;
}

const ToolInput: React.FC<DropdownProps> = ({
  data,
  label,
  onSelect,
  placeholder = 'Select option',
  zIndex = 10,
  style,
  id,
  selected,
  dInches,
  isOpen,
  setOpenDropdownId,
  error,
  containerStyle,
}) => {
  const [inches, setInches] = useState(dInches ?? '');
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
    <View
      style={[
        containerStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}
    >
      {label && <TheText text={`${label}:`} />}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 15,
        }}
      >
        <TheTextInput
          placeholder={inches || '0'}
          style={{ width: 70 }}
          isNum={true}
          onChange={e => setInches(e)}
        />
        <TheText text="in" size={16} />
        <View style={[style, {}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggle}
            style={{ justifyContent: 'center' }}
          >
            <TheTextInput
              value={selectedItem || placeholder}
              style={[styles.inputStyle, style]}
              editable={false}
            />
            <EntypoIcon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              color={'#66666666'}
              size={16}
              style={{ position: 'absolute', right: 5 }}
            />
          </TouchableOpacity>
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

export default ToolInput;
