import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Bin, Camera, Location, File } from '../../assets';
import TheText from '../TheText';
import TheButton from '../TheButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Role, RootNavParamList } from '../../types/navigationParams';
import { Measure, Project } from '../../types';
import { useProjectStore } from '../../store/ProjectsStore';
import { useUserStore } from '../../store/UserStore';
import { Formik } from 'formik';
import { ProjectSchema } from '../../constants/validations/schema';
import {
  border,
  lightBackground,
  WhiteBackground,
} from '../../constants/colors';
import TheTextInput from '../TheTextInput';
import TheDropdown from '../TheDropdown';
import { TheDatePicker } from '..';
import { TECHS } from '../../constants';

interface MeasuresListProps {
  id: string;
  qouteNumber: string;
  name: string;
  address: string;
  techName: string;
  date: string;
  measures?: Measure[];
}

const MeasuresList = ({
  project,
  role,
  techName,
}: {
  project: MeasuresListProps;
  role: Role;
  techName: string;
}) => {
  const navigation =
    useNavigation<NativeStackScreenProps<RootNavParamList>['navigation']>();
  const { editProject } = useProjectStore();
  const { user } = useUserStore();
  const [technicians, setTechnicians] = useState<any[]>([]);
  const { db } = require('../../utils/firebase');

  const [showEdit, setShowEdit] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedProj, setSelectedProj] = useState<Project>();

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .where('role', '==', 'technician')
      .onSnapshot(
        (snapshot: any) => {
          const techList = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setTechnicians(techList);
        },
        (error: any) => {
          console.error('Error fetching technicians:', error);
        },
      );
    return () => unsubscribe();
  }, []);

  const technicianData = technicians.map(tech => ({
    label: tech.firstName + ' ' + tech.lastName,
    value: tech.id,
  }));

  const handleEditProject = (values: Project) => {
    if (!project?.id) return;

    console.log('edit values', values);

    const projInfo = {
      id: values.id,
      qouteNumber: values.qouteNumber,
      name: values.name,
      address: values.address,
      techName: values.techName,
      date: values.date,
      measures: project.measures,
    };

    editProject(projInfo);
    Alert.alert('Success', 'Project edited successfully!', [{ text: 'OK' }], {
      cancelable: false,
    });
    setShowEdit(false);
    navigation.goBack();
  };

  const handleAddMeasure = () => {
    navigation.navigate('Measurement', {
      ...project,
    });
  };

  const handleViewMeasure = (measure: Measure) => {
    navigation.navigate('Measurement', {
      ...project,
      existingMeasure: measure, // 👈 pass this
    });
  };

  return (
    <>
      {showEdit && (
        <ScrollView>
          <Formik
            initialValues={{
              id: project?.id ?? '',
              qouteNumber: project?.qouteNumber ?? '',
              name: project?.name ?? '',
              address: project?.address ?? '',
              techName: role == 'technician' ? techName! : project.techName,
              date: project?.date ?? '',
            }}
            validationSchema={ProjectSchema}
            onSubmit={handleEditProject}
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
                    text="Edit Project Details"
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
                        data={technicianData}
                        placeholder={TECHS.placeholder}
                        title={TECHS.title}
                        disabled={role == 'technician' ? true : false}
                        id={TECHS.id}
                        // style={{ flex: 1 }}
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
                      btnTitle="Edit Project"
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
                      onPress={() => setShowEdit(false)}
                    />
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      )}
      {!showEdit && (
        <FlatList
          data={project.measures || []}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={({ item, index }) => (
            <>
              <MeasureCard
                measure={item}
                onView={() => handleViewMeasure(item)}
                projectId={project.id}
              />
              {project.measures &&
              project.measures?.length % 2 &&
              index == project.measures?.length - 1 ? (
                <View style={{ flex: 1, marginHorizontal: 35 }} />
              ) : null}
            </>
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <TheText
                size={24}
                style={{ fontWeight: 'bold' }}
                text="Saved Measures"
              />
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
                >
                  {(role === 'admin' || user?.permissions?.modify) && (
                    <TheButton
                      btnTitle="Edit Project"
                      onPress={() => setShowEdit(true)}
                    />
                  )}
                  <TheButton btnTitle="Add Measure" onPress={handleAddMeasure} />
                </View>
            </View>
          }
          ListEmptyComponent={
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
                text={'No Saved Measures available.'}
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </>
  );
};

type MeasureCardProps = {
  measure: Measure;
  onView: () => void;
  projectId: string;
};

const MeasureCard = ({ measure, onView, projectId }: MeasureCardProps) => {
  const { removeMeasureFromProject } = useProjectStore();

  const handleDelete = () => {
    removeMeasureFromProject(projectId, measure.id);
  };

  const uniqueTypes = [...new Set(measure.toolsData.map(tool => tool.type))];

  return (
    <View style={styles.initialContainer}>
      <View style={styles.nameContainer}>
        <View style={{ ...styles.rowContainer, gap: 2 }}>
          <Location width={22} height={22} color={'black'} />
          <TheText
            size={18}
            style={{ fontWeight: 'bold' }}
            text={measure.location}
          />
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Bin width={22} height={22} color={'#EF4444'} />
        </TouchableOpacity>
      </View>
      {measure?.photo ? (
        <View
          style={[styles.imageContainer, { backgroundColor: 'transparent' }]}
        >
          <Image
            resizeMode="contain"
            style={{ flex: 1, width: '100%' }}
            source={{ uri: measure?.photo }}
          />
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Camera width={40} height={40} color={'#9CA3AF'} />
        </View>
      )}
      <TheText text={`Created: ${new Date().toLocaleDateString('en-GB')}`} />
      <TheText text={`Measurement Type: ${uniqueTypes}`} numberOfLines={1} />
      <TheButton
        onPress={onView}
        btnColor="#F5F5F5"
        style={{ marginVertical: 5, borderWidth: 1, borderColor: '#e0e0e0' }}
        titleColor="black"
        titleStyle={{ fontWeight: '500' }}
        btnTitle="View Details"
      />
    </View>
  );
};

export default MeasuresList;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  initialContainer: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 25,
    marginVertical: 10,
    backgroundColor: 'white',
    gap: 10,
    marginHorizontal: 10,
  },
  imageContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
