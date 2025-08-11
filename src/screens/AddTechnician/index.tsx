import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GapView, TheButton, TheText, TheTextInput } from '../../components';
import { Back, BuildingLogo } from '../../assets';
import { RootNavParamList } from '../../types/navigationParams';
import { background, primaryColor } from '../../constants/colors';
import { Formik } from 'formik';
import { SignUpSchema } from '../../constants/validations/schema';
import { useProjectStore } from '../../store/ProjectsStore';
import uuid from 'react-native-uuid';

type AddTechnicianProps = NativeStackScreenProps<
  RootNavParamList,
  'AddTechnician'
>;

const AddTechnician = () => {
  const navigation = useNavigation<AddTechnicianProps['navigation']>();
  const addTechnician = useProjectStore(state => state.addTechnician);

  const handleAddTechnician = (values: any) => {
    const newTech = {
      id: uuid.v4().toString(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email.toLowerCase(),
      password: values.password, // ⚠ In real apps, hash this
    };

    addTechnician(newTech);
    Alert.alert('Success', 'Technician added successfully!', [{ text: 'OK' }], {
      cancelable: false,
    });
    navigation.navigate('Projects', { role: 'admin' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Back
            onPress={() => navigation.navigate('Projects', { role: 'admin' })}
          />
          <TheText
            size={24}
            style={{ fontWeight: 'bold' }}
            text="Add Technicians"
          />
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
          onSubmit={handleAddTechnician}
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
                btnTitle="Create Technician"
                onPress={handleSubmit}
                style={styles.AddTechnicianButton}
              />
            </View>
          )}
        </Formik>
        <GapView length={20} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: background,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    // paddingVertical: 10,
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: '5%',
    paddingTop: '18%',
  },
  formContainer: {
    // paddingVertical: '1%',
    paddingHorizontal: '3%',
    gap: 2,
  },
  AddTechnicianButton: {
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

export default AddTechnician;
