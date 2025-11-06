import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

import RootNavigation from './src/navigation/RootNavigation';
import { WhiteBackground } from './src/constants/colors';
import ToastConfig from './src/utils/toastConfig';
import { KeyboardProvider } from './src/utils/KeyboardContext';

const App = () => {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <MenuProvider>
          <NavigationContainer>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={WhiteBackground}
            />
            <RootNavigation />
            <ToastConfig />
          </NavigationContainer>
        </MenuProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

export default App;
