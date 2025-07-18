import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Projects from '../screens/Projects';

import { RootNavParamList } from '../types/navigationParams';
import ProjectDetails from '../screens/ProjectDetails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Measurement from '../screens/Measurement';
import { TheText } from '../components';

const Stack = createNativeStackNavigator<RootNavParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: {
          top: useSafeAreaInsets().top,
          marginBottom: useSafeAreaInsets().bottom + useSafeAreaInsets().top,
        },
      }}
    >
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetails}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="Measurement" component={Measurement} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
