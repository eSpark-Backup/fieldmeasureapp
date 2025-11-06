import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface FloatingKeyboardProps {
  visible: boolean;
  onPressKey: (key: string) => void;
  isQwerty?: boolean;
}

const FloatingKeyboard = ({
  visible,
  onPressKey,
  isQwerty,
}: FloatingKeyboardProps) => {
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const KEY_ROWS = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '←'],
    ['Space', 'OK'],
  ];

  const NUMERIC_KEYS = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
    '←',
    'OK',
  ];

  return (
    <Animated.View
      style={[styles.keyboardContainer, { transform: [{ translateY }] }]}
    >
      {isQwerty ? (
        KEY_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(key => (
              <TouchableOpacity
                key={key}
                onPress={() => onPressKey(key)}
                style={[
                  styles.key,
                  key === 'Space' && styles.spaceKey,
                  key === 'OK' && styles.okKey,
                ]}
              >
                <Text style={styles.keyText}>
                  {key === 'Space' ? '⎵' : key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      ) : (
        <View style={styles.row}>
          {NUMERIC_KEYS.map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.key, { width: '15%', margin: 2 }]}
              onPress={() => onPressKey(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 10,
    elevation: 8,
    zIndex: 1000,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  key: {
    width: '8%',
    aspectRatio: 1,
    backgroundColor: '#444',
    margin: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceKey: {
    width: '50%',
  },
  okKey: {
    backgroundColor: '#5A8DEE',
    width: '20%',
  },
  keyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default FloatingKeyboard;
