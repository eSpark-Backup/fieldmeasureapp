import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';

type SignInProps = NativeStackScreenProps<RootNavParamList, 'SignIn'>;

const SignIn: React.FC = () => {
  const navigation = useNavigation<SignInProps['navigation']>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <BuildingLogo />
      </View>
      <View style={styles.formContainer}>
        <TheTextInput placeholder="abd@gmail.com" label="Email" />
        <View>
          <TheTextInput
            placeholder="*******"
            label="Password"
            secureTextEntry
          />
          <TheText
            text="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          />
        </View>
        <TheButton
          btnTitle="Login"
          onPress={() => navigation.navigate('Projects')}
          style={styles.loginButton}
        />
      </View>
      <View style={styles.footer}>
        <TheText text="New to Skyline? " style={styles.footerText} />
        <TheText
          text="Create Account"
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
    paddingVertical: '25%',
  },
  formContainer: {
    paddingVertical: '10%',
    paddingHorizontal: '3%',
    gap: 16,
  },
  forgotPassword: {
    textAlign: 'right',
    fontWeight: 'bold',
    paddingTop: 8,
    color: primaryColor,
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
    color: primaryColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignIn;
