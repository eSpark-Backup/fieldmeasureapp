import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TheButton, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { RootNavParamList } from '../../types/navigationParams';

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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
});

export default SignUp;
