import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Technician, useProjectStore } from '../../store/ProjectsStore';
import { db } from '../../utils/firebase';
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
  // const { technicians, editTechnician, removeTechnician } = useProjectStore();
  const navigation = useNavigation<TechniciansProps['navigation']>();
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState<any>();
  const [showEdit, setShowEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .where('role', '==', 'technician')
      .onSnapshot(
        snapshot => {
          const techList = snapshot.docs.map(doc => doc.data());
          setTechnicians(techList);
          setIsLoading(false);
        },
        error => {
          console.error('Error fetching technicians:', error);
          setIsLoading(false);
        },
      );
    return () => unsubscribe();
  }, []);

  const handleEditTechnician = async (values: any, { setSubmitting }: any) => {
    if (!selectedTech?.uid) return;

    try {
      setSubmitting(true);
      await db.collection('users').doc(selectedTech.uid).update({
        firstName: values.firstName,
        lastName: values.lastName,
        permissions: values.permissions,
      });

      Alert.alert('Success', 'Technician updated successfully!');
      setShowEdit(false);
    } catch (error: any) {
      console.error('Error updating technician:', error);
      Alert.alert('Error', error.message || 'Failed to update technician');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTechnician = (uid: string) => {
    Alert.alert(
      'Delete Technician',
      'Are you sure you want to delete this technician? This will only remove their data from Firestore.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.collection('users').doc(uid).delete();
              Alert.alert('Success', 'Technician deleted from database.');
            } catch (error: any) {
              console.error('Error deleting technician:', error);
              Alert.alert('Error', 'Failed to delete technician.');
            }
          },
        },
      ],
    );
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
            onDelete={() => handleDeleteTechnician(item.uid)}
            key={item.uid}
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
            permissions: selectedTech?.permissions || {
              delete: false,
              modify: false,
              create: false,
            },
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
            setFieldValue,
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
                editable={false} // Email cannot be changed in Firebase Auth easily
              />
              <View style={styles.permissionsContainer}>
                <TheText
                  size={18}
                  style={{ fontWeight: '600', marginBottom: 10 }}
                  text="Permissions"
                />

                <View style={styles.permissionRow}>
                  <TheText size={16} text="Delete" />
                  <Switch
                    value={values.permissions?.delete || false}
                    onValueChange={val => {
                      setFieldValue('permissions', {
                        ...values.permissions,
                        delete: val,
                      });
                    }}
                  />
                </View>

                <View style={styles.permissionRow}>
                  <TheText size={16} text="Modify" />
                  <Switch
                    value={values.permissions?.modify || false}
                    onValueChange={val => {
                      setFieldValue('permissions', {
                        ...values.permissions,
                        modify: val,
                      });
                    }}
                  />
                </View>

                <View style={styles.permissionRow}>
                  <TheText size={16} text="Create" />
                  <Switch
                    value={values.permissions?.create || false}
                    onValueChange={val => {
                      setFieldValue('permissions', {
                        ...values.permissions,
                        create: val,
                      });
                    }}
                  />
                </View>
              </View>
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
  permissionsContainer: {
    marginTop: 20,
    backgroundColor: lightBackground,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: border,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
