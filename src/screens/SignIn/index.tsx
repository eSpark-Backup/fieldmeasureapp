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
import { useUserStore } from '../../store/UserStore';
import { useProjectStore } from '../../store/ProjectsStore';
import { firebaseAuth, db, seedInitialAdmin } from '../../utils/firebase';
import { ActivityIndicator } from 'react-native';

type SignInProps = NativeStackScreenProps<RootNavParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<SignInProps['navigation']>();
  const { saveUser } = useUserStore();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <BuildingLogo />
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ 
            // email: '', 
            // password: ''
            email: 'admin@fieldmeasure.com', 
            password: 'Admin@123'
           }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const { setIsLoading } = useProjectStore.getState();
              setIsLoading(true);
              const userCredential = await firebaseAuth.signInWithEmailAndPassword(
                values.email.toLowerCase(),
                values.password,
              );
              
              const firebaseUser = userCredential.user;
              
              // Fetch role from Firestore
              const userDoc = await db.collection('users').doc(firebaseUser.uid).get();
              let role: 'admin' | 'technician' = 'technician';
              let techName = '';
              let permissions = undefined;
              
              if (userDoc.exists()) {
                const userData = userDoc.data();
                role = userData?.role || 'technician';
                techName = userData?.firstName + ' ' + userData?.lastName;
                permissions = userData?.permissions;
              }

              saveUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                role: role,
                permissions: permissions,
              });

              navigation.navigate('Projects', {
                role: role,
                techId: firebaseUser.uid,
                techName: techName,
              });
            } catch (error: any) {
              console.error('Login error:', error);
              Alert.alert('Login Failed', error.message || 'Invalid credentials');
            } finally {
              const { setIsLoading } = useProjectStore.getState();
              setIsLoading(false);
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
                onPress={() => handleSubmit()}
                style={styles.loginButton}
              />
            </>
          )}
        </Formik>
      </View>
      {/* <View style={styles.footer}>
        <TheText
          text="Admin Setup (One-time)"
          color={primaryColor}
          onPress={async () => {
            Alert.alert(
              'Seed Initial Admin',
              'This will create a default admin account: admin@fieldmeasure.com / Admin@123. Proceed?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Seed',
                  onPress: async () => {
                    const { setIsLoading } = useProjectStore.getState();
                    try {
                      setIsLoading(true);
                      await seedInitialAdmin('admin@fieldmeasure.com', 'Admin@123');
                      Alert.alert('Success', 'Admin seeded! You can now login with these credentials.');
                    } catch (e: any) {
                      Alert.alert('Error', e.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }
                }
              ]
            );
          }}
          style={styles.createAccount}
        />
      </View> */}
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
