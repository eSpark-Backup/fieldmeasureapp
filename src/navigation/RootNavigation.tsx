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
import TheHeader from '../components/TheHeader';

const Stack = createNativeStackNavigator<RootNavParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
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
          header: ({ navigation, route }) => {
            const { projectId, title, address, date, extraInfo } =
              route.params as RootNavParamList['ProjectDetails'];
            return (
              <TheHeader
                onBackPress={() => navigation.goBack()}
                projectId={projectId}
                title={title}
                address={address}
                date={date}
                extraInfo={extraInfo}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="Measurement"
        component={Measurement}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => {
            const { projectId, title, address, date, extraInfo } =
              route.params as RootNavParamList['Measurement'];
            return (
              <TheHeader
                onBackPress={() => navigation.goBack()}
                projectId={projectId}
                title={title}
                address={address}
                date={date}
                extraInfo={extraInfo}
              />
            );
          },
        }}
      />
      <Stack.Screen
        name="AllDetails"
        component={AllDetails}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => {
            const { projectId, title, address, date, extraInfo } =
              route.params as RootNavParamList['AllDetails'];
            return (
              <TheHeader
                onBackPress={() => navigation.goBack()}
                projectId={projectId}
                title={title}
                address={address}
                date={date}
                extraInfo={extraInfo}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
