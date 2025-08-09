import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Bin, Camera, Location } from '../../assets';
import TheText from '../TheText';
import TheButton from '../TheButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNavParamList } from '../../types/navigationParams';
import { Measure, Project } from '../../types';
import { useProjectStore } from '../../store/ProjectsStore';

interface MeasuresListProps {
  id: number;
  qouteNumber: string;
  name: string;
  address: string;
  techName: string;
  date: string;
  measures?: Measure[];
}

const MeasuresList = (project: MeasuresListProps) => {
  const navigation =
    useNavigation<NativeStackScreenProps<RootNavParamList>['navigation']>();

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
    <FlatList
      data={project.measures || []}
      keyExtractor={item => item.id}
      numColumns={2}
      renderItem={({ item }) => (
        <MeasureCard
          measure={item}
          onView={() => handleViewMeasure(item)}
          projectId={project.id}
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <TheText
            size={24}
            style={{ fontWeight: 'bold', marginVertical: 10 }}
            text="Saved Measures"
          />
          <TheButton btnTitle="Add Measure" onPress={handleAddMeasure} />
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
  );
};

type MeasureCardProps = {
  measure: Measure;
  onView: () => void;
  projectId: number;
};

const MeasureCard = ({ measure, onView, projectId }: MeasureCardProps) => {
  const { removeMeasureFromProject } = useProjectStore();

  const handleDelete = () => {
    removeMeasureFromProject(projectId, measure.id);
  };
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
      <TheText text={`Created: 07/8/2025`} />
      <TheText text={`Measurement Type: temp`} />
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
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  initialContainer: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 25,
    marginVertical: 10,
    backgroundColor: 'white',
    gap: 10,
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
