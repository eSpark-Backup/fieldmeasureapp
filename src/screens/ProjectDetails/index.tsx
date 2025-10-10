import { StyleSheet, View } from 'react-native';
import React from 'react';

import { MeasuresList, TheText } from '../../components';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { Project } from '../../types';
import { useProjectStore } from '../../store/ProjectsStore';

type ProjectsProps = NativeStackScreenProps<RootNavParamList, 'ProjectDetails'>;

const ProjectDetails = () => {
  const route = useRoute<ProjectsProps['route']>();
  const { id: projectId, role, techName } = route.params;

  const { projects } = useProjectStore();

  console.log('projects', projects);

  // Get the latest version of the project from Zustand
  const currentProject = projects.find(proj => proj.id === projectId);

  if (!currentProject) {
    return (
      <View style={styles.mainContainer}>
        <TheText text={'Project not found.'} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <MeasuresList project={currentProject} role={role} techName={techName} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
  },
});

export default ProjectDetails;
