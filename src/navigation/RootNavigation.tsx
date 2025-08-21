import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProjectDetails from '../screens/ProjectDetails';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import Projects from '../screens/Projects';
import AllDetails from '../screens/AllDetails';
import TheHeader from '../components/TheHeader';
import Measurement from '../screens/Measurement';

import { RootNavParamList } from '../types/navigationParams';
import AddTechnician from '../screens/AddTechnician';
import TechniciansList from '../screens/TechniciansList';

const Stack = createNativeStackNavigator<RootNavParamList>();

const RootNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
      // initialRouteName="Projects"
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Projects" component={Projects} />
      <Stack.Screen name="AddTechnician" component={AddTechnician} />
      <Stack.Screen name="TechniciansList" component={TechniciansList} />
      <Stack.Screen
        name="ProjectDetails"
        component={ProjectDetails}
        options={{
          headerShown: true,
          header: ({ navigation, route }) => {
            const { qouteNumber, name, address, techName, date } =
              route.params as RootNavParamList['ProjectDetails'];
            return (
              <TheHeader
                onBackPress={() => navigation.goBack()}
                qouteNumber={qouteNumber}
                name={name}
                address={address}
                techName={techName}
                date={date}
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
            const { qouteNumber, name, address, techName, date } =
              route.params as RootNavParamList['Measurement'];
            return (
              <TheHeader
                onBackPress={() => navigation.goBack()}
                qouteNumber={qouteNumber}
                name={name}
                address={address}
                techName={techName}
                date={date}
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
            const { qouteNumber, name, address, techName, date } =
              route.params as RootNavParamList['AllDetails'];
            return (
              <TheHeader
                onBackPress={() => navigation.goBack()}
                qouteNumber={qouteNumber}
                name={name}
                address={address}
                techName={techName}
                date={date}
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigation;
