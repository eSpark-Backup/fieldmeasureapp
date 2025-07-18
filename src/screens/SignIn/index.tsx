import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TheButton, TheTextInput } from '../../components';
import { BuildingLogo } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';

type SignInProps = NativeStackScreenProps<RootNavParamList, 'SignIn'>;

const SignIn = () => {
  const navigation = useNavigation<SignInProps['navigation']>();

  const handleLogin = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <BuildingLogo />
      </View>
      <View style={styles.formContainer}>
        <TheTextInput placeholder="abd@gmail.com" label="Email" />
        <TheTextInput placeholder="*******" label="Password" secureTextEntry />
        <TheButton
          btnTitle="Login"
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  loginButton: {
    width: '70%',
    alignSelf: 'center',
    marginTop: 32,
  },
});

export default SignIn;
