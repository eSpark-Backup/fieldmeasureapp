import { StyleSheet, ScrollView, View } from 'react-native';
import React from 'react';

import { MeasuresList, TheText } from '../../components';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { Project } from '../../types';

const ProjectDetails = () => {
  const route = useRoute<NativeStackScreenProps<RootNavParamList>['route']>();
  const projectInfo = route.params;

  return (
    <View style={styles.mainContainer}>
      <MeasuresList {...(projectInfo as Project)} />
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
