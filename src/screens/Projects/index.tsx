import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';

import {
  GapView,
  ProjectsList,
  TheButton,
  TheDatePicker,
  TheText,
  TheTextInput,
} from '../../components';
import { RoundPlus, File } from '../../assets';
import { useProjectStore } from '../../store/ProjectsStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  background,
  border,
  lightBackground,
  primaryColor,
  WhiteBackground,
} from '../../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { useNavigation } from '@react-navigation/native';

type ProjectsProps = NativeStackScreenProps<RootNavParamList, 'Projects'>;

const Projects = () => {
  const navigation = useNavigation<ProjectsProps['navigation']>();
  const projects = useProjectStore().projects;
  const increaseProjects = useProjectStore().increaseProjects;
  const [showInputs, setShowInputs] = useState(false);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: background,
        padding: 20,
      }}
    >
      <GapView />
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
      {showInputs ? (
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
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
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
                label="Quote Number *"
                placeholder="Q-2024-001"
              />
              <TheTextInput
                containerStyle={{ flex: 1 }}
                label="Client Name *"
                placeholder="John Smith"
              />
            </View>
            <TheTextInput
              label="Address *"
              placeholder="123 Main St, City, State 12345"
            />
            <View style={{ ...styles.rowContainer, gap: 15 }}>
              <TheTextInput
                containerStyle={{ flex: 1 }}
                label="Technician *"
                placeholder="Tech Name"
              />
              <TheDatePicker containerStyle={{ flex: 1 }} label="Date *" />
            </View>
          </View>
          <View style={{ ...styles.rowContainer, gap: 10 }}>
            <TheButton
              style={{ marginVertical: 5, flex: 1 }}
              btnTitle="Start Measuring"
              onPress={() => increaseProjects()}
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
      ) : (
        <View style={styles.newContainer}>
          <TheButton
            onPress={() => setShowInputs(true)}
            style={{ width: '70%' }}
            icon={<RoundPlus width={14} height={14} color={WhiteBackground} />}
            btnTitle="Create New Project"
          />
        </View>
      )}
      {projects > 0 ? (
        <ProjectsList
          projects={projects}
          onViewPress={() => {
            navigation.navigate({
              name: 'ProjectDetails',
              params: {
                projectId: '123135',
                title: 'John',
                address: '132132 adjvdjs',
                date: '2024-01-01',
                extraInfo: 'Additional info here',
              },
            });
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
            onPress={() => increaseProjects()}
            style={{ marginVertical: 5, width: '60%' }}
            icon={<RoundPlus width={14} height={14} color={WhiteBackground} />}
            btnTitle="Create First Project"
          />
        </View>
      )}
      <GapView />
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
    alignItems: 'center',
  },
});

export default Projects;
