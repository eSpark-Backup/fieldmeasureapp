import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './src/navigation/RootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { WhiteBackground } from './src/constants/colors';
import ToastConfig from './src/utils/toastConfig';
import { MenuProvider } from 'react-native-popup-menu';

const App = () => {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
};

export default App;
