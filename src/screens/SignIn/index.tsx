import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { GapView, TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';
import { Formik } from 'formik';
import { SignInSchema } from '../../constants/validations/schema';
import { creds } from '../../constants';
import { useProjectStore } from '../../store/ProjectsStore';

type SignInProps = NativeStackScreenProps<RootNavParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<SignInProps['navigation']>();
  const technicians = useProjectStore(state => state.technicians);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <BuildingLogo />
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={values => {
            if (
              values.email === creds.email &&
              values.password === creds.password
            ) {
              navigation.navigate('Projects', { role: 'admin' });
            } else {
              const tech = technicians.find(
                t => t.email === values.email && t.password === values.password,
              );
              if (tech) {
                navigation.navigate('Projects', {
                  role: 'technician',
                  techId: tech.id,
                });
              } else {
                Alert.alert('Invalid credentials');
              }
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TheTextInput
                placeholder="abd@gmail.com"
                label="Email"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : ''}
                style={{ width: '100%' }}
              />
              <GapView />
              <TheTextInput
                label="Password"
                placeholder="*******"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                error={
                  touched.password && errors.password ? errors.password : ''
                }
              />

              <TheText
                text="Forgot Password?"
                onPress={() => navigation.navigate('ForgotPassword')}
                color={primaryColor}
                style={styles.forgotPassword}
              />

              <TheButton
                btnTitle="Login"
                onPress={handleSubmit}
                // onPress={() => navigation.navigate('Projects')}
                style={styles.loginButton}
              />
            </>
          )}
        </Formik>
      </View>
      <View style={styles.footer}>
        <TheText text="New to Skyline? " style={styles.footerText} />
        <TheText
          text="Create Account"
          color={primaryColor}
          onPress={() => navigation.navigate('SignUp')}
          style={styles.createAccount}
        />
      </View>
      <GapView length={useSafeAreaInsets().bottom} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: background,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  formContainer: {
    // flex: 1,
    // justifyContent: 'space-evenly',
    // paddingVertical: '10%',
    // paddingHorizontal: '3%',
    width: '100%',
    marginVertical: 20,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: 'bold',
    paddingTop: 8,
  },
  loginButton: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 32,
  },
  footer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    // paddingBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  createAccount: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignIn;
