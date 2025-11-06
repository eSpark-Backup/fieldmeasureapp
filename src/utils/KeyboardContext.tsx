import React, { createContext, useContext, useState, useCallback } from 'react';

interface KeyboardContextType {
  isVisible: boolean;
  currentValue: string;
  showKeyboard: (initialValue?: string) => void;
  hideKeyboard: () => void;
  onKeyPress: (key: string) => void;
  onSubmit: (value: string) => void;
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
  }, []);

  const onKeyPress = useCallback(
    (key: string) => {
      if (key === '←') {
        setCurrentValue(prev => prev.slice(0, -1));
      } else if (key === 'OK') {
        if (onSubmitCallback) {
          onSubmitCallback(currentValue);
        }
        hideKeyboard();
      } else {
        setCurrentValue(prev => prev + key);
      }
    },
    [currentValue, hideKeyboard, onSubmitCallback],
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
