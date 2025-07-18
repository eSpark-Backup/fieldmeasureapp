import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TheButton, TheText, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';

type SignUpProps = NativeStackScreenProps<RootNavParamList, 'SignUp'>;

const SignUp: React.FC = () => {
  const navigation = useNavigation<SignUpProps['navigation']>();

  const handleSignUp = () => {
    navigation.navigate('Projects');
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
        <View style={styles.formContainer}>
          <TheTextInput placeholder="John" label="First Name" />
          <TheTextInput placeholder="Doe" label="Last Name" />
          <TheTextInput placeholder="abc@gmail.com" label="Email" />
          <TheTextInput
            placeholder="********"
            secureTextEntry
            label="Password"
          />
          <TheTextInput
            placeholder="********"
            secureTextEntry
            label="Confirm Password"
          />
          <TheButton
            btnTitle="Sign Up"
            onPress={handleSignUp}
            style={styles.signUpButton}
          />
        </View>
        <View style={styles.footer}>
          <TheText text="Already have an account? " style={styles.footerText} />
          <TheText
            text="Sign In"
            onPress={() => navigation.navigate('SignIn')}
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
    paddingTop: '25%',
  },
  formContainer: {
    paddingVertical: '10%',
    paddingHorizontal: '3%',
    gap: 15,
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
    color: primaryColor,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignUp;
