import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import TheButton from '../TheButton';
import TheText from '../TheText';
import { Calendar, Location, Person } from '../../assets';
import GapView from '../GapView';
import { useProjectStore } from '../../store/ProjectsStore';

const ProjectsList = ({ projects }: { projects: number }) => {
  return (
    <View style={{ flex: 1, gap: 10 }}>
      <TheText
        style={{ fontWeight: 'bold', fontSize: 20 }}
        text={`Existing Projects (${projects})`}
      />
      <ProjectCard />
    </View>
  );
};

const ProjectCard = () => {
  const decreaseProjects = useProjectStore().decreaseProjects;
  return (
    <View style={styles.container}>
      <View style={{ gap: 10 }}>
        <View style={styles.rowContainer}>
          <View style={styles.qouteNoCont}>
            <TheText text="qwf21312" size={12} style={{ fontWeight: 'bold' }} />
          </View>
          <TheText text="asd" size={16} style={{ fontWeight: 'bold' }} />
        </View>
        <View style={styles.rowContainer}>
          <Location width={16} height={16} />
          <TheText text="123 Asdwr,ewrwe" />
        </View>
        <View style={styles.rowContainer}>
          <Person width={16} height={16} />
          <TheText text="asdasd" />
          <GapView mode="horizontal" length={10} />
          <Calendar width={16} height={16} />
          <TheText text="asdasd" />
        </View>
      </View>
      <View style={{ justifyContent: 'space-around' }}>
        <TheButton style={{ padding: 5 }} btnTitle="View" />
        <TheButton
          onPress={() => decreaseProjects()}
          btnColor="#EF4443"
          style={{ padding: 5 }}
          btnTitle="Delete"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'lightgrey',
    padding: 10,
    backgroundColor: 'white',
    gap: 10,
  },
  qouteNoCont: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export default ProjectsList;
