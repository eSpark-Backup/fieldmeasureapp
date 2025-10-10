import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';
import { Formik } from 'formik';
import { ForgotPasswordSchema } from '../../constants/validations/schema';

type ForgotPasswordProps = NativeStackScreenProps<
  RootNavParamList,
  'ForgotPassword'
>;

const ForgotPassword = () => {
  const navigation = useNavigation<ForgotPasswordProps['navigation']>();

  const handleForgotPassword = (values: { email: string }) => {
    console.log('Submitting email:', values.email);
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <BuildingLogo />
        </View>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <TheText
                text="Please enter the address associated with your account"
                style={styles.headerText}
                size={18}
              />

              <TheTextInput
                label="Email"
                placeholder="abd@gmail.com"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : ''}
              />

              <TheButton
                btnTitle="Submit"
                onPress={handleSubmit}
                style={styles.loginButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <TheText text="New to Skyline? " style={styles.footerText} />
          <TheText
            text="Create Account"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.createAccount}
            color={primaryColor}
          />
        </View>
      </ScrollView>
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
    // paddingTop: '18%',
    // paddingBottom: '20%',
  },
  formContainer: {
    paddingVertical: '10%',
    paddingHorizontal: '3%',
    gap: 16,
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginButton: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 32,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    paddingBottom: 20,
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

export default ForgotPassword;
