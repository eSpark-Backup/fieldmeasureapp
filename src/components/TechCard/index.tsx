import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { border, WhiteBackground } from '../../constants/colors';
import { Mail, Person } from '../../assets';
import TheText from '../TheText';
import TheButton from '../TheButton';
import { Technician } from '../../store/ProjectsStore';

const TechCard = ({
  techInfo,
  onEditPress,
  onDelete,
}: {
  techInfo: Technician;
  onEditPress: () => void;
  onDelete: () => void;
}) => {
  return (
    <View style={styles.container}>
      <View style={{ gap: 10 }}>
        <View style={styles.rowContainer}>
          <Person width={18} height={18} />
          <TheText
            text={techInfo.firstName + ' ' + techInfo.lastName}
            size={18}
            style={{ fontWeight: 'bold' }}
          />
        </View>
        <View style={styles.rowContainer}>
          <Mail width={22} height={22} />
          <TheText text={techInfo.email} size={18} />
        </View>
      </View>
      <View style={{ justifyContent: 'space-around', gap: 10 }}>
        <TheButton
          style={{ padding: 5 }}
          btnTitle="Edit"
          onPress={onEditPress}
        />
        <TheButton
          onPress={onDelete}
          btnColor="#EF4443"
          style={{ padding: 5 }}
          btnTitle="Delete"
        />
      </View>
    </View>
  );
};

export default TechCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: border,
    padding: 10,
    backgroundColor: WhiteBackground,
    gap: 10,
    margin: 8,
  },
  qouteNoCont: {
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: border,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
