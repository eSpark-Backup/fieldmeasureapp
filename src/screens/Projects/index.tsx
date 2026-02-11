import { View, StyleSheet, ScrollView, BackHandler, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { Formik } from 'formik';

import {
  GapView,
  ProjectsList,
  TheButton,
  TheDatePicker,
  TheDropdown,
  TheText,
  TheTextInput,
} from '../../components';
import { RoundPlus, File, Logout } from '../../assets';
import { useProjectStore } from '../../store/ProjectsStore';
import { useUserStore } from '../../store/UserStore';
import {
  background,
  border,
  lightBackground,
  primaryColor,
  WhiteBackground,
} from '../../constants/colors';
import { RootNavParamList } from '../../types/navigationParams';
import { TECHS } from '../../constants';
import { Project } from '../../types';
import {
  ProjectSchema,
  SignInSchema,
} from '../../constants/validations/schema';
import { db, firebaseAuth } from '../../utils/firebase';

type ProjectsProps = NativeStackScreenProps<RootNavParamList, 'Projects'>;

const Projects = () => {
  const navigation = useNavigation<ProjectsProps['navigation']>();
  const { addProject, projects, setProjects, isLoading, setIsLoading } = useProjectStore();
  const { user } = useUserStore();
  const [showInputs, setShowInputs] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const route = useRoute<ProjectsProps['route']>(); // typed
  const role = route.params?.role; // <-- get the role
  const techName = route.params?.techName; // <-- get user techName
  const techId = route.params?.techId; // <-- get user techId

  useEffect(() => {
    setIsLoading(true);
    let query: any = db.collection('projects');
    
    // If technician, only show their projects (supports both ID and name for backward compatibility)
    if (role === 'technician') {
      const filters = [techId, techName].filter(Boolean);
      if (filters.length > 0) {
        query = query.where('techName', 'in', filters);
      }
    }

    const unsubscribe = query.onSnapshot(
      (snapshot: any) => {
        const projectList = snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          id: doc.id,
        })) as Project[];
        setProjects(projectList);
        setIsLoading(false);
      },
      (error: any) => {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [role, techName]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Return true to stop default back behavior
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => backHandler.remove();
    }, [])
  );

  const addProj = async (values: Project) => {
    const data: Project = {
      id: values.id,
      qouteNumber: values.qouteNumber,
      name: values.name,
      address: values.address,
      techName: values.techName,
      date: values.date,
      measures: [],
    };
    try {
      await addProject(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create project: ' + error.message);
    }
  };

  useEffect(() => {
    if (role === 'admin') {
      const unsubscribe = db
        .collection('users')
        .where('role', '==', 'technician')
        .onSnapshot(
          snapshot => {
            const techList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setTechnicians(techList);
          },
          error => {
            console.error('Error fetching technicians:', error);
          },
        );
      return () => unsubscribe();
    }
  }, [role]);

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
          <TheText
            size={24}
            style={{ fontWeight: 'bold' }}
            text="Field Measurement Projects"
          />
          <TheText
            size={18}
            style={{ marginVertical: 10 }}
            text="Select an existing project or create a new one to begin measurements"
          />
        </View>
        <Logout
          width={30}
          height={30}
          onPress={async () => {
            try {
              setIsLoading(true);
              await firebaseAuth.signOut();
              navigation.navigate('SignIn');
            } catch (error: any) {
              console.error('Logout error:', error);
            } finally {
              setIsLoading(false);
            }
          }}
        />
      </View>

      {showInputs ? (
        <Formik
          initialValues={{
            id: uuid.v4().toString(),
            qouteNumber: '',
            name: '',
            address: '',
            techName: role == 'technician' ? techName! : '',
            date: new Date().toLocaleDateString('en-GB'),
          }}
          validationSchema={ProjectSchema}
          onSubmit={async (values: Project) => {
            console.log('Form Values:', values);
            setShowInputs(false);
            await addProj(values);
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
            <View
              style={{
                width: '100%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: border,
                backgroundColor: WhiteBackground,
                borderStyle: 'solid',
                gap: 20,
                paddingVertical: 20,
                paddingHorizontal: 20,
                marginVertical: 20,
                zIndex: 100,
              }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
              >
                <File width={20} height={20} color={'black'} />
                <TheText
                  size={18}
                  style={{ fontWeight: 'bold' }}
                  text="New Project Details"
                />
              </View>
              <View style={{ gap: 5 }}>
                <View style={{ ...styles.rowContainer, gap: 15 }}>
                  <TheTextInput
                    containerStyle={{ flex: 1 }}
                    label="Quote Number"
                    value={values.qouteNumber}
                    placeholder="Q-2024-001"
                    required
                    onChange={handleChange('qouteNumber')}
                    error={
                      touched.qouteNumber && errors.qouteNumber
                        ? errors.qouteNumber
                        : ''
                    }
                  />
                  <TheTextInput
                    containerStyle={{ flex: 1 }}
                    label="Client Name"
                    value={values.name}
                    placeholder="John Smith"
                    required
                    onChange={handleChange('name')}
                    error={touched.name && errors.name ? errors.name : ''}
                  />
                </View>
                <TheTextInput
                  label="Address"
                  placeholder="123 Main St, City, State 12345"
                  value={values.address}
                  required
                  onChange={handleChange('address')}
                  error={
                    touched.address && errors.address ? errors.address : ''
                  }
                />

                <View style={{ ...styles.rowContainer, gap: 15 }}>
                  <View style={{ flex: 1 }}>
                    <TheDropdown
                      data={technicians.map(t => ({
                        label: `${t.firstName} ${t.lastName}`,
                        value: t.id,
                      }))}
                      placeholder={TECHS.placeholder}
                      title={TECHS.title}
                      disabled={role == 'technician' ? true : false}
                      id={TECHS.id}
                      style={{ flex: 1 }}
                      selected={values.techName}
                      onSelect={({ key, value }) =>
                        handleChange('techName')(value)
                      }
                      required
                      isOpen={openDropdownId == TECHS.id}
                      setOpenDropdownId={setOpenDropdownId}
                      zIndex={10000}
                      error={
                        touched.techName && errors.techName
                          ? errors.techName
                          : ''
                      }
                    />
                  </View>
                  <TheDatePicker
                    containerStyle={{ flex: 1 }}
                    value={values.date}
                    onChange={(date: Date) => {
                      handleChange('date')(date.toLocaleDateString('en-GB'));
                    }}
                    label="Date *"
                    error={touched.date && errors.date ? errors.date : ''}
                  />
                </View>
                <View style={{ ...styles.rowContainer, gap: 10 }}>
                  <TheButton
                    style={{ marginVertical: 5, flex: 1 }}
                    btnTitle="Start Measuring"
                    onPress={handleSubmit}
                  />
                  <TheButton
                    style={{
                      width: '30%',
                      marginVertical: 5,
                      borderWidth: 1,
                      borderColor: border,
                    }}
                    titleColor="#000"
                    btnColor={lightBackground}
                    btnTitle="Cancel"
                    onPress={() => setShowInputs(false)}
                  />
                </View>
              </View>
            </View>
          )}
        </Formik>
      ) : (role === 'admin' || user?.permissions?.create) ? (
        <View style={styles.newContainer}>
          <TheButton
            onPress={() => setShowInputs(true)}
            style={{ width: '70%' }}
            icon={<RoundPlus width={14} height={14} color={WhiteBackground} />}
            btnTitle="Create New Project"
          />
        </View>
      ) : null}
      {role === 'admin' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <TheButton
            btnTitle="Add Technician"
            onPress={() => navigation.navigate('AddTechnician')}
            style={{ marginBottom: 10, flex: 1 }}
          />
          <TheButton
            btnTitle="Technicians List"
            onPress={() => navigation.navigate('TechniciansList')}
            style={{ marginBottom: 10, flex: 1 }}
          />
        </View>
      )}
      {isLoading ? (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : projects.length > 0 ? (
        <ProjectsList
          projects={projects}
          canDelete={role === 'admin' || user?.permissions?.delete}
          onViewPress={data => {
            navigation.navigate('ProjectDetails', { ...data, role: role });
          }}
        />
      ) : showInputs ? null : (
        <View style={styles.initialContainer}>
          <File width={40} height={40} color={border} />
          <TheText
            size={18}
            style={{ fontWeight: 'bold' }}
            text="No Projects Yet"
          />
          <TheText
            style={{ textAlign: 'center', marginHorizontal: 20 }}
            text="Create your first project to start recording field measurements"
          />
          <TheButton
            onPress={() => setShowInputs(true)}
            style={{ marginVertical: 5, width: '60%' }}
            icon={<RoundPlus width={14} height={14} color={WhiteBackground} />}
            btnTitle="Create First Project"
            disabled={role !== 'admin' && !user?.permissions?.create}
          />
        </View>
      )}
      <GapView length={useSafeAreaInsets().bottom + 10} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
  },
  initialContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: border,
    paddingVertical: 30,
    marginVertical: 20,
    backgroundColor: WhiteBackground,
    gap: 10,
  },
  newContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: primaryColor,
    paddingVertical: 25,
    marginVertical: 20,
  },
  inputsContainer: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    borderStyle: 'solid',
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: 'row',
  },
});

export default Projects;
