import {
  FlatList,
  StyleSheet,
  Text,
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

const MeasuresList = () => {
  return (
    <FlatList
      data={[1, 2, 3]}
      renderItem={() => <MeasureCard />}
      ListHeaderComponent={
        <TheText
          size={24}
          style={{ fontWeight: 'bold', marginVertical: 10 }}
          text="Saved Measures"
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const MeasureCard = () => {
  const navigation =
    useNavigation<NativeStackScreenProps<RootNavParamList>['navigation']>();
  return (
    <View style={styles.initialContainer}>
      <View style={styles.nameContainer}>
        <View style={{ ...styles.rowContainer, gap: 5 }}>
          <Location width={18} height={18} color={'black'} />
          <TheText size={18} style={{ fontWeight: 'bold' }} text="Location" />
        </View>
        <TouchableOpacity>
          <Bin width={18} height={18} color={'#EF4444'} />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        <Camera width={40} height={40} color={'#9CA3AF'} />
      </View>
      <TheText text="Created: 7/18/2025" />
      <TheText text="Measurement Types: tape" />
      <TheButton
        onPress={() => navigation.navigate('AllDetails')}
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
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
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
