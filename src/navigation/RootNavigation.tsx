import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootNavParamList } from '../types/navigationParams';
import ProjectDetails from '../screens/ProjectDetails';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Measurement from '../screens/Measurement';
import { TheText } from '../components';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import Projects from '../screens/Projects';
import AllDetails from '../screens/AllDetails';

const Stack = createNativeStackNavigator<RootNavParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: {
          // top: useSafeAreaInsets().top,
          // marginBottom: useSafeAreaInsets().bottom + useSafeAreaInsets().top,
        },
      }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetails}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen name="Measurement" component={Measurement} />
      <Stack.Screen name="AllDetails" component={AllDetails} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
