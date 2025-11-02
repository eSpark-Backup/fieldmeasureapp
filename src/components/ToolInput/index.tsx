import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  forwardRef,
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ViewStyle,
  StyleProp,
  TextInput,
} from 'react-native';

import TheText from '../TheText';
import { background, border, lightBackground } from '../../constants/colors';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import TheTextInput from '../TheTextInput';
import { fractionalInches } from '../../constants';
import { MeasurementPair } from '../../types';
import { Warn } from '../../assets';

interface DropdownProps {
  label?: string;
  placeholder?: string;
  zIndex?: number;
  onSelect?: ({ key, value }: { key: string; value: string }) => void;
  onChange: (pair: MeasurementPair) => void;
  style?: StyleProp<ViewStyle>;
  placeholderColor?: string;
  bgColor?: string;
  id: string;
  selected?: string | null;
  showWarn?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  pair: MeasurementPair;
  isLocked?: boolean;
}

const ToolInput = forwardRef<TextInput, DropdownProps>(
  (
    {
      label,
      onSelect,
      onChange,
      placeholder = 'Select option',
      zIndex = 10,
      style,
      id,
      selected,
      showWarn,
      error,
      containerStyle,
      pair,
      isLocked = false,
    },
    ref, // 👈 ref comes from parent
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    // useEffect(() => {
    //   setSelectedItem(selected ?? '');
    // }, [selected]);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    const handleSelection = (item: string) => {
      console.log('pair kia fraction', pair);
      // setSelectedItem(item);
      setIsOpen(false);
      onSelect?.({ key: id, value: item });
      onChange({ ...pair, fraction: item });
    };

    const renderOptions = () => {
      return fractionalInches.map((item, index) => (
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
          {pair?.fraction === item && (
            <FeatherIcon name="check" size={16} color="#34e145" />
          )}
        </TouchableOpacity>
      ));
    };

    return (
      <View
        style={[
          containerStyle,
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // backgroundColor: 'yellow',
          },
        ]}
      >
        {label && <TheText text={`${label}:`} />}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 5,
            // backgroundColor: 'pink',
            // flex: 1,
          }}
        >
          <TheTextInput
            ref={ref}
            placeholder="0"
            style={{
              width: 50,
              borderColor: pair?.focused ? '#2975D2' : border,
              borderWidth: pair?.focused ? 2 : 1,
            }}
            // isNum
            value={pair?.value}
            onChange={t =>
              onChange({ ...pair, value: t.replace(/[^0-9.]/g, '') })
            }
            onBlur={() =>
              pair?.focused == true
                ? onChange({ ...pair, focused: false })
                : null
            }
            onFocus={() =>
              pair?.focused == false
                ? onChange({ ...pair, focused: true })
                : null
            }
            editable={!isLocked}
            showSoftInputOnFocus={false}
          />
          <TheText text="in" size={16} />
          {showWarn && <Warn width={20} height={20} />}
          <Menu>
            <MenuTrigger disabled={isLocked}>
              <View style={styles.menuTrigger}>
                <TheText
                  text={pair?.fraction || '0'}
                  size={16}
                  color={!pair?.fraction ? 'grey' : 'auto'}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{ flexShrink: 1, maxWidth: 40, textAlign: 'center' }}
                />
                <EntypoIcon name="chevron-down" color="#666" size={16} />
              </View>
            </MenuTrigger>

            <MenuOptions
              customStyles={{
                optionsContainer: {
                  ...styles.menuOptions,
                  maxHeight: 150,
                },
                optionsWrapper: {
                  maxHeight: 150,
                },
              }}
            >
              <ScrollView
                style={{ maxHeight: 150 }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {fractionalInches.map((item, index) => (
                  <MenuOption
                    key={item}
                    onSelect={() => onChange({ ...pair, fraction: item })}
                  >
                    <View
                      style={[
                        styles.optionRow,
                        {
                          borderTopWidth: index === 0 ? 0 : 0.5,
                          paddingBottom:
                            index === fractionalInches.length - 1 ? 20 : 8,
                        },
                      ]}
                    >
                      <TheText text={item} />
                      {pair?.fraction === item && (
                        <FeatherIcon name="check" size={16} color="#34e145" />
                      )}
                    </View>
                  </MenuOption>
                ))}
              </ScrollView>
            </MenuOptions>
          </Menu>
        </View>

        {error ? (
          <TheText
            color={'red'}
            text={error}
            style={styles.errorText}
            size={10}
          />
        ) : null}

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
                maxHeight: 100,
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {renderOptions()}
            </ScrollView>
          </View>
        )}
      </View>
    );
  },
);

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

  menuTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,

    width: 60,
    height: 50,
    justifyContent: 'space-between',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: border,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },

  menuOptions: {
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
    marginTop: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 75,
  },
});

export default ToolInput;
