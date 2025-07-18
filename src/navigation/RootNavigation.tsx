import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootNavParamList } from '../types/navigationParams';

import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import Projects from '../screens/Projects';

const Stack = createNativeStackNavigator<RootNavParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SignIn"
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Projects" component={Projects} />
    </Stack.Navigator>
  );
};

export default RootNavigation;
