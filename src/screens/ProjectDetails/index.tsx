import { StyleSheet, ScrollView, View } from 'react-native';
import React from 'react';

import { MeasuresList, TheText } from '../../components';

const ProjectDetails = () => {
  return (
    <View style={styles.mainContainer}>
      <MeasuresList />
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
