import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react';
import FloatingKeyboard from '../components/TheKeyboard';
import { TextInput } from 'react-native';

interface KeyboardContextType {
  isVisible: boolean;
  currentValue: string;
  showKeyboard: (initialValue?: string) => void;
  hideKeyboard: () => void;
  onKeyPress: (key: string) => void;
  onSubmit: (value: string) => void;
  activeInputId: string | null;
  setActiveInputId: (id: string | null) => void;
  registerInput: (id: string, ref: TextInput) => void;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);

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

  const inputRefs = useRef<Record<string, TextInput>>({});

  // Add function to register input refs
  const registerInput = useCallback((id: string, ref: TextInput) => {
    inputRefs.current[id] = ref;
  }, []);

  const showKeyboard = useCallback(
    (initialValue = '', onSubmit?: (value: string) => void) => {
      setCurrentValue(initialValue);
      setIsVisible(true);
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
        // Handle submit regardless of value change
        if (onSubmitCallback) {
          onSubmitCallback(currentValue);
        }
        // Always blur active input when OK is pressed
        if (activeInputId && inputRefs.current[activeInputId]) {
          inputRefs.current[activeInputId]?.blur();
        }
        hideKeyboard();
      } else {
        setCurrentValue(prev => prev + key);
      }
    },
    [hideKeyboard, onSubmitCallback, activeInputId], // Remove currentValue from dependencies
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
      }}
    >
      {children}
      <FloatingKeyboard visible={isVisible} onPressKey={onKeyPress} />
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
