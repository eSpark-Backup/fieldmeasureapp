import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Projects from '../screens/Projects';

import { RootStackParamList } from '../types/navigationParams';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Projects" component={Projects} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
