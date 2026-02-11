import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';
import { Formik } from 'formik';
import { SignUpSchema } from '../../constants/validations/schema';
import { useProjectStore } from '../../store/ProjectsStore';
import { firebaseAuth, db } from '../../utils/firebase';
import { Alert } from 'react-native';

type SignUpProps = NativeStackScreenProps<RootNavParamList, 'SignUp'>;

const SignUp = () => {
  const navigation = useNavigation<SignUpProps['navigation']>();

  const handleSignUp = async (values: any) => {
    const { setIsLoading } = useProjectStore.getState();
    try {
      setIsLoading(true);
      const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
        values.email.toLowerCase(),
        values.password
      );

      const { uid } = userCredential.user;

      await db.collection('users').doc(uid).set({
        uid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(),
        role: 'technician', // Default role for self-signup
        permissions: {
          delete: false,
          modify: false,
          create: false,
        },
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('SignIn');
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <BuildingLogo />
        </View>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
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
              <TheTextInput
                label="First Name"
                placeholder="John"
                value={values.firstName}
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={
                  touched.firstName && errors.firstName ? errors.firstName : ''
                }
              />
              <TheTextInput
                label="Last Name"
                placeholder="Doe"
                value={values.lastName}
                onChange={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={
                  touched.lastName && errors.lastName ? errors.lastName : ''
                }
              />
              <TheTextInput
                label="Email"
                placeholder="abc@gmail.com"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email && errors.email ? errors.email : ''}
              />
              <TheTextInput
                label="Password"
                placeholder="********"
                secureTextEntry
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                error={
                  touched.password && errors.password ? errors.password : ''
                }
              />
              <TheTextInput
                label="Confirm Password"
                placeholder="********"
                secureTextEntry
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : ''
                }
              />
              <TheButton
                btnTitle="Sign Up"
                onPress={handleSubmit}
                style={styles.signUpButton}
              />
            </View>
          )}
        </Formik>

        <View style={styles.footer}>
          <TheText text="Already have an account? " style={styles.footerText} />
          <TheText
            text="Sign In"
            onPress={() => navigation.navigate('SignIn')}
            color={primaryColor}
            style={styles.createAccount}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: '5%',
    paddingTop: '18%',
  },
  formContainer: {
    paddingVertical: '10%',
    paddingHorizontal: '3%',
    gap: 2,
  },
  signUpButton: {
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

export default SignUp;
