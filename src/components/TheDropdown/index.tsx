import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  StyleProp,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import TheText from '../TheText';
import { background, border, lightBackground } from '../../constants/colors';

import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import TheTextInput from '../TheTextInput';

interface DropdownItem {
  label: string;
  value: string;
}

interface DropdownProps {
  data: (string | DropdownItem)[];
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
  disabled?: boolean;
}

const TheDropdown: React.FC<DropdownProps> = ({
  data,
  onSelect,
  placeholder = 'Select option',
  zIndex = 10,
  style,
  title,
  id,
  selected,
  required,
  isOpen,
  setOpenDropdownId,
  error,
  containerStyle,
  disabled,
}) => {
  const [selectedItem, setSelectedItem] = useState(selected ?? '');
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const triggerRef = React.useRef<View>(null);

  useEffect(() => {
    setSelectedItem(selected ?? '');
  }, [selected]);

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({
          top: y + height,
          left: x,
          width: width,
        });
        setOpenDropdownId(id);
      });
    } else {
      setOpenDropdownId(null);
    }
  };

  const handleSelection = useCallback(
    (item: string | DropdownItem) => {
      const value = typeof item === 'string' ? item : item.value;
      setSelectedItem(value);
      setOpenDropdownId(null); // Close after selection
      onSelect({ key: id, value });
    },
    [id, onSelect, setOpenDropdownId],
  );

  const getLabel = (value: string) => {
    const item = data.find(i => {
      if (typeof i === 'string') return i === value;
      return i.value === value;
    });
    if (!item) return value;
    return typeof item === 'string' ? item : item.label;
  };

  const renderOptions = useMemo(
    () =>
      data.map((item, index) => {
        const label = typeof item === 'string' ? item : item.label;
        const value = typeof item === 'string' ? item : item.value;
        return (
          <TouchableOpacity
            key={value}
            style={[
              styles.optionItem,
              { borderColor: border },
              index > 0 && styles.optionItemBorder,
            ]}
            onPress={() => handleSelection(item)}
          >
            <TheText text={label} />
            {selectedItem === value && (
              <FeatherIcon name="check" size={16} color="#34e145" />
            )}
          </TouchableOpacity>
        );
      }),
    [data, handleSelection, selectedItem],
  );

  return (
    <View style={containerStyle}>
      <View style={styles.labelRow}>
        {title && <TheText style={styles.label} text={title} />}
        {required && <TheText style={styles.required} text=" *" />}
      </View>
      <View style={style} ref={triggerRef} collapsable={false}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={disabled}
          onPress={handleToggle}
          style={{ justifyContent: 'center' }}
        >
          <TheTextInput
            value={getLabel(selectedItem) || placeholder}
            style={[styles.inputStyle, style]}
            editable={false}
          />
          {disabled ? null : (
            <EntypoIcon
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              color={'#66666666'}
              size={16}
              style={{ position: 'absolute', right: 15 }}
            />
          )}
        </TouchableOpacity>

        {error ? (
          <TheText
            color={'red'}
            text={error}
            style={styles.errorText}
            size={10}
          />
        ) : null}

        <Modal
          visible={isOpen}
          transparent={true}
          animationType="none"
          onRequestClose={() => setOpenDropdownId(null)}
        >
          <TouchableWithoutFeedback onPress={() => setOpenDropdownId(null)}>
            <View style={styles.modalBackdrop}>
              <View
                style={[
                  styles.dropdownListWrapper,
                  {
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                    zIndex,
                  },
                ]}
              >
                <ScrollView
                  style={{
                    backgroundColor: background,
                    maxHeight: 200,
                  }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  {data.length > 0 ? (
                    renderOptions
                  ) : (
                    <TheText
                      text={'No ' + title + ' available'}
                      style={{ textAlign: 'center', paddingVertical: 10 }}
                    />
                  )}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.02)', // Nearly invisible back drop
  },
  dropdownListWrapper: {
    position: 'absolute',
    borderWidth: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    overflow: 'hidden',
    borderColor: border,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
