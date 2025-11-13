import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import FloatingKeyboard from '../components/TheKeyboard';
import { Dimensions, TextInput, TouchableOpacity, View } from 'react-native';

interface KeyboardContextType {
  isVisible: boolean;
  currentValue: string;
  showKeyboard: (
    initialValue?: string,
    onSubmit?: (value: string) => void,
    isQwerty?: boolean,
  ) => void;
  hideKeyboard: () => void;
  onKeyPress: (key: string) => void;
  onSubmit: (value: string) => void;
  activeInputId: string | null;
  setActiveInputId: (id: string | null) => void;
  registerInput: (id: string, ref: TextInput) => void;
  isQwerty: boolean;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);

const { height: hei } = Dimensions.get('window');

export const KeyboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const [onSubmitCallback, setOnSubmitCallback] = useState<
    ((value: string) => void) | null
  >(null);
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const [isQwerty, setIsQwerty] = useState(false);

  const inputRefs = useRef<Record<string, TextInput>>({});

  // Add function to register input refs
  const registerInput = useCallback((id: string, ref: TextInput) => {
    inputRefs.current[id] = ref;
  }, []);

  const showKeyboard = useCallback(
    (
      initialValue = '',
      onSubmit?: (value: string) => void,
      qwerty?: boolean,
    ) => {
      setCurrentValue(initialValue);
      setIsVisible(true);
      setIsQwerty(!!qwerty);
      if (onSubmit) {
        setOnSubmitCallback(() => onSubmit);
      }
    },
    [],
  );

  const hideKeyboard = useCallback(() => {
    setIsVisible(false);
    setCurrentValue('');
    setOnSubmitCallback(null);
    setActiveInputId(null);
  }, []);

  const onKeyPress = useCallback(
    (key: string) => {
      if (key === '←') {
        setCurrentValue(prev => prev.slice(0, -1));
      } else if (key === 'OK') {
        // 1️⃣ Blur the active input if registered
        if (activeInputId && inputRefs.current[activeInputId]) {
          const ref = inputRefs.current[activeInputId];
          if (ref && ref.blur) ref.blur();
        }

        // 2️⃣ Trigger submit callback
        if (onSubmitCallback) {
          onSubmitCallback(currentValue);
        }

        // 3️⃣ Hide keyboard and reset state
        hideKeyboard();
      } else {
        if (key === 'Space') {
          setCurrentValue(prev => prev + ' ');
        } else {
          setCurrentValue(prev => prev + key);
        }
      }
    },
    [hideKeyboard, onSubmitCallback, activeInputId, currentValue],
  );

  return (
    <KeyboardContext.Provider
      value={{
        isVisible,
        currentValue,
        showKeyboard,
        hideKeyboard,
        onKeyPress,
        onSubmit: onSubmitCallback || (() => {}),
        activeInputId,
        setActiveInputId,
        registerInput,
        isQwerty,
      }}
    >
      {children}
      {isVisible && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: hei,
          }}
          onPress={() => onKeyPress('OK')}
        ></TouchableOpacity>
      )}
      <FloatingKeyboard
        visible={isVisible}
        onPressKey={onKeyPress}
        isQwerty={isQwerty}
      />
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboard must be used within a KeyboardProvider');
  }
  return context;
};
