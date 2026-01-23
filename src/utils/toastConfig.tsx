import { View, StyleSheet } from 'react-native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TheText } from '../components';

const toastConfig = {
  custom: ({ text1 }: { text1?: string }) => (
    <View style={[style.toast]}>
      <TheText text={text1 || ''} style={{ width: '90%' }} />
    </View>
  ),
};

export default function ToastConfig() {
  const inset = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        top: inset.top,
      }}
    >
      <Toast topOffset={inset.top} autoHide config={toastConfig} />
    </View>
  );
}

const style = StyleSheet.create({
  toast: {
    minHeight: 50,
    width: '100%',
    backgroundColor: '#7D7D7D', // Greyish background
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5, // Optional: Add rounded corners
    elevation: 3, // Optional: Add shadow for Android
    shadowColor: '#000', // Optional: Shadow color for iOS
    shadowOpacity: 0.2, // Optional: Shadow opacity for iOS
    shadowRadius: 2, // Optional: Shadow radius for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: Shadow offset for iOS
  },
});
