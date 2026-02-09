import React, { useEffect, useState } from 'react';
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
import { useUserStore } from '../store/UserStore';
import { ActivityIndicator, View } from 'react-native';
import { background, primaryColor } from '../constants/colors';
import { firebaseAuth, db } from '../utils/firebase';

const Stack = createNativeStackNavigator<RootNavParamList>();

const AppNavigator = () => {
  const { user, hasHydrated, saveUser, clearUser } = useUserStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        // Fetch role from Firestore
        try {
          const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
          if (userDoc.exists()) {
            const userData = userDoc.data();
            saveUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: userData?.role || 'technician',
              permissions: userData?.permissions,
            });
          } else {
            // Default to technician if doc doesn't exist
            saveUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'technician',
              permissions: undefined,
            });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        clearUser();
      }
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (!hasHydrated || initializing) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
        }}
      >
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
      initialRouteName={user ? 'Projects' : 'SignIn'}
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
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => {
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
        })}
      />
      <Stack.Screen
        name="Measurement"
        component={Measurement}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => {
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
        })}
      />
      <Stack.Screen
        name="AllDetails"
        component={AllDetails}
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => {
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
        })}
      />
    </Stack.Navigator>
  );
};

const RootNavigation = () => {
  return <AppNavigator />;
};

export default RootNavigation;
