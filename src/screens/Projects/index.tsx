import { View, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import {
  ProjectsList,
  TheButton,
  TheText,
  TheTextInput,
} from '../../components';
import { RoundPlus, File } from '../../assets';
import { useProjectStore } from '../../store/ProjectsStore';
import { background } from '../../constants/colors';

const Projects = () => {
  const projects = useProjectStore().projects;
  const increaseProjects = useProjectStore().increaseProjects;
  const [showInputs, setShowInputs] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: background,
        padding: 20,
      }}
    >
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
            borderColor: 'lightgrey',
            backgroundColor: 'white',
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
          <View style={{ gap: 10 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}
            >
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
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}
            >
              <TheTextInput
                containerStyle={{ flex: 1 }}
                label="Technician *"
                placeholder="Tech Name"
              />
              <TheTextInput
                containerStyle={{ flex: 1 }}
                label="Date *"
                placeholder="17/07/2025"
              />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TheButton
              style={{ marginVertical: 5, flex: 1 }}
              btnTitle="Create Project & Start Measuring"
              onPress={() => increaseProjects()}
            />
            <TheButton
              style={{
                width: '20%',
                marginVertical: 5,
                borderWidth: 1,
                borderColor: '#e0e0e0',
              }}
              titleColor="#000"
              btnColor="#f5f5f5"
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
            icon={<RoundPlus width={14} height={14} color={'white'} />}
            btnTitle="Create New Project"
          />
        </View>
      )}

      {projects > 0 ? (
        <ProjectsList projects={projects} />
      ) : showInputs ? null : (
        <View style={styles.initialContainer}>
          <File width={40} height={40} color={'lightgrey'} />
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
            icon={<RoundPlus width={14} height={14} color={'white'} />}
            btnTitle="Create First Project"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  initialContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    paddingVertical: 30,
    marginVertical: 20,
    backgroundColor: 'white',
    gap: 10,
  },
  newContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#2975D2',
    paddingVertical: 25,
    marginVertical: 20,
  },
});

export default Projects;
