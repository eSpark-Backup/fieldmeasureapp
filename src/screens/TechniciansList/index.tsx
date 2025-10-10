import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Technician, useProjectStore } from '../../store/ProjectsStore';
import { background, border, lightBackground } from '../../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GapView,
  TechCard,
  TheButton,
  TheText,
  TheTextInput,
} from '../../components';
import { Back } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { Formik } from 'formik';
import { SignUpSchema } from '../../constants/validations/schema';

type TechniciansProps = NativeStackScreenProps<
  RootNavParamList,
  'TechniciansList'
>;

const TechniciansList = () => {
  // const technicians = useProjectStore().technicians;
  const { technicians, editTechnician, removeTechnician } = useProjectStore();
  const navigation = useNavigation<TechniciansProps['navigation']>();
  const [selectedTech, setSelectedTech] = useState<Technician>();
  const [showEdit, setShowEdit] = useState(false);

  const handleEditTechnician = (values: any) => {
    if (!selectedTech?.id) return;

    const newTech = {
      id: selectedTech?.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email.toLowerCase(),
      password: values.password, // ⚠ In real apps, hash this
    };

    editTechnician(newTech);
    Alert.alert(
      'Success',
      'Technician edited successfully!',
      [{ text: 'OK' }],
      {
        cancelable: false,
      },
    );
    setShowEdit(false);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: background,
        paddingHorizontal: 20,
      }}
    >
      <GapView length={useSafeAreaInsets().top + 10} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Back
              width={25}
              height={25}
              onPress={() => navigation.navigate('Projects', { role: 'admin' })}
            />
            <TheText
              size={24}
              style={{ fontWeight: 'bold' }}
              text="Technicians"
            />
          </View>
          <TheText
            size={18}
            style={{ marginVertical: 10 }}
            text="Edit or delete any technician's information."
          />
        </View>
      </View>
      {!showEdit && technicians.length > 0 ? (
        technicians.map(item => (
          <TechCard
            techInfo={item}
            onEditPress={() => {
              setShowEdit(true);
              setSelectedTech(item);
            }}
            onDelete={() => removeTechnician(item.id)}
          />
        ))
      ) : !showEdit ? (
        <View
          style={{
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TheText
            size={22}
            style={{ fontWeight: '500', marginVertical: 10 }}
            text={'No Technicians available.'}
          />
        </View>
      ) : null}

      {showEdit && (
        <Formik
          initialValues={{
            firstName: selectedTech?.firstName,
            lastName: selectedTech?.lastName,
            email: selectedTech?.email,
            password: selectedTech?.password,
            confirmPassword: selectedTech?.password,
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleEditTechnician}
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
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <TheButton
                  btnTitle="Edit Technician"
                  onPress={handleSubmit}
                  style={styles.AddTechnicianButton}
                />
                <TheButton
                  btnTitle="Cancel"
                  onPress={() => {
                    setShowEdit(false);
                    setSelectedTech(undefined);
                  }}
                  titleColor="#000"
                  btnColor={lightBackground}
                  style={[
                    styles.AddTechnicianButton,
                    { borderWidth: 1, borderColor: border },
                  ]}
                />
              </View>
            </View>
          )}
        </Formik>
      )}
      <GapView length={useSafeAreaInsets().bottom + 10} />
    </ScrollView>
  );
};

export default TechniciansList;

const styles = StyleSheet.create({
  formContainer: {
    // paddingVertical: '1%',
    paddingHorizontal: '3%',
    gap: 2,
  },
  AddTechnicianButton: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 32,
  },
});
