import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ProjectsList, TheButton, TheText } from '../../components';
import { RoundPlus, File } from '../../assets';
import { useProjectStore } from '../../store/ProjectsStore';

const Projects = () => {
  const projects = useProjectStore().projects;
  const increaseProjects = useProjectStore().increaseProjects;

  console.log('Projects', projects);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f9fafb',
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
      <View style={styles.newContainer}>
        <TheButton
          onPress={() => increaseProjects()}
          style={{ width: '70%' }}
          icon={<RoundPlus width={14} height={14} color={'white'} />}
          btnTitle="Create New Project"
        />
      </View>
      {projects > 0 ? (
        <ProjectsList projects={projects} />
      ) : (
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
