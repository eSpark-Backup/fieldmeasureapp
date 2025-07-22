import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GapView, TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';
import { Formik } from 'formik';
import { SignInSchema } from '../../constants/validations/schema';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import BottomSheet from '@gorhom/bottom-sheet';

type SignInProps = NativeStackScreenProps<RootNavParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<SignInProps['navigation']>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <BuildingLogo />
      </View>
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={values => {
            console.log('Form Values:', values);
            navigation.navigate('Projects');
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
                // onPress={handleSubmit}
                onPress={() => navigation.navigate('Projects')}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
    justifyContent: 'flex-start',
  },

  logoContainer: {
    alignItems: 'center',
    paddingBottom: '25%',
    paddingTop: '18%',
  },
  formContainer: {
    paddingVertical: '10%',
    paddingHorizontal: '3%',
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: 20,
    flexDirection: 'row',
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
