import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import RootNavigation from './src/navigation/RootNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { WhiteBackground } from './src/constants/colors';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={WhiteBackground}
        />
        {/* <RootNavigation /> */}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
