import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';

type ForgotPasswordProps = NativeStackScreenProps<
  RootNavParamList,
  'ForgotPassword'
>;

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordProps['navigation']>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <BuildingLogo />
      </View>
      <View style={styles.formContainer}>
        <TheText
          text="Please enter the address associated with your account"
          style={styles.headerText}
          size={18}
        />
        <TheTextInput placeholder="abd@gmail.com" label="Email" />
        <TheButton
          btnTitle="Submit"
          onPress={() => navigation.navigate('SignIn')}
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
    paddingTop: '25%',
    paddingBottom: '20%',
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
    color: primaryColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ForgotPassword;
