import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import RootNavigation from './src/navigation/RootNavigation';
import { WhiteBackground } from './src/constants/colors';
import ToastConfig from './src/utils/toastConfig';

const App = () => {
  return (
    <SafeAreaProvider>
      <MenuProvider>
        <KeyboardProvider>
          <NavigationContainer>
            <StatusBar
              barStyle={'dark-content'}
              backgroundColor={WhiteBackground}
            />
            <RootNavigation />
            <ToastConfig />
          </NavigationContainer>
        </KeyboardProvider>
      </MenuProvider>
    </SafeAreaProvider>
  );
};

export default App;
